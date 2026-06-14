/**
 * SEED — 5 cidades brasileiras (São Paulo, Salvador, Florianópolis, Foz do Iguaçu, Gramado)
 *
 * Popula TODAS as coleções do GuiaTur de uma vez, com cityId padronizado em slug.
 * Idempotente: usa setDoc com IDs fixos, então rodar de novo SOBRESCREVE (não duplica).
 *
 * Como rodar (na raiz do projeto do app, com node_modules instalado):
 *   node scripts/seed-cidades.js
 *
 * Observações honestas sobre os dados:
 * - Pontos turísticos, descrições e coordenadas (lat/lng) são REAIS.
 * - Telefones, WhatsApp e endereços de agências/hotéis/câmbio são ILUSTRATIVOS
 *   (formato válido, mas não correspondem a estabelecimentos reais).
 * - WhatsApp no formato internacional só com dígitos: 55 + DDD + número.
 * - Imagens via URL (Unsplash). Se algum link sair do ar, troque pela URL que quiser.
 */

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

/* ------------------------------------------------------------------ */
/* CIDADES                                                            */
/* ------------------------------------------------------------------ */
const cities = [
  {
    id: 'sao-paulo-sp',
    cityId: 'sao-paulo-sp',
    cityName: 'São Paulo',
    state: 'SP',
    description:
      'Maior cidade do Brasil, São Paulo é um centro cultural, gastronômico e financeiro que nunca dorme. Oferece museus de classe mundial, parques, vida noturna intensa e a maior diversidade gastronômica do país.',
    imageUrl:
      'https://images.unsplash.com/photo-1543059080-f9b1272213d5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'salvador-ba',
    cityId: 'salvador-ba',
    cityName: 'Salvador',
    state: 'BA',
    description:
      'Primeira capital do Brasil, Salvador encanta com seu centro histórico colorido, praias urbanas, música, culinária baiana e uma das culturas afro-brasileiras mais ricas do país.',
    imageUrl:
      'https://images.unsplash.com/photo-1591726985409-2dca29c1f4e7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'florianopolis-sc',
    cityId: 'florianopolis-sc',
    cityName: 'Florianópolis',
    state: 'SC',
    description:
      'Conhecida como Ilha da Magia, Florianópolis reúne mais de 40 praias, lagoas, trilhas e uma qualidade de vida invejável. Destino certo para quem busca natureza, surfe e tranquilidade.',
    imageUrl:
      'https://images.unsplash.com/photo-1619546952812-520e98064a52?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'foz-do-iguacu-pr',
    cityId: 'foz-do-iguacu-pr',
    cityName: 'Foz do Iguaçu',
    state: 'PR',
    description:
      'Lar das majestosas Cataratas do Iguaçu, uma das Sete Maravilhas Naturais do Mundo. Na tríplice fronteira entre Brasil, Argentina e Paraguai, oferece natureza imponente e a usina de Itaipu.',
    imageUrl:
      'https://images.unsplash.com/photo-1597211833712-5e41faa202ea?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gramado-rs',
    cityId: 'gramado-rs',
    cityName: 'Gramado',
    state: 'RS',
    description:
      'Cidade serrana de clima europeu, famosa pelo charme, pela arquitetura em estilo bávaro, pelo chocolate artesanal e pelos festivais. Um dos destinos mais visitados do sul do Brasil.',
    imageUrl:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
  },
];

