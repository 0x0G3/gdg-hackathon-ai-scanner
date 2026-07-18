import { collection, addDoc, getDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { Scan } from "./types";

export async function createScan(url: string): Promise<string> {
  const scansRef = collection(db, "scans");
  
  const newScan = {
    url,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lighthouseSummary: {},
    chunks: [],
    finalReport: null
  };

  const docRef = await addDoc(scansRef, newScan);
  return docRef.id;
}

export async function getScan(id: string): Promise<Scan | null> {
  const docRef = doc(db, "scans", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Scan;
  } else {
    return null;
  }
}
