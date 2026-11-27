import { getApp, getApps, initializeApp } from 'firebase/app'
import { getDatabase, get, ref } from 'firebase/database'
import { parseRecords } from './records'
import type { TaxRecord } from '../types/dashboard'

const env = import.meta.env

export async function loadFirebaseRecords(): Promise<TaxRecord[]> {
  const required = [
    env.VITE_FIREBASE_API_KEY,
    env.VITE_FIREBASE_AUTH_DOMAIN,
    env.VITE_FIREBASE_DATABASE_URL,
    env.VITE_FIREBASE_PROJECT_ID,
    env.VITE_FIREBASE_APP_ID,
  ]
  if (required.some((value) => !value)) {
    throw new Error('Falta configurar Firebase. Revisa .env.example y las variables del despliegue.')
  }
  const app = getApps().length ? getApp() : initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  })
  const snapshot = await get(ref(getDatabase(app), 'recaudacion_2024'))
  if (!snapshot.exists()) {
    throw new Error('No hay datos en /recaudacion_2024 de Realtime Database.')
  }
  return parseRecords(snapshot.val() as unknown)
}
