import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import { Hotel } from '../data/hotels';
import { openPhone, openWhatsApp } from '../utils/contact';

type Props = NativeStackScreenProps<RootStackParamList, 'Hotels'>;

function formatPrice(price: number): string {
  const formatted = price.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${formatted} / diária`;
}

export default function HotelsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { destination } = useDestination();
  const [search, setSearch] = useState('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    async function fetchHotels() {
      setFetchError(false);
      try {
        const ref = collection(db, 'hotels');

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

        const data: Hotel[] = snapshot.docs.map((doc) => {
          const hotel = doc.data() as Omit<Hotel, 'id'>;
          return {
            id: doc.id,
            ...hotel,
          };
        });

        data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setHotels(data);
      } catch (error: any) {
        console.error('FETCH ERROR:', error?.code, error?.message);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
  }, [destination]);

  const filteredHotels = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return hotels;
    return hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(value),
    );
  }, [search, hotels]);

  const cityLabel = destination
    ? `Hotéis em ${destination.cityName}, ${destination.state}.`
    : 'Hotéis';

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredHotels}
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
              <Text style={styles.emptyStateText}>Carregando hotéis...</Text>
            </View>
          ) : fetchError ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Não foi possível carregar os hotéis. Verifique sua conexão.
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
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.hotelImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.hotelImage, styles.imagePlaceholder]}>
                <Ionicons name="bed-outline" size={48} color={colors.textMuted} />
              </View>
            )}

            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <Text style={styles.hotelName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#F5C518" />
                  <Text style={styles.ratingText}>
                    {item.rating?.toFixed(1) ?? '-'}
                  </Text>
                </View>
              </View>

              <Text style={styles.hotelAddress} numberOfLines={2}>
                {item.address}
              </Text>

              <View style={styles.footerRow}>
                <Text style={styles.priceText}>
                  {formatPrice(item.price ?? 0)}
                </Text>

                <View style={styles.actionsRow}>
                  <Pressable
                    onPress={() => openPhone(item.phone)}
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.phoneButton,
                      pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
                    ]}
                  >
                    <Ionicons name="call-outline" size={22} color="#64D6B2" />
                  </Pressable>
                  <Pressable
                    onPress={() => openWhatsApp(item.whatsapp)}
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.whatsappButton,
                      pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
                    ]}
                  >
                    <FontAwesome name="whatsapp" size={22} color="#25D366" />
                  </Pressable>
                </View>
              </View>
            </View>
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
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  hotelImage: {
    width: '100%',
    height: 170,
    backgroundColor: colors.backgroundTertiary,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },
  hotelName: {
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
  hotelAddress: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceText: {
    flex: 1,
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneButton: {
    borderColor: '#64D6B2',
    backgroundColor: 'rgba(100, 214, 178, 0.06)',
  },
  whatsappButton: {
    borderColor: '#25D366',
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
