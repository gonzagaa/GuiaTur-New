import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../services/firebase';
import { Place } from '../data/places';

type Props = NativeStackScreenProps<RootStackParamList, 'PlacesList'>;

export default function PlacesListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const placesRef = collection(db, 'places');
        const q = query(placesRef, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);

        const data: Place[] = snapshot.docs.map((doc) => {
          const place = doc.data() as Omit<Place, 'id'>;
          return {
            id: doc.id,
            ...place,
          };
        });

        setPlaces(data);
      } catch (error) {
        console.error('Erro ao buscar lugares:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  const filteredPlaces = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return places;

    return places.filter((place) => {
      return (
        place.name.toLowerCase().includes(value) ||
        place.addressLine1.toLowerCase().includes(value) ||
        place.addressLine2.toLowerCase().includes(value)
      );
    });
  }, [search, places]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <Image
              source={require('../../assets/images/guide-hero.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />

            <Text style={styles.smallTitle}>EXIBINDO DICAS DO LOCAL:</Text>
            <Text style={styles.bigTitle}>Rio de Janeiro, RJ.</Text>

            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Pesquisar"
                placeholderTextColor={colors.textSecondary}
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
              <Ionicons
                name="search-outline"
                size={30}
                color={colors.black}
                style={styles.searchIcon}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.emptyStateText}>Carregando locais...</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhum local encontrado.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardText}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeAddress}>{item.addressLine1}</Text>
              <Text style={styles.placeAddress}>{item.addressLine2}</Text>
            </View>

            <Pressable
              onPress={() =>
                navigation.navigate('PlaceDetails', { placeId: item.id })
              }
              style={({ pressed }) => [
                styles.actionButton,
                pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
              ]}
            >
              <Ionicons name="chevron-forward" size={28} color={colors.text} />
            </Pressable>
          </View>
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={34} color={colors.black} />
      </Pressable>

      <Ionicons name="person" size={34} color="#46306F" />
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
    paddingBottom: 18,
    alignItems: 'center',
  },
  heroImage: {
    width: 170,
    height: 170,
    marginBottom: 8,
  },
  smallTitle: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  bigTitle: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 26,
  },
  searchContainer: {
    width: '100%',
    backgroundColor: '#3A3A3A',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 22,
    paddingRight: 14,
    height: 68,
    borderWidth: 1,
    borderColor: '#444444',
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 20,
  },
  searchIcon: {
    marginLeft: 10,
  },
  card: {
    minHeight: 122,
    borderTopWidth: 1,
    borderTopColor: '#5A5A5A',
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    flex: 1,
    paddingRight: 16,
  },
  placeName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  placeAddress: {
    color: colors.textSecondary,
    fontSize: 18,
    lineHeight: 24,
  },
  actionButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
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