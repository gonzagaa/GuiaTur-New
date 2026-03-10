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
    name: 'Cristo Redentor',
    addressLine1: 'Parque Nacional da Tijuca',
    addressLine2: 'Alto da Boa Vista - RJ',
    city: 'Rio de Janeiro',
    state: 'RJ',
    description:
      'Um dos pontos turísticos mais famosos do Brasil e símbolo do Rio de Janeiro. O local oferece uma vista panorâmica marcante da cidade e é ideal para quem quer viver uma experiência clássica e inesquecível.',
    tips: [
      'Prefira visitar pela manhã para evitar filas maiores.',
      'Confira a previsão do tempo antes de subir.',
      'Leve água e use protetor solar.',
      'Se possível, compre o ingresso antecipadamente.',
    ],
    order: 1,
  },
  {
    id: 'pao-de-acucar',
    name: 'Pão de Açúcar',
    addressLine1: 'Av. Pasteur, 520',
    addressLine2: 'Urca - RJ',
    city: 'Rio de Janeiro',
    state: 'RJ',
    description:
      'Um dos cartões-postais mais icônicos do Rio, com passeio de bondinho e vistas incríveis da Baía de Guanabara, da orla e de vários pontos da cidade.',
    tips: [
      'Vá em dias de céu limpo para aproveitar melhor a vista.',
      'O fim de tarde costuma render fotos muito bonitas.',
      'Cheque os horários de funcionamento antes de sair.',
      'Use roupa confortável para caminhar pelo local.',
    ],
    order: 2,
  },
  {
    id: 'lapa',
    name: 'Lapa',
    addressLine1: 'Arcos da Lapa',
    addressLine2: 'Centro - RJ',
    city: 'Rio de Janeiro',
    state: 'RJ',
    description:
      'Região conhecida pela vida noturna, pela música, pelos bares e pela forte presença cultural. É um ponto clássico para quem busca movimento e experiência urbana.',
    tips: [
      'Melhor visitar no fim da tarde ou à noite.',
      'Fique atento aos pertences em locais muito cheios.',
      'É um bom ponto para curtir música ao vivo e bares.',
      'Combine transporte de ida e volta com antecedência.',
    ],
    order: 3,
  },
  {
    id: 'escadaria-selaron',
    name: 'Escadaria Selarón',
    addressLine1: 'R. Manuel Carneiro',
    addressLine2: 'Santa Teresa - RJ',
    city: 'Rio de Janeiro',
    state: 'RJ',
    description:
      'Uma das escadarias mais famosas do Brasil, coberta por azulejos coloridos de várias partes do mundo. Ótima para fotos e para encaixar em um roteiro cultural pelo centro.',
    tips: [
      'Vá em horários menos cheios se quiser tirar fotos com mais calma.',
      'Use calçado confortável, pois há bastante escada.',
      'Vale combinar o passeio com Santa Teresa e Lapa.',
      'Evite carregar muitos objetos à mostra.',
    ],
    order: 4,
  },
  {
    id: 'copacabana',
    name: 'Praia de Copacabana',
    addressLine1: 'Av. Atlântica',
    addressLine2: 'Copacabana - RJ',
    city: 'Rio de Janeiro',
    state: 'RJ',
    description:
      'Uma das praias mais famosas do mundo, com orla movimentada, quiosques, ciclovia e uma atmosfera clássica do Rio de Janeiro.',
    tips: [
      'Leve protetor solar e se hidrate bem.',
      'Prefira horários de manhã cedo ou fim da tarde.',
      'Tome cuidado com objetos pessoais na areia.',
      'A orla é ótima para caminhar e tirar fotos.',
    ],
    order: 5,
  },
  {
    id: 'ipanema',
    name: 'Praia de Ipanema',
    addressLine1: 'Av. Vieira Souto',
    addressLine2: 'Ipanema - RJ',
    city: 'Rio de Janeiro',
    state: 'RJ',
    description:
      'Praia famosa pelo clima descontraído, pelo visual bonito e pelo pôr do sol marcante. É um dos melhores lugares para quem quer curtir praia e paisagem ao mesmo tempo.',
    tips: [
      'O pôr do sol em Ipanema costuma ser um dos pontos altos do passeio.',
      'A praia costuma ficar cheia em dias ensolarados.',
      'Use roupas leves e protetor solar.',
      'Vale explorar também os arredores do bairro.',
    ],
    order: 6,
  },
  {
    id: 'jardim-botanico',
    name: 'Jardim Botânico',
    addressLine1: 'R. Jardim Botânico, 1008',
    addressLine2: 'Jardim Botânico - RJ',
    city: 'Rio de Janeiro',
    state: 'RJ',
    description:
      'Um lugar excelente para quem quer um passeio mais tranquilo, com natureza, sombra, beleza paisagística e um clima mais calmo dentro da cidade.',
    tips: [
      'Ótimo para passeios durante a manhã.',
      'Leve água e vá com roupa confortável.',
      'Reserve um tempo para caminhar sem pressa.',
      'Bom lugar para fotos e momentos mais tranquilos.',
    ],
    order: 7,
  },
  {
    id: 'santa-teresa',
    name: 'Santa Teresa',
    addressLine1: 'Bairro de Santa Teresa',
    addressLine2: 'Rio de Janeiro - RJ',
    city: 'Rio de Janeiro',
    state: 'RJ',
    description:
      'Bairro charmoso, com ruas históricas, ateliês, mirantes, restaurantes e forte personalidade cultural. Ideal para quem quer conhecer um lado mais artístico do Rio.',
    tips: [
      'Vale a pena visitar com tempo para explorar o bairro.',
      'É um bom lugar para fotos e passeios culturais.',
      'Use transporte por aplicativo se quiser mais praticidade.',
      'Combine o roteiro com Escadaria Selarón e centro histórico.',
    ],
    order: 8,
  },
];

async function seedPlaces() {
  try {
    for (const place of places) {
      const { id, ...data } = place;
      await setDoc(doc(db, 'places', id), data);
      console.log(`✅ Local enviado: ${id}`);
    }

    console.log('🚀 Todos os locais foram enviados com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao enviar locais:', error);
  }
}

seedPlaces();