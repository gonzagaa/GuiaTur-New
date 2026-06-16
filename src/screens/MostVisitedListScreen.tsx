import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../services/firebase';
import { MostVisitedPlace } from '../data/mostVisited';
import { getMostVisitedImage } from '../data/mostVisitedImages';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';
import { useDestination } from '../contexts/DestinationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'MostVisitedList'>;

export default function MostVisitedListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { destination } = useDestination();
  const [places, setPlaces] = useState<MostVisitedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    async function fetchMostVisited() {
      setFetchError(false);
      try {
        const ref = collection(db, 'mostVisitedPlaces');

        const snapshot = destination
          ? await getDocs(query(ref, where('cityId', '==', destination.cityId)))
          : await getDocs(ref);

        const data: MostVisitedPlace[] = snapshot.docs.map((doc) => {
          const place = doc.data() as Omit<MostVisitedPlace, 'id'>;
          return {
            id: doc.id,
            ...place,
          };
        });

        data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setPlaces(data);
      } catch (error: any) {
        console.error('FETCH ERROR:', error?.code, error?.message);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMostVisited();
  }, [destination]);

  const cityLabel = destination
    ? `${destination.cityName}, ${destination.state}.`
    : 'Selecione um destino';

  return (
    <View style={styles.container}>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <Text style={styles.cityTitle}>{cityLabel}</Text>

          
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.emptyStateText}>Carregando locais...</Text>
            </View>
          ) : fetchError ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Não foi possível carregar os locais. Verifique sua conexão.
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Nenhum resultado para esta cidade ainda.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.textContent}>
                <Text style={styles.placeTitle}>{item.title}</Text>
                <Text style={styles.placeDescription}>{item.shortDescription}</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.visitButton,
                  pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 },
                ]}
                onPress={() =>
                  navigation.navigate('MostVisitedDetails', { placeId: item.id })
                }
              >
                <Text style={styles.visitButtonText}>Visitar</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() =>
                navigation.navigate('MostVisitedDetails', { placeId: item.id })
              }
            >
              <Image
                source={
                  item.imageUrl
                    ? { uri: item.imageUrl }
                    : getMostVisitedImage(item.imageKey)
                }
                style={styles.placeImage}
                resizeMode="cover"
              />
            </Pressable>
          </View>
        )}
      />

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
  header: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  cityTitle: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 18,
  },
  heroImage: {
    width: 260,
    height: 260,
    marginBottom: 8,
  },
  card: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  textContent: {
    flex: 1,
  },
  placeTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  placeDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  visitButton: {
    backgroundColor: colors.primary,
    minWidth: 80,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
    paddingHorizontal: 18,
  },
  visitButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  placeImage: {
    width: '100%',
    height: 190,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#111111',
    backgroundColor: '#2A2A2A',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 12,
  },
});