/* ------------------------------------------------------------------ */
/* DICAS / PONTOS TURÍSTICOS  (coleção: places)                       */
/* ------------------------------------------------------------------ */
const places = [
  // SÃO PAULO
  {
    id: 'sp-parque-ibirapuera',
    cityId: 'sao-paulo-sp', name: 'Parque Ibirapuera',
    addressLine1: 'Av. Pedro Álvares Cabral, s/n', addressLine2: 'Vila Mariana - SP',
    city: 'São Paulo', state: 'SP',
    description: 'O parque mais famoso de São Paulo, com áreas verdes, museus, ciclovias e espaços culturais. Ideal para caminhadas, piqueniques e atividades ao ar livre no coração da cidade.',
    tips: ['Vá cedo nos fins de semana para evitar lotação.', 'Alugue uma bicicleta para percorrer o parque.', 'Visite o MAM e o Planetário dentro do parque.'],
    order: 1,
  },
  {
    id: 'sp-avenida-paulista',
    cityId: 'sao-paulo-sp', name: 'Avenida Paulista',
    addressLine1: 'Av. Paulista', addressLine2: 'Bela Vista - SP',
    city: 'São Paulo', state: 'SP',
    description: 'O principal cartão-postal de São Paulo, reúne museus como o MASP, centros culturais, lojas e gastronomia. Aos domingos é fechada para carros e vira área de lazer.',
    tips: ['Aos domingos a avenida é aberta para pedestres.', 'Não perca o acervo do MASP.', 'Use o metrô para chegar com facilidade.'],
    order: 2,
  },
  {
    id: 'sp-mercado-municipal',
    cityId: 'sao-paulo-sp', name: 'Mercado Municipal',
    addressLine1: 'R. da Cantareira, 306', addressLine2: 'Centro - SP',
    city: 'São Paulo', state: 'SP',
    description: 'O "Mercadão" é um templo gastronômico paulistano, famoso pelo sanduíche de mortadela e pelo pastel de bacalhau, em um prédio histórico de vitrais deslumbrantes.',
    tips: ['Experimente o tradicional sanduíche de mortadela.', 'Prove as frutas exóticas nas bancas.', 'Vá com fome!'],
    order: 3,
  },
  // SALVADOR
  {
    id: 'ssa-pelourinho',
    cityId: 'salvador-ba', name: 'Pelourinho',
    addressLine1: 'Largo do Pelourinho', addressLine2: 'Centro Histórico - BA',
    city: 'Salvador', state: 'BA',
    description: 'Centro histórico de Salvador e Patrimônio da Humanidade pela UNESCO, com casarões coloniais coloridos, igrejas barrocas, música ao vivo e forte presença da cultura afro-baiana.',
    tips: ['Vá em grupo e prefira o período diurno.', 'Assista a uma apresentação de capoeira.', 'Visite a Igreja de São Francisco.'],
    order: 1,
  },
  {
    id: 'ssa-elevador-lacerda',
    cityId: 'salvador-ba', name: 'Elevador Lacerda',
    addressLine1: 'Praça Tomé de Sousa', addressLine2: 'Centro - BA',
    city: 'Salvador', state: 'BA',
    description: 'Cartão-postal de Salvador, liga a Cidade Alta à Cidade Baixa desde 1873. Oferece uma vista panorâmica da Baía de Todos-os-Santos.',
    tips: ['A travessia custa poucos centavos.', 'O pôr do sol da plataforma é imperdível.', 'Combine a visita com o Mercado Modelo embaixo.'],
    order: 2,
  },
  {
    id: 'ssa-farol-da-barra',
    cityId: 'salvador-ba', name: 'Farol da Barra',
    addressLine1: 'Largo do Farol da Barra', addressLine2: 'Barra - BA',
    city: 'Salvador', state: 'BA',
    description: 'Um dos pontos mais visitados de Salvador, abriga o Museu Náutico e oferece um dos mais belos pores do sol da cidade, com praia urbana ao redor.',
    tips: ['Chegue antes do pôr do sol para garantir lugar.', 'Visite o Museu Náutico no farol.', 'A praia ao redor é ótima para banho.'],
    order: 3,
  },
  // FLORIANÓPOLIS
  {
    id: 'fln-praia-da-joaquina',
    cityId: 'florianopolis-sc', name: 'Praia da Joaquina',
    addressLine1: 'Praia da Joaquina', addressLine2: 'Lagoa da Conceição - SC',
    city: 'Florianópolis', state: 'SC',
    description: 'Famosa pelas ondas perfeitas para o surfe e pelas dunas de areia onde se pratica sandboard. Um dos points mais animados da ilha.',
    tips: ['Alugue uma prancha de sandboard nas dunas.', 'Boa para surfe, atenção às correntes.', 'Vá de manhã para pegar o melhor do mar.'],
    order: 1,
  },
  {
    id: 'fln-lagoa-da-conceicao',
    cityId: 'florianopolis-sc', name: 'Lagoa da Conceição',
    addressLine1: 'Lagoa da Conceição', addressLine2: 'Centro-Leste - SC',
    city: 'Florianópolis', state: 'SC',
    description: 'Coração boêmio da ilha, com bares, restaurantes, esportes aquáticos e uma vida noturna agitada às margens de uma lagoa de águas calmas.',
    tips: ['Experimente os frutos do mar nos restaurantes.', 'Alugue um caiaque ou stand-up paddle.', 'A vida noturna é intensa nos fins de semana.'],
    order: 2,
  },
  {
    id: 'fln-praia-mole',
    cityId: 'florianopolis-sc', name: 'Praia Mole',
    addressLine1: 'Praia Mole', addressLine2: 'Leste da Ilha - SC',
    city: 'Florianópolis', state: 'SC',
    description: 'Cercada por morros verdes, é uma das praias mais bonitas e badaladas de Floripa, point de surfistas e do público jovem.',
    tips: ['Ótima para surfe e para curtir o visual.', 'Tem quiosques com música.', 'O acesso é fácil de carro.'],
    order: 3,
  },
  // FOZ DO IGUAÇU
  {
    id: 'foz-cataratas',
    cityId: 'foz-do-iguacu-pr', name: 'Cataratas do Iguaçu',
    addressLine1: 'Rodovia BR-469, Km 18', addressLine2: 'Parque Nacional do Iguaçu - PR',
    city: 'Foz do Iguaçu', state: 'PR',
    description: 'Uma das Sete Maravilhas Naturais do Mundo, com 275 quedas d\'água espalhadas em meio à mata atlântica. Um espetáculo natural absolutamente imperdível.',
    tips: ['Leve capa de chuva, você vai se molhar.', 'Compre o ingresso online com antecedência.', 'Reserve ao menos meio dia para a visita.'],
    order: 1,
  },
  {
    id: 'foz-itaipu',
    cityId: 'foz-do-iguacu-pr', name: 'Usina de Itaipu',
    addressLine1: 'Av. Tancredo Neves, 6702', addressLine2: 'Itaipu - PR',
    city: 'Foz do Iguaçu', state: 'PR',
    description: 'Uma das maiores hidrelétricas do mundo, oferece visitas guiadas que mostram a grandiosidade da engenharia e um show de luzes noturno na barragem.',
    tips: ['Há diferentes tipos de tour, escolha o seu.', 'O Iluminação Monumental à noite é incrível.', 'Agende a visita pelo site oficial.'],
    order: 2,
  },
  {
    id: 'foz-marco-tres-fronteiras',
    cityId: 'foz-do-iguacu-pr', name: 'Marco das Três Fronteiras',
    addressLine1: 'Av. Gen. Meira, s/n', addressLine2: 'Porto Meira - PR',
    city: 'Foz do Iguaçu', state: 'PR',
    description: 'Ponto onde se encontram Brasil, Argentina e Paraguai, com vista para os três países e um complexo turístico com gastronomia e espetáculos.',
    tips: ['O fim de tarde tem show de luzes e cores.', 'Dá para ver os três países de um só lugar.', 'Combine com um jantar no local.'],
    order: 3,
  },
  // GRAMADO
  {
    id: 'gra-rua-coberta',
    cityId: 'gramado-rs', name: 'Rua Coberta',
    addressLine1: 'R. Madre Verônica', addressLine2: 'Centro - RS',
    city: 'Gramado', state: 'RS',
    description: 'Charmosa rua coberta no centro de Gramado, com cafés, restaurantes e lojas. Ponto de encontro animado, especialmente decorado nas festas de fim de ano.',
    tips: ['Ótima para um café da tarde.', 'A decoração de Natal é espetacular.', 'Fica cheia à noite, vá com calma.'],
    order: 1,
  },
  {
    id: 'gra-lago-negro',
    cityId: 'gramado-rs', name: 'Lago Negro',
    addressLine1: 'R. A. J. Renner', addressLine2: 'Centro - RS',
    city: 'Gramado', state: 'RS',
    description: 'Lago cercado por araucárias e hortênsias, onde é possível passear de pedalinho. Um dos cenários mais românticos e fotografados da cidade.',
    tips: ['Ande de pedalinho em forma de cisne.', 'A primavera com as flores é linda.', 'Leve um casaco, costuma ser frio.'],
    order: 2,
  },
  {
    id: 'gra-mini-mundo',
    cityId: 'gramado-rs', name: 'Mini Mundo',
    addressLine1: 'R. Horácio Cardoso, 291', addressLine2: 'Centro - RS',
    city: 'Gramado', state: 'RS',
    description: 'Parque temático com réplicas em miniatura de construções europeias e brasileiras. Diversão para todas as idades em meio a jardins bem cuidados.',
    tips: ['Ótimo passeio para famílias com crianças.', 'Reserve cerca de 1h30 para a visita.', 'As miniaturas são ricas em detalhes.'],
    order: 3,
  },
];

