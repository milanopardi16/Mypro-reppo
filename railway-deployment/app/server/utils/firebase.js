const admin = require('firebase-admin')
const { normalizeString } = require('../utils/helpers')
const pushTokenRepository = require('../repositories/pushToken.repository')

function getFirebaseApp() {
  const projectId = normalizeString(process.env.FIREBASE_PROJECT_ID)
  const clientEmail = normalizeString(process.env.FIREBASE_CLIENT_EMAIL)
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY
  const privateKey = privateKeyRaw ? String(privateKeyRaw).replace(/\\n/g, '\n') : ''
  if (!projectId || !clientEmail || !privateKey) return null

  if (admin.apps && admin.apps.length > 0) return admin.app()
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

async function sendPushToAdmins({ title, body, data }) {
  const app = getFirebaseApp()
  if (!app) return

  const tokens = await pushTokenRepository.getAllTokens()
  if (tokens.length === 0) return

  try {
    await admin.messaging().sendEachForMulticast({
      tokens: tokens.slice(0, 500),
      notification: { title: normalizeString(title), body: normalizeString(body) },
      data: Object.fromEntries(Object.entries(data || {}).map(([k, v]) => [String(k), String(v)])),
    })
  } catch {
    // ignore push failures
  }
}

module.exports = { getFirebaseApp, sendPushToAdmins }
