import React from 'react';
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
import { RootStackParamList } from '../types/navigation';
import { colors } from '../theme/colors';

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
    enabled: false,
  },
  {
    id: '2',
    title: 'Mais visitados',
    image: require('../../assets/icons/maisvisitados.png'),
    enabled: false,
  },
  {
    id: '3',
    title: 'Baixa segurança',
    image: require('../../assets/icons/baixaseguranca.png'),
    enabled: false,
  },
  {
    id: '4',
    title: 'Intercâmbio',
    image: require('../../assets/icons/intercambio.png'),
    enabled: false,
  },
  {
    id: '5',
    title: 'Agências de Turismo',
    image: require('../../assets/icons/agenciasdeturismo.png'),
    enabled: false,
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

  function handleMenuPress(item: MenuItem) {
    if (!item.enabled || !item.route) return;
    navigation.navigate(item.route as never);
  }

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
          source={require('../../assets/images/riodejaneiro.jpg')}
          style={styles.heroImage}
          resizeMode="contain"
        />

        <Text style={styles.cityTitle}>Rio de Janeiro, RJ.</Text>

        <Text style={styles.description}>
          Situada em uma deslumbrante baía cercada por montanhas cobertas de
          florestas tropicais, o Rio é um destino imperdível para quem busca
          sol, praias paradisíacas, cultura, história e diversão.
        </Text>


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
        <Ionicons name="person" size={34} color="#46306F" />
        <Ionicons name="search" size={34} color="#46306F" />
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