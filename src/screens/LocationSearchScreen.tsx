import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, getDocs } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../services/firebase';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';
import { useDestination } from '../contexts/DestinationContext';
import { slugify } from '../utils/slug';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationSearch'>;

type CityOption = {
  cityId: string;
  cityName: string;
  state: string;
};

const FALLBACK_CITIES: CityOption[] = [
  {
    cityId: slugify('Rio de Janeiro', 'RJ'),
    cityName: 'Rio de Janeiro',
    state: 'RJ',
  },
];

export default function LocationSearchScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { setDestination } = useDestination();

  const [cities, setCities] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      try {
        const snapshot = await getDocs(collection(db, 'cities'));
        const data: CityOption[] = snapshot.docs
          .map((docSnap) => {
            const raw = docSnap.data() as Partial<CityOption>;
            if (!raw.cityName || !raw.state) return null;
            return {
              cityId: raw.cityId ?? slugify(raw.cityName, raw.state),
              cityName: raw.cityName,
              state: raw.state,
            };
          })
          .filter((item): item is CityOption => item !== null);

        setCities(data.length > 0 ? data : FALLBACK_CITIES);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        setCities(FALLBACK_CITIES);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  const states = useMemo(() => {
    const set = new Set(cities.map((c) => c.state));
    return Array.from(set).sort();
  }, [cities]);

  const citiesOfState = useMemo(() => {
    if (!selectedState) return [];
    return cities
      .filter((c) => c.state === selectedState)
      .sort((a, b) => a.cityName.localeCompare(b.cityName));
  }, [cities, selectedState]);

  function handleSelectState(state: string) {
    setSelectedState(state);
    if (selectedCity && selectedCity.state !== state) {
      setSelectedCity(null);
    }
    setStateModalOpen(false);
  }

  function handleSelectCity(city: CityOption) {
    setSelectedCity(city);
    setCityModalOpen(false);
  }

  async function handleExplore() {
    if (!selectedCity) {
      Alert.alert('Atenção', 'Selecione um estado e uma cidade para continuar.');
      return;
    }
    try {
      setSubmitting(true);
      await setDestination(selectedCity);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <Image
          source={require('../../assets/images/guide-hero.png')}
          style={styles.hero}
          resizeMode="contain"
        />

        <Text style={styles.title}>Escolhe o seu local de interesse</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Qual estado irá conhecer?</Text>
          <Pressable
            onPress={() => setStateModalOpen(true)}
            disabled={loading}
            style={({ pressed }) => [
              styles.selector,
              pressed && styles.selectorPressed,
            ]}
          >
            <Text
              style={[
                styles.selectorText,
                !selectedState && styles.selectorPlaceholder,
              ]}
            >
              {selectedState ?? 'Selecione o estado'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Selecione a cidade.</Text>
          <Pressable
            onPress={() => {
              if (!selectedState) {
                Alert.alert('Atenção', 'Selecione um estado primeiro.');
                return;
              }
              setCityModalOpen(true);
            }}
            disabled={loading}
            style={({ pressed }) => [
              styles.selector,
              pressed && styles.selectorPressed,
              !selectedState && styles.selectorDisabled,
            ]}
          >
            <Text
              style={[
                styles.selectorText,
                !selectedCity && styles.selectorPlaceholder,
              ]}
            >
              {selectedCity?.cityName ?? 'Selecione a cidade'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Carregando cidades...</Text>
          </View>
        )}

        <Pressable
          onPress={handleExplore}
          disabled={submitting || !selectedCity}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
            (submitting || !selectedCity) && styles.primaryButtonDisabled,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.primaryButtonText}>Explorar</Text>
          )}
        </Pressable>
      </View>

      <PickerModal
        visible={stateModalOpen}
        title="Selecione o estado"
        data={states}
        keyExtractor={(item) => item}
        onClose={() => setStateModalOpen(false)}
        renderLabel={(item) => item}
        onSelect={(item) => handleSelectState(item)}
      />

      <PickerModal
        visible={cityModalOpen}
        title="Selecione a cidade"
        data={citiesOfState}
        keyExtractor={(item) => item.cityId}
        onClose={() => setCityModalOpen(false)}
        renderLabel={(item) => item.cityName}
        onSelect={(item) => handleSelectCity(item)}
      />
    </View>
  );
}

type PickerModalProps<T> = {
  visible: boolean;
  title: string;
  data: T[];
  keyExtractor: (item: T) => string;
  renderLabel: (item: T) => string;
  onSelect: (item: T) => void;
  onClose: () => void;
};

function PickerModal<T>({
  visible,
  title,
  data,
  keyExtractor,
  renderLabel,
  onSelect,
  onClose,
}: PickerModalProps<T>) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          {data.length === 0 ? (
            <Text style={styles.modalEmpty}>Nenhuma opção disponível.</Text>
          ) : (
            <FlatList
              data={data}
              keyExtractor={keyExtractor}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.modalItem,
                    pressed && styles.modalItemPressed,
                  ]}
                  onPress={() => onSelect(item)}
                >
                  <Text style={styles.modalItemText}>{renderLabel(item)}</Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
  hero: {
    width: '100%',
    height: 180,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  selectorPressed: {
    opacity: 0.85,
  },
  selectorDisabled: {
    opacity: 0.5,
  },
  selectorText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  selectorPlaceholder: {
    color: colors.textMuted,
    fontWeight: '400',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  primaryButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  modalItem: {
    paddingVertical: 14,
  },
  modalItemPressed: {
    opacity: 0.6,
  },
  modalItemText: {
    color: colors.text,
    fontSize: 16,
  },
  modalSeparator: {
    height: 1,
    backgroundColor: colors.border,
  },
  modalEmpty: {
    color: colors.textSecondary,
    paddingVertical: 24,
    textAlign: 'center',
  },
});
