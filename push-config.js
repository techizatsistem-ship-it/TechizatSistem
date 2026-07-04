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
async function setupPush(db, username) {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
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
    await db.collection('users').doc(username).update({
      pushSubs: firebase.firestore.FieldValue.arrayUnion(sub.toJSON())
    });
  } catch (e) {
    console.error('Push quraşdırma xətası:', e);
  }
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

