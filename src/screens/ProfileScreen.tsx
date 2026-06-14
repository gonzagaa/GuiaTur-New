import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type LanguageOption = {
  id: 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR';
  label: string;
  flag: string;
};

const LANGUAGES: LanguageOption[] = [
  { id: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { id: 'en-US', label: 'Inglês', flag: '🇺🇸' },
  { id: 'es-ES', label: 'Espanhol', flag: '🇪🇸' },
  { id: 'fr-FR', label: 'Francês', flag: '🇫🇷' },
];

export default function ProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [language, setLanguage] = useState<LanguageOption['id']>('pt-BR');

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'usuarios', user.uid));
        const data = snap.data() as
          | { nome?: string; email?: string; idioma?: LanguageOption['id'] }
          | undefined;

        const resolvedName = data?.nome?.trim() || user.email || '';
        setDisplayName(resolvedName);
        setNameInput(data?.nome ?? '');
        setEmailInput(data?.email ?? user.email ?? '');
        if (data?.idioma) {
          setLanguage(data.idioma);
        }
      } catch (error: any) {
        console.error('FETCH ERROR:', error?.code, error?.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  async function handleSaveName() {
    if (!user) return;
    const trimmed = nameInput.trim();
    if (!trimmed) {
      Alert.alert('Atenção', 'Digite um nome válido.');
      return;
    }
    try {
      setSavingName(true);
      await updateDoc(doc(db, 'usuarios', user.uid), { nome: trimmed });
      setDisplayName(trimmed);
      Alert.alert('Sucesso', 'Nome atualizado.');
    } catch (error: any) {
      console.error('UPDATE ERROR:', error?.code, error?.message);
      Alert.alert('Erro', 'Não foi possível atualizar o nome.');
    } finally {
      setSavingName(false);
    }
  }

  // TODO: implementar updateEmail/updatePassword do Firebase Auth (exigem
  // reautenticação do usuário e fluxo de verificação). Fora do escopo atual.
  function handleSaveEmail() {
    Alert.alert('Aviso', 'Funcionalidade em desenvolvimento.');
  }

  function handleSavePassword() {
    Alert.alert('Aviso', 'Funcionalidade em desenvolvimento.');
  }

  async function handleSelectLanguage(option: LanguageOption) {
    setLanguage(option.id);
    if (!user) return;
    try {
      await updateDoc(doc(db, 'usuarios', user.uid), { idioma: option.id });
    } catch (error: any) {
      console.error('UPDATE ERROR:', error?.code, error?.message);
    }
  }

  function handleOpenTerms() {
    Alert.alert('Termos de uso', 'Em breve disponibilizaremos esta página.');
  }

  async function handleSignOut() {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            console.error('SIGNOUT ERROR:', error?.code, error?.message);
            Alert.alert('Erro', 'Não foi possível sair.');
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: 120 },
        ]}
      >
        <View style={styles.avatarWrapper}>
          <Ionicons name="person-circle-outline" size={120} color={colors.primary} />
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
          ) : (
            <Text style={styles.userName} numberOfLines={1}>
              {displayName || 'Usuário'}
            </Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Alterar e-mail</Text>
          <View style={styles.row}>
            <TextInput
              value={emailInput}
              onChangeText={setEmailInput}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="seu@email.com"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <Pressable
              onPress={handleSaveEmail}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Alterar nome</Text>
          <View style={styles.row}>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Seu nome"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <Pressable
              onPress={handleSaveName}
              disabled={savingName}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
                savingName && styles.saveButtonDisabled,
              ]}
            >
              {savingName ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={styles.saveButtonText}>Salvar</Text>
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Alterar senha</Text>
          <View style={styles.row}>
            <TextInput
              value={passwordInput}
              onChangeText={setPasswordInput}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <Pressable
              onPress={handleSavePassword}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Selecione seu idioma</Text>
        <View style={styles.flagsRow}>
          {LANGUAGES.map((option) => {
            const selected = option.id === language;
            return (
              <Pressable
                key={option.id}
                onPress={() => handleSelectLanguage(option)}
                style={({ pressed }) => [
                  styles.flagWrapper,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View
                  style={[
                    styles.flagCircle,
                    selected && styles.flagCircleSelected,
                  ]}
                >
                  <Text style={styles.flagEmoji}>{option.flag}</Text>
                  {selected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={14} color={colors.text} />
                    </View>
                  )}
                </View>
                <Text style={styles.flagLabel}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={handleOpenTerms} hitSlop={8}>
          <Text style={styles.termsLink}>Confira nossos termos de uso</Text>
        </Pressable>

        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.signOutButtonPressed,
          ]}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.text} />
          <Text style={styles.signOutText}>Sair</Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={34} color="#46306F" />
        </Pressable>

        <Ionicons name="person" size={34} color={colors.black} />

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
  scrollContent: {
    paddingHorizontal: 24,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
    maxWidth: '90%',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  flagsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  flagWrapper: {
    alignItems: 'center',
    width: '22%',
  },
  flagCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagCircleSelected: {
    borderColor: colors.primary,
  },
  flagEmoji: {
    fontSize: 32,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  flagLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  termsLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 28,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
  },
  signOutButtonPressed: {
    opacity: 0.85,
  },
  signOutText: {
    color: colors.text,
    fontSize: 16,
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
