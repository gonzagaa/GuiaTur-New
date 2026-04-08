import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../services/firebase';
import { TourAgency } from '../data/tourAgencies';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'TourAgencies'>;

export default function TourAgenciesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [agencies, setAgencies] = useState<TourAgency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgencies() {
      try {
        const ref = collection(db, 'tourAgencies');
        const q = query(ref, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);

        const data: TourAgency[] = snapshot.docs.map((doc) => {
          const agency = doc.data() as Omit<TourAgency, 'id'>;
          return {
            id: doc.id,
            ...agency,
          };
        });

        setAgencies(data);
      } catch (error) {
        console.error('Erro ao buscar agências:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgencies();
  }, []);

  const filteredAgencies = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return agencies;

    return agencies.filter((agency) => {
      return (
        agency.name.toLowerCase().includes(value) ||
        agency.addressLine1.toLowerCase().includes(value) ||
        agency.addressLine2.toLowerCase().includes(value) ||
        agency.phone.toLowerCase().includes(value)
      );
    });
  }, [search, agencies]);

  async function handleCall(phone: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `tel:${cleanPhone}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o discador.');
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAgencies}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <Image
              source={require('../../assets/images/guide-hero.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />

            <Text style={styles.smallTitle}>AGÊNCIAS DE TURISMO EM:</Text>
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
              <Text style={styles.emptyStateText}>Carregando agências...</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhuma agência encontrada.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardText}>
              <View style={styles.titleRow}>
                <Text style={styles.agencyName}>{item.name}</Text>
                <Text style={styles.distanceText}>{item.distanceLabel}</Text>
              </View>

              <Text style={styles.agencyAddress}>{item.addressLine1}</Text>
              <Text style={styles.agencyAddress}>{item.addressLine2}</Text>
              <Text style={styles.agencyPhone}>{item.phone}</Text>
            </View>

            <Pressable
              onPress={() => handleCall(item.phone)}
              style={({ pressed }) => [
                styles.callButton,
                pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
              ]}
            >
              <Ionicons name="call-outline" size={32} color="#64D6B2" />
            </Pressable>
          </View>
        )}
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
    minHeight: 138,
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
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  agencyName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  distanceText: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '400',
  },
  agencyAddress: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  agencyPhone: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 6,
  },
  callButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#64D6B2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 214, 178, 0.04)',
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