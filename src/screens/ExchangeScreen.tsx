import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../services/firebase';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';
import { useDestination } from '../contexts/DestinationContext';
import { ExchangePlace } from '../data/exchanges';
import { openWhatsApp } from '../utils/contact';

type Props = NativeStackScreenProps<RootStackParamList, 'Exchange'>;

export default function ExchangeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { destination } = useDestination();
  const [search, setSearch] = useState('');
  const [places, setPlaces] = useState<ExchangePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    async function fetchExchanges() {
      setFetchError(false);
      try {
        const ref = collection(db, 'exchanges');

        let snapshot;
        if (destination) {
          snapshot = await getDocs(
            query(ref, where('cityId', '==', destination.cityId)),
          );
          // TODO: remover fallback quando todos os docs tiverem cityId
          if (snapshot.empty) {
            snapshot = await getDocs(ref);
          }
        } else {
          snapshot = await getDocs(ref);
        }

        const data: ExchangePlace[] = snapshot.docs.map((doc) => {
          const place = doc.data() as Omit<ExchangePlace, 'id'>;
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

    fetchExchanges();
  }, [destination]);

  const filteredPlaces = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return places;
    return places.filter((place) => place.name.toLowerCase().includes(value));
  }, [search, places]);

  const cityLabel = destination
    ? `Intercâmbio em ${destination.cityName}, ${destination.state}.`
    : 'Intercâmbio';

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <Text style={styles.bigTitle}>{cityLabel}</Text>

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
                size={26}
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
              <Text style={styles.emptyStateText}>
                Carregando casas de câmbio...
              </Text>
            </View>
          ) : fetchError ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Não foi possível carregar as casas de câmbio. Verifique sua conexão.
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
            <View style={styles.cardText}>
              <View style={styles.titleRow}>
                <Text style={styles.placeName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#F5C518" />
                  <Text style={styles.ratingText}>
                    {item.rating?.toFixed(1) ?? '-'}
                  </Text>
                </View>
              </View>

              <Text style={styles.placeAddress}>{item.address}</Text>

              {item.currencies?.length > 0 && (
                <View style={styles.chipsRow}>
                  {item.currencies.map((currency) => (
                    <View key={currency} style={styles.chip}>
                      <Text style={styles.chipText}>{currency}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.hoursRow}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.hoursText}>{item.openingHours}</Text>
              </View>
            </View>

            <Pressable
              onPress={() => openWhatsApp(item.whatsapp)}
              style={({ pressed }) => [
                styles.whatsappButton,
                pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
              ]}
            >
              <FontAwesome name="whatsapp" size={32} color="#25D366" />
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

        <Pressable onPress={() => navigation.navigate('LocationSearch')}>
          <Ionicons name="search" size={34} color="#46306F" />
        </Pressable>

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
  bigTitle: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    width: '100%',
    backgroundColor: '#3A3A3A',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 22,
    paddingRight: 14,
    height: 56,
    borderWidth: 1,
    borderColor: '#444444',
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
  card: {
    borderTopWidth: 1,
    borderTopColor: '#5A5A5A',
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  cardText: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  placeName: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  placeAddress: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hoursText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  whatsappButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 211, 102, 0.08)',
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
    paddingHorizontal: 28,
  },
  emptyStateText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});
