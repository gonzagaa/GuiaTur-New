import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../services/firebase';
import { MostVisitedPlace } from '../data/mostVisited';
import { getMostVisitedImage } from '../data/mostVisitedImages';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MostVisitedDetails'>;

export default function MostVisitedDetailsScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { placeId } = route.params;

  const [place, setPlace] = useState<MostVisitedPlace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlace() {
      try {
        const ref = doc(db, 'mostVisitedPlaces', placeId);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          const data = snapshot.data() as Omit<MostVisitedPlace, 'id'>;
          setPlace({
            id: snapshot.id,
            ...data,
          });
        } else {
          setPlace(null);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhe do local:', error);
        setPlace(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPlace();
  }, [placeId]);

  async function handleOpenWaze() {
    if (!place?.wazeUrl) return;

    const supported = await Linking.canOpenURL(place.wazeUrl);

    if (supported) {
      await Linking.openURL(place.wazeUrl);
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o Waze.');
    }
  }

  function handleOpenAgencies() {
    navigation.navigate('TourAgencies');
  }

  if (loading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top + 20 }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando local...</Text>
      </View>
    );
  }

  if (!place) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.loadingText}>Local não encontrado.</Text>
        <Pressable style={styles.backFallback} onPress={() => navigation.goBack()}>
          <Text style={styles.backFallbackText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 120,
          paddingHorizontal: 24,
        }}
      >
        <Text style={styles.cityTitle}>Rio de Janeiro, RJ.</Text>

        <Text style={styles.placeTitle}>{place.title}</Text>

        <Image
          source={
            place.imageUrl
              ? { uri: place.imageUrl }
              : getMostVisitedImage(place.imageKey)
          }
          style={styles.mainImage}
          resizeMode="cover"
        />

        <Text style={styles.sectionTitle}>{place.detailTitle}</Text>

        <Text style={styles.paragraph}>{place.detailText1}</Text>

        <Text style={styles.paragraph}>
          {place.detailText2}
        </Text>

        <View style={styles.bulletList}>
          {place.bullets.map((item, index) => (
            <View key={`${place.id}-${index}`} style={styles.bulletRow}>
              <Text style={styles.bulletSymbol}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 },
            ]}
            onPress={handleOpenAgencies}
          >
            <Text style={styles.ctaButtonText}>Agências de Turismo</Text>
          </Pressable>

          <Text style={styles.orText}>ou</Text>

          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              styles.ctaButtonSmall,
              pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 },
            ]}
            onPress={handleOpenWaze}
          >
            <Text style={styles.ctaButtonText}>Abrir Waze</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={34} color={colors.black} />
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={34} color="#46306F" />
        </Pressable>
        <Ionicons name="search" size={34} color="#46306F" />

        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-undo" size={34} color="#46306F" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  backFallback: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backFallbackText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
  cityTitle: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroImage: {
    width: 240,
    height: 240,
    alignSelf: 'center',
    marginBottom: 12,
  },
  placeTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 18,
    textAlign: 'center',
  },
  mainImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6B6B6B',
    marginBottom: 26,
    backgroundColor: '#2A2A2A',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  paragraph: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 16,
  },
  bulletList: {
    marginBottom: 26,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingRight: 8,
  },
  bulletSymbol: {
    color: colors.textSecondary,
    fontSize: 20,
    lineHeight: 24,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 25,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  ctaButton: {
    flex: 1,
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonSmall: {
    flex: 0.75,
  },
  ctaButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  orText: {
    color: '#8C8C8C',
    fontSize: 18,
    fontWeight: '700',
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