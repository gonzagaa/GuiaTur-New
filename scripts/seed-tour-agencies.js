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

const agencies = [
  {
    id: 'agencia-rio-tour',
    name: 'Agência RioTour',
    distanceLabel: '800m',
    addressLine1: 'Av. Copacabana, 1500',
    addressLine2: 'Copacabana - RJ',
    phone: '(11) 9 2921-2821',
    order: 1,
  },
  {
    id: 'agencia-copacapa',
    name: 'Agência CopaCapa',
    distanceLabel: '1,7km',
    addressLine1: 'Av. Pinheiros, 8101',
    addressLine2: 'Copacabana - RJ',
    phone: '(11) 9 1711-9278',
    order: 2,
  },
  {
    id: 'agencia-rjturism',
    name: 'Agência RJTurism',
    distanceLabel: '4.9km',
    addressLine1: 'Av. Delcimar, 1921',
    addressLine2: 'Copacabana - RJ',
    phone: '(11) 9 8163-9182',
    order: 3,
  },
  {
    id: 'agencia-turirio',
    name: 'Agência TuriRio',
    distanceLabel: '9km',
    addressLine1: 'Av. Cleiza, 2150',
    addressLine2: 'Ipanema - RJ',
    phone: '(11) 9 1830-1739',
    order: 4,
  },
  {
    id: 'agencia-gaviabranca',
    name: 'Agência GaviaBranca',
    distanceLabel: '12km',
    addressLine1: 'Av. Suburbo, 6100',
    addressLine2: 'Ipanema - RJ',
    phone: '(11) 9 1930-1839',
    order: 5,
  },
];

async function seedTourAgencies() {
  try {
    for (const agency of agencies) {
      const { id, ...data } = agency;
      await setDoc(doc(db, 'tourAgencies', id), data);
      console.log(`✅ Agência enviada: ${id}`);
    }

    console.log('🚀 Todas as agências foram enviadas com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao enviar agências:', error);
  }
}

seedTourAgencies();