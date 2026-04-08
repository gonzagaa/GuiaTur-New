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

const places = [
  {
    id: 'cristo-redentor',
    city: 'Rio de Janeiro',
    state: 'RJ',
    title: 'Cristo Redentor',
    shortDescription:
      'Cartão postal do Rio de Janeiro, o Cristo Redentor está localizado no alto do morro do Corcovado e é uma das principais atrações da cidade.',
    detailTitle: 'Como chegar?',
    detailText1:
      'Há diversas formas de chegar ao topo do morro Corcovado. Os ingressos custam entre R$ 13 e R$ 122, dependendo do meio de transporte, do ponto de embarque e da sua idade. Crianças até 4 anos não pagam.',
    detailText2:
      'O mais recomendado pela opinião do público, é procurar uma agência de turismo mais próxima para adquirir seu ingresso que, dependendo do valor, pode incluir:',
    bullets: [
      'Transporte de carro, do seu hotel ao morro do Corcovado.',
      'Parada na loja turística.',
      'Subida de Van para o topo do Morro.',
      'Ingresso para entrada na área do Cristo.',
      'Descida do morro através de Van.',
      'Volta para o hotel através de carro.',
    ],
    imageKey: 'cristo-redentor',
    order: 1,
    wazeUrl: 'https://waze.com/ul?ll=-22.9519,-43.2105&navigate=yes',
  },
  {
    id: 'parque-lage',
    city: 'Rio de Janeiro',
    state: 'RJ',
    title: 'Parque Lage',
    shortDescription:
      'O Parque Lage é conhecido como “sovaco do Cristo”, por estar localizado à direita do braço direito da estátua. Por lá, é possível curtir e aproveitar os 52 hectares de floresta, além de programas culturais.',
    detailTitle: 'Como chegar?',
    detailText1:
      'O Parque Lage fica aos pés do Corcovado e é um dos lugares mais agradáveis do Rio para quem busca natureza, arquitetura e um passeio mais tranquilo. A entrada costuma ser fácil e o acesso pode ser feito de carro, aplicativo ou transporte público.',
    detailText2:
      'Antes de ir, vale considerar alguns pontos importantes para aproveitar melhor a visita:',
    bullets: [
      'Prefira visitar durante o dia.',
      'Use roupa leve e calçado confortável.',
      'Leve água para caminhar com mais tranquilidade.',
      'A região é ótima para fotos e passeios culturais.',
      'Vale combinar o passeio com Jardim Botânico.',
    ],
    imageKey: 'parque-lage',
    order: 2,
    wazeUrl: 'https://waze.com/ul?ll=-22.9602,-43.2116&navigate=yes',
  },
];

async function seedMostVisitedPlaces() {
  try {
    for (const place of places) {
      const { id, ...data } = place;
      await setDoc(doc(db, 'mostVisitedPlaces', id), data);
      console.log(`✅ Local enviado: ${id}`);
    }

    console.log('🚀 Todos os locais de mais visitados foram enviados com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao enviar locais:', error);
  }
}

seedMostVisitedPlaces();