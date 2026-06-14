const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyBo3whifFTMi_cwbIK1PXGcpxeUsECsbbI',
  authDomain: 'guiatur-new.firebaseapp.com',
  projectId: 'guiatur-new',
  storageBucket: 'guiatur-new.firebasestorage.app',
  messagingSenderId: '258944945956',
  appId: '1:258944945956:web:0e4e9cc21a3cef65e22db1',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ADMIN_UID = 'IJFDHa5qnqbWfmGXPTxCEM4SiR32';

async function run() {
  try {
    await setDoc(doc(db, 'usuarios', ADMIN_UID), {
      nome: 'Administrador',
      email: 'admin@guiatur.com',
      perfil: 'admin',
      idioma: 'pt-BR',
      data_cadastro: new Date(),
    }, { merge: true });
    console.log('✅ Documento admin criado/atualizado com sucesso (perfil: admin)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err);
    process.exit(1);
  }
}

run();