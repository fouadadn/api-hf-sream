import admin from 'firebase-admin'
import { readFileSync } from 'fs'

const serviceAccount = JSON.parse(
    readFileSync(new URL('../../api-hf-stream-firebase-adminsdk-fbsvc-f39be54a0a.json', import.meta.url)) 
)

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'api-hf-stream.appspot.com'
    })
}

export const db = admin.firestore()
export const auth = admin.auth()
export const storage = admin.storage()
