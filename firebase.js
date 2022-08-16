import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from "firebase/firestore"
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'twitter-f79b6.firebaseapp.com',
  projectId: 'twitter-f79b6',
  storageBucket: 'twitter-f79b6.appspot.com',
  messagingSenderId: '551995983004',
  appId: '1:551995983004:web:b5535bb3aaba18bd1e5959'
}

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp()

const db = getFirestore()
const storage = getStorage()

export {app, db, storage}
