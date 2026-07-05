// ====== VAPID PUBLIC KEY ======
const VAPID_PUBLIC_KEY = 'BBjJacae6FJ8Kya_8df57fQ9ML_sIPPbOiMtiZYS-s-PMv5qhOMHEPfbwjxpXBZBaskc6LFjv5IEfOXJpt4j9IA';
// Ayrı Worker YOXDUR — eyni saytın öz "/send-push" ünvanı istifadə olunur
// (functions/send-push.js faylı bunu təmin edir)
const PUSH_WORKER_URL = '/send-push';
// =========================================================

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const arr = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i);
  return arr;
}

// İstifadəçi login olandan sonra çağırılır: brauzerdən icazə istəyir və
// abunəliyi Firestore-da həmin istifadəçinin sənədinə yazır.
async function setupPush(db, username, collName) {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const coll = collName || 'users';
    const reg = await navigator.serviceWorker.register('/sw.js');
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    const subJson = sub.toJSON();

    const batch = db.batch();
    let needsBatch = false;
    for (const c of ['users', 'korusers']) {
      const prevOwners = await db.collection(c).where('pushSubs', 'array-contains', subJson).get();
      prevOwners.forEach(doc => {
        if (!(c === coll && doc.id === username)) {
          batch.update(doc.ref, { pushSubs: firebase.firestore.FieldValue.arrayRemove(subJson) });
          needsBatch = true;
        }
      });
    }
    if (needsBatch) await batch.commit();

    await db.collection(coll).doc(username).update({
      pushSubs: firebase.firestore.FieldValue.arrayUnion(subJson)
    });
  } catch (e) {
    console.error('Push quraşdırma xətası:', e);
  }
}

// Çıxış edəndə çağırılmalıdır: bu cihazın abunəliyini istifadəçinin siyahısından silir,
// ki, o hesabdan çıxandan sonra ona artıq bildiriş getməsin.
async function removePushOnLogout(db, username) {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const reg = await navigator.serviceWorker.getRegistration('/sw.js');
    if (!reg) return;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    await db.collection('users').doc(username).update({
      pushSubs: firebase.firestore.FieldValue.arrayRemove(sub.toJSON())
    });
  } catch (e) {
    console.error('Push silmə xətası:', e);
  }
}

// korusers kolleksiyasındakı bir istifadəçiyə (id ilə) bildiriş göndərir.
async function sendPushToKorUser(db, korUserId, title, body) {
  try {
    if (!korUserId) return;
    const doc = await db.collection('korusers').doc(korUserId).get();
    if (!doc.exists) return;
    const subs = doc.data().pushSubs || [];
    await Promise.all(subs.map(sub =>
      fetch(PUSH_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub, title, body })
      }).catch(() => {})
    ));
  } catch (e) {
    console.error('Push göndərmə xətası (korUser):', e);
  }
}

// Müəyyən rolu olan bütün istifadəçilərə bildiriş göndərir (məs: bütün 'istehsalat' rollu istifadəçilərə).
// Qeyd: bu, YALNIZ 'users' kolleksiyasındakı sistem istifadəçilərinə baxır (rolu 'istehsalat' olanlar) —
// 'korusers' (Kim üçün? sahəsindəki korporativ müştərilər) burada iştirak etmir, onlar tamam ayrı bir şeydir.
async function sendPushToRole(db, role, title, body) {
  try {
    if (!role) return;
    const [snapArr, snapLegacy] = await Promise.all([
      db.collection('users').where('roles', 'array-contains', role).get(),
      db.collection('users').where('role', '==', role).get()
    ]);
    const seen = new Set();
    const subs = [];
    [...snapArr.docs, ...snapLegacy.docs].forEach(doc => {
      if (seen.has(doc.id)) return;
      seen.add(doc.id);
      (doc.data().pushSubs || []).forEach(s => subs.push(s));
    });
    if (subs.length === 0) {
      console.warn(`sendPushToRole: '${role}' rollu istifadəçilərdən heç birinin aktiv push abunəliyi yoxdur (cihazda bildirişə icazə verilməyib və ya heç açılmayıb).`);
      return;
    }
    await Promise.all(subs.map(sub =>
      fetch(PUSH_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub, title, body })
      }).catch(() => {})
    ));
  } catch (e) {
    console.error('Push göndərmə xətası (rol):', e);
  }
}

// Sorğu statusundakı qaimə sayı 5-in mislinə (5, 10, 15...) çatanda bütün 'istehsalat'
// rollu istifadəçilərə bildiriş göndərir. Son bildiriş edilən həddi Firestore-da (meta/counter
// sənədi — artıq mövcud və yazıla bilən bir sənəd, uydurma yeni sənəd YOXdur) saxlayır ki,
// (a) eyni həddə görə iki dəfə bildiriş getməsin, (b) say bir dəfəyə bir neçə pillə artsa
// (məs. 4-dən 7-yə) belə, keçilən hər həddə görə bildiriş qaçırılmasın.
async function checkSorguNotify(db){
  try{
    let n;
    try{
      const c = await db.collection('qaimeler').where('status','==','sorgu').count().get();
      n = c.data().count;
    }catch(countErr){
      console.warn('checkSorguNotify: count() işləmədi, tam sorğu ilə hesablanır:', countErr);
      const snap = await db.collection('qaimeler').where('status','==','sorgu').get();
      n = snap.size;
    }
    const threshold = Math.floor(n/5)*5;
    const ref = db.collection('meta').doc('counter');
    const shouldSend = await db.runTransaction(async t=>{
      const snap = await t.get(ref);
      const last = snap.exists ? (snap.data().sorguNotified||0) : 0;
      if(threshold === last) return false;
      t.set(ref, {sorguNotified: threshold}, {merge:true});
      return threshold > last && threshold >= 5;
    });
    if(shouldSend){
      console.log(`checkSorguNotify: sorğu sayı ${n}, ${threshold} həddi keçildi, istehsalat rolunə bildiriş göndərilir.`);
      await sendPushToRole(db, 'istehsalat', 'Sorğu bildirişi', `${n} ədəd sorğu var`);
    }
  }catch(e){ console.error('Sorğu bildiriş sayı xətası:', e); }
}

// Adına görə istifadəçiyə bildiriş göndərir (users kolleksiyasında name sahəsi ilə axtarır).
async function sendPushToName(db, name, title, body) {
  try {
    if (!name) return;
    const snap = await db.collection('users').where('name', '==', name).limit(1).get();
    if (snap.empty) return;
    const subs = snap.docs[0].data().pushSubs || [];
    await Promise.all(subs.map(sub =>
      fetch(PUSH_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub, title, body })
      }).catch(() => {})
    ));
  } catch (e) {
    console.error('Push göndərmə xətası:', e);
  }
}

 
