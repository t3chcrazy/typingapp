import { db } from '../../firebase-init'
import { addDoc, collection } from 'firebase/firestore'

export const saveRunToDB = async runDetails => {
    await addDoc(collection(db, "scores"), runDetails)
}