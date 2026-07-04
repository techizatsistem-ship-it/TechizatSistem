// ============================================================
// Qaimə Sistemi — Push Bildiriş (Cloudflare Pages Function)
// Bu fayl "functions/send-push.js" olaraq Pages layihənizin
// içinə qoyulur. Ayrı Worker lazım deyil — sayt deploy olanda
// bu da avtomatik "/send-push" ünvanında işə düşür.
// ============================================================

function b64u(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function ub64u(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}
function concatBytes(...arrs) {
  const len = arrs.reduce((a, b) => a + b.length, 0);
  const out = new Uint8Array(len);
  let off = 0;
  for (const a of arrs) { out.set(a, off); off += a.length; }
  return out;
}
async function hmacSha256(keyBytes, msgBytes) {
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, msgBytes));
}

async function buildVapidHeader(privateJwkStr, publicKeyB64, endpoint, subject) {
  const privateJwk = JSON.parse(privateJwkStr);
  delete privateJwk.key_ops;
  delete privateJwk.alg;
  const key = await crypto.subtle.importKey('jwk', privateJwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);

  const audience = new URL(endpoint).origin;
  const header = { typ: 'JWT', alg: 'ES256' };
  const now = Math.floor(Date.now() / 1000);
  const claims = { aud: audience, exp: now + 12 * 3600, sub: subject };
  const enc = new TextEncoder();
  const signingInput = `${b64u(enc.encode(JSON.stringify(header)))}.${b64u(enc.encode(JSON.stringify(claims)))}`;
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(signingInput));
  const jwt = `${signingInput}.${b64u(sig)}`;
  return `vapid t=${jwt}, k=${publicKeyB64}`;
}

async function encryptPayload(subscription, payloadStr) {
  const uaPublicRaw = ub64u(subscription.keys.p256dh);
  const authSecret = ub64u(subscription.keys.auth);

  const asKp = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPublicRaw = new Uint8Array(await crypto.subtle.exportKey('raw', asKp.publicKey));
  const uaPublicKey = await crypto.subtle.importKey('raw', uaPublicRaw, { name: 'ECDH', namedCurve: 'P-256' }, true, []);
  const ecdhSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaPublicKey }, asKp.privateKey, 256));

  const PRK_key = await hmacSha256(authSecret, ecdhSecret);
  const enc = new TextEncoder();
  const keyInfo = concatBytes(enc.encode('WebPush: info'), new Uint8Array([0]), uaPublicRaw, asPublicRaw);
  const IKM = await hmacSha256(PRK_key, concatBytes(keyInfo, new Uint8Array([1])));

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const PRK = await hmacSha256(salt, IKM);
  const CEK = (await hmacSha256(PRK, concatBytes(enc.encode('Content-Encoding: aes128gcm'), new Uint8Array([0, 1])))).slice(0, 16);
  const NONCE = (await hmacSha256(PRK, concatBytes(enc.encode('Content-Encoding: nonce'), new Uint8Array([0, 1])))).slice(0, 12);

  const plainBytes = concatBytes(enc.encode(payloadStr), new Uint8Array([2]));
  const cekKey = await crypto.subtle.importKey('raw', CEK, { name: 'AES-GCM' }, false, ['encrypt']);
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: NONCE }, cekKey, plainBytes));

  const rsBytes = new Uint8Array(4);
  new DataView(rsBytes.buffer).setUint32(0, 4096, false);
  const header = concatBytes(salt, rsBytes, new Uint8Array([asPublicRaw.length]), asPublicRaw);
  return concatBytes(header, cipher);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Pages Functions bu adları avtomatik tanıyır: onRequestPost, onRequestOptions
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestPost({ request, env }) {
  let payload;
  try { payload = await request.json(); }
  catch { return json({ error: 'Yanlış JSON' }, 400); }

  const { subscription, title, body } = payload;
  if (!subscription || !subscription.endpoint || !subscription.keys) {
    return json({ error: 'subscription yoxdur və ya natamamdır' }, 400);
  }

  try {
    const authHeader = await buildVapidHeader(
      env.VAPID_PRIVATE_KEY,
      env.VAPID_PUBLIC_KEY,
      subscription.endpoint,
      env.VAPID_CONTACT || 'mailto:admin@example.com'
    );
    const encryptedBody = await encryptPayload(subscription, JSON.stringify({ title: title || 'Bildiriş', body: body || '' }));

    const pushRes = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'TTL': '3600',
        'Urgency': 'high',
        'Authorization': authHeader,
      },
      body: encryptedBody,
    });

    return json({ ok: pushRes.ok, status: pushRes.status });
  } catch (e) {
    return json({ error: String(e && e.message || e) }, 500);
  }
}