/* ------------------------------------------------------------------ */
/* MAIS VISITADOS  (coleção: mostVisitedPlaces)                       */
/* Usa imageUrl (não imageKey local).                                 */
/* ------------------------------------------------------------------ */
const mostVisited = [
  // SÃO PAULO
  {
    id: 'mv-sp-ibirapuera', cityId: 'sao-paulo-sp', city: 'São Paulo', state: 'SP',
    title: 'Parque Ibirapuera', shortDescription: 'O parque mais icônico de SP, com museus, lagos e áreas verdes para relaxar.',
    detailTitle: 'Como aproveitar?', detailText1: 'O Ibirapuera é o pulmão verde de São Paulo, perfeito para caminhar, pedalar e visitar museus.',
    detailText2: 'Reserve algumas horas para conhecer o MAM, o Planetário e a Marquesa.',
    bullets: ['Entrada gratuita no parque', 'Aluguel de bicicletas no local', 'Museus dentro do parque', 'Ótimo para piquenique'],
    imageUrl: 'https://images.unsplash.com/photo-1583255448430-17c5f2c9b8d3?auto=format&fit=crop&w=1200&q=80',
    order: 1, wazeUrl: 'https://waze.com/ul?ll=-23.5874,-46.6576&navigate=yes',
  },
  {
    id: 'mv-sp-paulista', cityId: 'sao-paulo-sp', city: 'São Paulo', state: 'SP',
    title: 'Avenida Paulista', shortDescription: 'O coração cultural e financeiro de São Paulo, com o MASP e muita vida.',
    detailTitle: 'Como aproveitar?', detailText1: 'A Paulista concentra museus, centros culturais e comércio, sendo o cartão-postal da cidade.',
    detailText2: 'Aos domingos a via é fechada para carros e tomada por pedestres e artistas.',
    bullets: ['MASP e seus vãos livres', 'Aberta a pedestres aos domingos', 'Fácil acesso por metrô', 'Centros culturais gratuitos'],
    imageUrl: 'https://images.unsplash.com/photo-1554168848-228452c09d60?auto=format&fit=crop&w=1200&q=80',
    order: 2, wazeUrl: 'https://waze.com/ul?ll=-23.5614,-46.6559&navigate=yes',
  },
  // SALVADOR
  {
    id: 'mv-ssa-pelourinho', cityId: 'salvador-ba', city: 'Salvador', state: 'BA',
    title: 'Pelourinho', shortDescription: 'Centro histórico colorido, Patrimônio da Humanidade, com música e cultura.',
    detailTitle: 'Como aproveitar?', detailText1: 'O Pelourinho é o coração histórico de Salvador, repleto de casarões coloniais e igrejas barrocas.',
    detailText2: 'Aproveite as apresentações de música e capoeira que acontecem nas ruas e largos.',
    bullets: ['Patrimônio da UNESCO', 'Apresentações culturais ao vivo', 'Igrejas históricas', 'Prefira o período diurno'],
    imageUrl: 'https://images.unsplash.com/photo-1665594051307-1c0a8e5f4c6c?auto=format&fit=crop&w=1200&q=80',
    order: 1, wazeUrl: 'https://waze.com/ul?ll=-12.9714,-38.5089&navigate=yes',
  },
  {
    id: 'mv-ssa-farol', cityId: 'salvador-ba', city: 'Salvador', state: 'BA',
    title: 'Farol da Barra', shortDescription: 'O melhor pôr do sol de Salvador, com praia urbana e museu náutico.',
    detailTitle: 'Como aproveitar?', detailText1: 'O Farol da Barra é um dos pontos mais visitados da cidade, com vista deslumbrante para o mar.',
    detailText2: 'Chegue no fim de tarde para garantir um bom lugar e curtir o pôr do sol.',
    bullets: ['Pôr do sol imperdível', 'Museu Náutico no farol', 'Praia urbana ao redor', 'Bares e quiosques próximos'],
    imageUrl: 'https://images.unsplash.com/photo-1591726985409-2dca29c1f4e7?auto=format&fit=crop&w=1200&q=80',
    order: 2, wazeUrl: 'https://waze.com/ul?ll=-13.0103,-38.5326&navigate=yes',
  },
  // FLORIANÓPOLIS
  {
    id: 'mv-fln-joaquina', cityId: 'florianopolis-sc', city: 'Florianópolis', state: 'SC',
    title: 'Praia da Joaquina', shortDescription: 'Ondas perfeitas para surfe e dunas para sandboard na Ilha da Magia.',
    detailTitle: 'Como aproveitar?', detailText1: 'A Joaquina é point de surfistas e oferece dunas de areia onde se pratica sandboard.',
    detailText2: 'Vá pela manhã para aproveitar o melhor do mar e menos vento.',
    bullets: ['Ótima para surfe', 'Sandboard nas dunas', 'Visual deslumbrante', 'Atenção às correntes'],
    imageUrl: 'https://images.unsplash.com/photo-1619546952812-520e98064a52?auto=format&fit=crop&w=1200&q=80',
    order: 1, wazeUrl: 'https://waze.com/ul?ll=-27.6281,-48.4514&navigate=yes',
  },
  {
    id: 'mv-fln-lagoa', cityId: 'florianopolis-sc', city: 'Florianópolis', state: 'SC',
    title: 'Lagoa da Conceição', shortDescription: 'O point boêmio da ilha, com bares, esportes aquáticos e vida noturna.',
    detailTitle: 'Como aproveitar?', detailText1: 'A Lagoa é o centro da vida social de Floripa, com gastronomia e esportes na água.',
    detailText2: 'Experimente os frutos do mar e alugue um caiaque para explorar a lagoa.',
    bullets: ['Esportes aquáticos', 'Restaurantes de frutos do mar', 'Vida noturna agitada', 'Águas calmas'],
    imageUrl: 'https://images.unsplash.com/photo-1583266020684-15f4f2c1d3d0?auto=format&fit=crop&w=1200&q=80',
    order: 2, wazeUrl: 'https://waze.com/ul?ll=-27.6017,-48.4669&navigate=yes',
  },
  // FOZ DO IGUAÇU
  {
    id: 'mv-foz-cataratas', cityId: 'foz-do-iguacu-pr', city: 'Foz do Iguaçu', state: 'PR',
    title: 'Cataratas do Iguaçu', shortDescription: 'Uma das Sete Maravilhas Naturais do Mundo, com 275 quedas d\'água.',
    detailTitle: 'Como aproveitar?', detailText1: 'As Cataratas são um espetáculo natural imperdível, em meio à mata atlântica preservada.',
    detailText2: 'Leve capa de chuva e reserve ao menos meio dia para percorrer as trilhas.',
    bullets: ['Sete Maravilhas Naturais', 'Leve capa de chuva', 'Ingresso online recomendado', 'Trilhas acessíveis'],
    imageUrl: 'https://images.unsplash.com/photo-1597211833712-5e41faa202ea?auto=format&fit=crop&w=1200&q=80',
    order: 1, wazeUrl: 'https://waze.com/ul?ll=-25.6953,-54.4367&navigate=yes',
  },
  {
    id: 'mv-foz-itaipu', cityId: 'foz-do-iguacu-pr', city: 'Foz do Iguaçu', state: 'PR',
    title: 'Usina de Itaipu', shortDescription: 'Uma das maiores hidrelétricas do mundo, com tours e show de luzes.',
    detailTitle: 'Como aproveitar?', detailText1: 'A visita guiada mostra a grandiosidade da engenharia desta usina binacional.',
    detailText2: 'À noite, a Iluminação Monumental ilumina a barragem em um espetáculo único.',
    bullets: ['Visitas guiadas', 'Iluminação noturna', 'Agende pelo site oficial', 'Vários tipos de tour'],
    imageUrl: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&w=1200&q=80',
    order: 2, wazeUrl: 'https://waze.com/ul?ll=-25.4083,-54.5889&navigate=yes',
  },
  // GRAMADO
  {
    id: 'mv-gra-lago-negro', cityId: 'gramado-rs', city: 'Gramado', state: 'RS',
    title: 'Lago Negro', shortDescription: 'Lago romântico cercado de araucárias e hortênsias, com pedalinhos.',
    detailTitle: 'Como aproveitar?', detailText1: 'O Lago Negro é um dos cartões-postais de Gramado, perfeito para um passeio tranquilo.',
    detailText2: 'Ande de pedalinho e aproveite as flores, especialmente na primavera.',
    bullets: ['Passeio de pedalinho', 'Cenário romântico', 'Lindo na primavera', 'Leve agasalho'],
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    order: 1, wazeUrl: 'https://waze.com/ul?ll=-29.3897,-50.8731&navigate=yes',
  },
  {
    id: 'mv-gra-rua-coberta', cityId: 'gramado-rs', city: 'Gramado', state: 'RS',
    title: 'Rua Coberta', shortDescription: 'O point gastronômico de Gramado, charmoso e decorado o ano todo.',
    detailTitle: 'Como aproveitar?', detailText1: 'A Rua Coberta concentra cafés, restaurantes e lojas no centro da cidade.',
    detailText2: 'Visite à tarde para um café e volte à noite para curtir o movimento.',
    bullets: ['Cafés e restaurantes', 'Decoração de Natal famosa', 'Ponto de encontro central', 'Movimentada à noite'],
    imageUrl: 'https://images.unsplash.com/photo-1609925252754-43e6e2c2c6f2?auto=format&fit=crop&w=1200&q=80',
    order: 2, wazeUrl: 'https://waze.com/ul?ll=-29.3786,-50.8739&navigate=yes',
  },
];

