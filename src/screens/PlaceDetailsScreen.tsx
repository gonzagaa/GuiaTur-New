import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc } from 'firebase/firestore';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../services/firebase';
import { Place } from '../data/places';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceDetails'>;

export default function PlaceDetailsScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { placeId } = route.params;

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlace() {
      try {
        const placeRef = doc(db, 'places', placeId);
        const snapshot = await getDoc(placeRef);

        if (snapshot.exists()) {
          const data = snapshot.data() as Omit<Place, 'id'>;
          setPlace({
            id: snapshot.id,
            ...data,
          });
        } else {
          setPlace(null);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do local:', error);
        setPlace(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPlace();
  }, [placeId]);

  if (loading) {
    return (
      <View style={[styles.notFoundContainer, { paddingTop: insets.top + 20 }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.notFoundText}>Carregando local...</Text>
      </View>
    );
  }

  if (!place) {
    return (
      <View style={[styles.notFoundContainer, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.notFoundText}>Local não encontrado.</Text>
        <Pressable style={styles.backFallback} onPress={() => navigation.goBack()}>
          <Text style={styles.backFallbackText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Detalhes do local</Text>

        <View style={{ width: 46 }} />
      </View>

      <View style={styles.heroCard}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {place.city}, {place.state}
          </Text>
        </View>

        <Text style={styles.placeTitle}>{place.name}</Text>
        <Text style={styles.addressText}>{place.addressLine1}</Text>
        <Text style={styles.addressText}>{place.addressLine2}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o local</Text>
        <Text style={styles.description}>{place.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dicas</Text>

        {place.tips.map((tip, index) => (
          <View key={`${place.id}-${index}`} style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb-outline" size={18} color={colors.text} />
            </View>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2B2B2B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#242424',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 18,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(130, 87, 229, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(130, 87, 229, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  placeTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  addressText: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    backgroundColor: '#232323',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#303030',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 26,
  },
  tipCard: {
    backgroundColor: '#2B2B2B',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  tipIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  notFoundText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 16,
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
});