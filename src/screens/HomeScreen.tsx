import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../theme/colors';
import { useDestination } from '../contexts/DestinationContext';
import { db } from '../services/firebase';

const FALLBACK_DESCRIPTION =
  'Explore os melhores destinos, dicas e agências locais para tornar a sua viagem inesquecível.';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type MenuItem = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  enabled?: boolean;
  route?: keyof RootStackParamList;
};

const menuItems: MenuItem[] = [
  {
    id: '1',
    title: 'Hotéis',
    image: require('../../assets/icons/hoteis.png'),
    enabled: true,
    route: 'Hotels',
  },
  {
    id: '2',
    title: 'Mais visitados',
    image: require('../../assets/icons/maisvisitados.png'),
    enabled: true,
    route: 'MostVisitedList',
  },
  {
    id: '3',
    title: 'Baixa segurança',
    image: require('../../assets/icons/baixaseguranca.png'),
    enabled: true,
    route: 'LowSecurity',
  },
  {
    id: '4',
    title: 'Intercâmbio',
    image: require('../../assets/icons/intercambio.png'),
    enabled: true,
    route: 'Exchange',
  },
  {
    id: '5',
    title: 'Agências de Turismo',
    image: require('../../assets/icons/agenciasdeturismo.png'),
    enabled: true,
    route: 'TourAgencies',
  },
  {
    id: '6',
    title: 'Dicas',
    image: require('../../assets/icons/dicas.png'),
    enabled: true,
    route: 'PlacesList',
  },
];

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { destination } = useDestination();
  const [description, setDescription] = useState<string>(FALLBACK_DESCRIPTION);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCity() {
      if (!destination) {
        setDescription(FALLBACK_DESCRIPTION);
        setHeroImageUrl(null);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'cities', destination.cityId));
        const data = snap.data() as
          | { description?: string; imageUrl?: string }
          | undefined;
        if (cancelled) return;
        setDescription(data?.description?.trim() || FALLBACK_DESCRIPTION);
        setHeroImageUrl(data?.imageUrl?.trim() || null);
      } catch (error) {
        console.error('Erro ao buscar descrição da cidade:', error);
        if (!cancelled) {
          setDescription(FALLBACK_DESCRIPTION);
          setHeroImageUrl(null);
        }
      }
    }

    fetchCity();
    return () => {
      cancelled = true;
    };
  }, [destination]);

  function handleMenuPress(item: MenuItem) {
    console.log('Menu press:', item.title, item.enabled, item.route);
    if (!item.enabled || !item.route) return;
    navigation.navigate(item.route as never);
  }

  const cityLabel = destination
    ? `${destination.cityName}, ${destination.state}.`
    : 'Selecione um destino';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: 120 },
        ]}
      >

        <Image
          source={
            heroImageUrl
              ? { uri: heroImageUrl }
              : require('../../assets/images/riodejaneiro.jpg')
          }
          style={styles.heroImage}
          resizeMode="cover"
        />

        <Text style={styles.cityTitle}>{cityLabel}</Text>

        <Text style={styles.description}>{description}</Text>


        <View style={styles.divider} />

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <View key={item.id} style={styles.gridItemWrapper}>
              <Pressable
                onPress={() => handleMenuPress(item)}
                style={({ pressed }) => [
                  styles.card,
                  item.enabled && styles.cardEnabled,
                  pressed && item.enabled && styles.cardPressed,
                ]}
              >
                <Image
                  source={item.image}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </Pressable>

              <Text
                style={[
                  styles.cardLabel,
                  item.title === 'Agências de Turismo' && styles.smallLabel,
                ]}
              >
                {item.title}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <Ionicons name="home" size={34} color={colors.black} />
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={34} color="#46306F" />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('LocationSearch')}>
          <Ionicons name="search" size={34} color="#46306F" />
        </Pressable>
        <Ionicons name="arrow-undo" size={34} color="#46306F" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  cityTitle: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    color: '#777777',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: 330,
    alignSelf: 'center',
    marginBottom: 26,
  },
  heroImage: {
    width: "100%",
    height: 150,
    objectFit: "cover",
    alignSelf: 'center',
    marginBottom: 26,
    borderRadius: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#3E3E3E',
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 28,
  },
  gridItemWrapper: {
    width: '30.5%',
    alignItems: 'center',
  },
  card: {
    width: 98,
    height: 98,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2F2F2F',
  },
  cardEnabled: {
    
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },
  cardImage: {
    width: 58,
    height: 58,
  },
  cardLabel: {
    color: '#9D9D9D',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
  smallLabel: {
    fontSize: 12,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#7F5BCB',
    minHeight: 72,
    paddingTop: 10,
    paddingHorizontal: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#6E4EB3',
  },
});