/* ------------------------------------------------------------------ */
/* AGÊNCIAS DE TURISMO  (coleção: tourAgencies)                       */
/* phone + whatsapp (formato 55+DDD+numero). SEM distanceLabel.       */
/* ------------------------------------------------------------------ */
const tourAgencies = [
  // SÃO PAULO (DDD 11)
  { id: 'ag-sp-1', cityId: 'sao-paulo-sp', name: 'Agência Paulista Tour', addressLine1: 'Av. Paulista, 1000', addressLine2: 'Bela Vista - SP', phone: '(11) 3000-1010', whatsapp: '5511930001010', order: 1 },
  { id: 'ag-sp-2', cityId: 'sao-paulo-sp', name: 'Agência SP City Tours', addressLine1: 'R. Augusta, 500', addressLine2: 'Consolação - SP', phone: '(11) 3000-2020', whatsapp: '5511930002020', order: 2 },
  // SALVADOR (DDD 71)
  { id: 'ag-ssa-1', cityId: 'salvador-ba', name: 'Agência Bahia Receptivo', addressLine1: 'Av. Sete de Setembro, 200', addressLine2: 'Barra - BA', phone: '(71) 3000-3030', whatsapp: '5571930003030', order: 1 },
  { id: 'ag-ssa-2', cityId: 'salvador-ba', name: 'Agência Salvador Tour', addressLine1: 'R. Chile, 15', addressLine2: 'Centro - BA', phone: '(71) 3000-4040', whatsapp: '5571930004040', order: 2 },
  // FLORIANÓPOLIS (DDD 48)
  { id: 'ag-fln-1', cityId: 'florianopolis-sc', name: 'Agência Ilha Tour', addressLine1: 'Av. das Rendeiras, 300', addressLine2: 'Lagoa - SC', phone: '(48) 3000-5050', whatsapp: '5548930005050', order: 1 },
  { id: 'ag-fln-2', cityId: 'florianopolis-sc', name: 'Agência Floripa Receptivo', addressLine1: 'R. Bocaiúva, 80', addressLine2: 'Centro - SC', phone: '(48) 3000-6060', whatsapp: '5548930006060', order: 2 },
  // FOZ (DDD 45)
  { id: 'ag-foz-1', cityId: 'foz-do-iguacu-pr', name: 'Agência Cataratas Tour', addressLine1: 'Av. Brasil, 1200', addressLine2: 'Centro - PR', phone: '(45) 3000-7070', whatsapp: '5545930007070', order: 1 },
  { id: 'ag-foz-2', cityId: 'foz-do-iguacu-pr', name: 'Agência Iguaçu Receptivo', addressLine1: 'Av. Jorge Schimmelpfeng, 450', addressLine2: 'Centro - PR', phone: '(45) 3000-8080', whatsapp: '5545930008080', order: 2 },
  // GRAMADO (DDD 54)
  { id: 'ag-gra-1', cityId: 'gramado-rs', name: 'Agência Serra Gaúcha Tour', addressLine1: 'Av. Borges de Medeiros, 2000', addressLine2: 'Centro - RS', phone: '(54) 3000-9090', whatsapp: '5554930009090', order: 1 },
  { id: 'ag-gra-2', cityId: 'gramado-rs', name: 'Agência Gramado Receptivo', addressLine1: 'R. Coberta, 100', addressLine2: 'Centro - RS', phone: '(54) 3000-1212', whatsapp: '5554930001212', order: 2 },
];

