import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBo3whifFTMi_cwbIK1PXGcpxeUsECsbbI',
  authDomain: 'guiatur-new.firebaseapp.com',
  projectId: 'guiatur-new',
  storageBucket: 'guiatur-new.firebasestorage.app',
  messagingSenderId: '258944945956',
  appId: '1:258944945956:web:0e4e9cc21a3cef65e22db1',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);