/* ------------------------------------------------------------------ */
/* HOTÉIS  (coleção: hotels)                                          */
/* ------------------------------------------------------------------ */
const hotels = [
  // SÃO PAULO
  { id: 'ho-sp-1', cityId: 'sao-paulo-sp', name: 'Hotel Paulista Plaza', address: 'Av. Paulista, 1500 - SP', price: 420, rating: 4.5, phone: '(11) 3200-1000', whatsapp: '5511932001000', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', order: 1 },
  { id: 'ho-sp-2', cityId: 'sao-paulo-sp', name: 'Hotel Jardins Boutique', address: 'R. Oscar Freire, 800 - SP', price: 650, rating: 4.7, phone: '(11) 3200-2000', whatsapp: '5511932002000', imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80', order: 2 },
  // SALVADOR
  { id: 'ho-ssa-1', cityId: 'salvador-ba', name: 'Hotel Barra Mar', address: 'Av. Oceânica, 300 - BA', price: 380, rating: 4.4, phone: '(71) 3200-3000', whatsapp: '5571932003000', imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', order: 1 },
  { id: 'ho-ssa-2', cityId: 'salvador-ba', name: 'Pousada Pelô Histórico', address: 'Largo do Pelourinho, 25 - BA', price: 290, rating: 4.3, phone: '(71) 3200-4000', whatsapp: '5571932004000', imageUrl: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=80', order: 2 },
  // FLORIANÓPOLIS
  { id: 'ho-fln-1', cityId: 'florianopolis-sc', name: 'Hotel Ilha da Magia', address: 'Av. das Rendeiras, 500 - SC', price: 410, rating: 4.6, phone: '(48) 3200-5000', whatsapp: '5548932005000', imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', order: 1 },
  { id: 'ho-fln-2', cityId: 'florianopolis-sc', name: 'Pousada Lagoa Azul', address: 'R. da Lagoa, 120 - SC', price: 320, rating: 4.5, phone: '(48) 3200-6000', whatsapp: '5548932006000', imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', order: 2 },
  // FOZ
  { id: 'ho-foz-1', cityId: 'foz-do-iguacu-pr', name: 'Hotel Cataratas Park', address: 'Rod. das Cataratas, Km 10 - PR', price: 480, rating: 4.7, phone: '(45) 3200-7000', whatsapp: '5545932007000', imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80', order: 1 },
  { id: 'ho-foz-2', cityId: 'foz-do-iguacu-pr', name: 'Hotel Tríplice Fronteira', address: 'Av. Brasil, 900 - PR', price: 350, rating: 4.4, phone: '(45) 3200-8000', whatsapp: '5545932008000', imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', order: 2 },
  // GRAMADO
  { id: 'ho-gra-1', cityId: 'gramado-rs', name: 'Hotel Serra Encantada', address: 'Av. Borges de Medeiros, 2500 - RS', price: 520, rating: 4.8, phone: '(54) 3200-9000', whatsapp: '5554932009000', imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80', order: 1 },
  { id: 'ho-gra-2', cityId: 'gramado-rs', name: 'Pousada Vale dos Pinheiros', address: 'R. Bela Vista, 70 - RS', price: 390, rating: 4.6, phone: '(54) 3200-1313', whatsapp: '5554932001313', imageUrl: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=80', order: 2 },
];

/* ------------------------------------------------------------------ */
/* INTERCÂMBIO / CÂMBIO  (coleção: exchanges)                         */
/* ------------------------------------------------------------------ */
const exchanges = [
  // SÃO PAULO
  { id: 'ex-sp-1', cityId: 'sao-paulo-sp', name: 'Câmbio Paulista', address: 'Av. Paulista, 2000 - SP', currencies: ['USD', 'EUR', 'GBP'], rating: 4.5, phone: '(11) 3400-1000', whatsapp: '5511934001000', openingHours: 'Seg a Sex - 09h às 17h', order: 1 },
  { id: 'ex-sp-2', cityId: 'sao-paulo-sp', name: 'SP Intercâmbio', address: 'R. Augusta, 1200 - SP', currencies: ['USD', 'EUR'], rating: 4.4, phone: '(11) 3400-2000', whatsapp: '5511934002000', openingHours: 'Seg a Sex - 10h às 18h', order: 2 },
  // SALVADOR
  { id: 'ex-ssa-1', cityId: 'salvador-ba', name: 'Câmbio Bahia', address: 'Av. Sete de Setembro, 400 - BA', currencies: ['USD', 'EUR'], rating: 4.3, phone: '(71) 3400-3000', whatsapp: '5571934003000', openingHours: 'Seg a Sex - 09h às 17h', order: 1 },
  { id: 'ex-ssa-2', cityId: 'salvador-ba', name: 'Salvador Câmbio Turismo', address: 'R. Chile, 50 - BA', currencies: ['USD', 'EUR', 'ARS'], rating: 4.2, phone: '(71) 3400-4000', whatsapp: '5571934004000', openingHours: 'Seg a Sáb - 09h às 16h', order: 2 },
  // FLORIANÓPOLIS
  { id: 'ex-fln-1', cityId: 'florianopolis-sc', name: 'Floripa Câmbio', address: 'R. Felipe Schmidt, 300 - SC', currencies: ['USD', 'EUR'], rating: 4.5, phone: '(48) 3400-5000', whatsapp: '5548934005000', openingHours: 'Seg a Sex - 09h às 18h', order: 1 },
  { id: 'ex-fln-2', cityId: 'florianopolis-sc', name: 'Ilha Intercâmbio', address: 'Av. Beira Mar, 150 - SC', currencies: ['USD', 'EUR', 'ARS'], rating: 4.4, phone: '(48) 3400-6000', whatsapp: '5548934006000', openingHours: 'Seg a Sex - 10h às 17h', order: 2 },
  // FOZ
  { id: 'ex-foz-1', cityId: 'foz-do-iguacu-pr', name: 'Câmbio Tríplice Fronteira', address: 'Av. Brasil, 600 - PR', currencies: ['USD', 'EUR', 'ARS', 'PYG'], rating: 4.6, phone: '(45) 3400-7000', whatsapp: '5545934007000', openingHours: 'Seg a Sáb - 08h às 18h', order: 1 },
  { id: 'ex-foz-2', cityId: 'foz-do-iguacu-pr', name: 'Foz Câmbio Turismo', address: 'Av. Jorge Schimmelpfeng, 200 - PR', currencies: ['USD', 'ARS', 'PYG'], rating: 4.3, phone: '(45) 3400-8000', whatsapp: '5545934008000', openingHours: 'Seg a Sex - 09h às 17h', order: 2 },
  // GRAMADO
  { id: 'ex-gra-1', cityId: 'gramado-rs', name: 'Serra Câmbio', address: 'Av. Borges de Medeiros, 1800 - RS', currencies: ['USD', 'EUR'], rating: 4.5, phone: '(54) 3400-9000', whatsapp: '5554934009000', openingHours: 'Seg a Sex - 09h às 18h', order: 1 },
  { id: 'ex-gra-2', cityId: 'gramado-rs', name: 'Gramado Intercâmbio', address: 'R. Coberta, 60 - RS', currencies: ['USD', 'EUR', 'ARS'], rating: 4.4, phone: '(54) 3400-1414', whatsapp: '5554934001414', openingHours: 'Seg a Sáb - 09h às 17h', order: 2 },
];

/* ------------------------------------------------------------------ */
/* ZONAS DE RISCO  (coleção: riskZones)                               */
/* Coordenadas reais aproximadas de áreas centrais de cada cidade.    */
/* ------------------------------------------------------------------ */
const riskZones = [
  { id: 'rz-sp-1', cityId: 'sao-paulo-sp', description: 'Área central com maior incidência de furtos. Redobre a atenção com pertences.', riskLevel: 'Médio', lat: -23.5431, lng: -46.6291 },
  { id: 'rz-ssa-1', cityId: 'salvador-ba', description: 'Região do centro histórico que demanda atenção, principalmente à noite.', riskLevel: 'Médio', lat: -12.9747, lng: -38.5108 },
  { id: 'rz-fln-1', cityId: 'florianopolis-sc', description: 'Área de movimento intenso onde se recomenda cuidado com objetos pessoais.', riskLevel: 'Baixo', lat: -27.5969, lng: -48.5495 },
  { id: 'rz-foz-1', cityId: 'foz-do-iguacu-pr', description: 'Região de fronteira com fluxo elevado de pessoas; mantenha atenção.', riskLevel: 'Médio', lat: -25.5095, lng: -54.5882 },
  { id: 'rz-gra-1', cityId: 'gramado-rs', description: 'Área central turística; cuidado padrão com pertences em locais cheios.', riskLevel: 'Baixo', lat: -29.3747, lng: -50.8769 },
];

/* ------------------------------------------------------------------ */
/* EXECUÇÃO                                                           */
/* ------------------------------------------------------------------ */
async function seedCollection(collectionName, items) {
  let count = 0;
  for (const item of items) {
    const { id, ...data } = item;
    await setDoc(doc(db, collectionName, id), data);
    count++;
  }
  console.log(`  ✓ ${collectionName}: ${count} documentos gravados`);
}

async function run() {
  console.log('🌱 Iniciando seed das 5 cidades...\n');
  try {
    await seedCollection('cities', cities);
    await seedCollection('places', places);
    await seedCollection('mostVisitedPlaces', mostVisited);
    await seedCollection('tourAgencies', tourAgencies);
    await seedCollection('hotels', hotels);
    await seedCollection('exchanges', exchanges);
    await seedCollection('riskZones', riskZones);
    console.log('\n✅ Seed concluído com sucesso! Abra o admin ou o app para conferir.');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Erro durante o seed:', err);
    process.exit(1);
  }
}

run();
