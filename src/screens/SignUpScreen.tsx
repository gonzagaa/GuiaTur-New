import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cidade, setCidade] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSignUp() {
    if (!nome.trim() || !email.trim() || !password || !cidade.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    try {
      setSubmitting(true);
      await signUp(nome, email, password, cidade);
    } catch (error: any) {
      const code = error?.code as string | undefined;
      let message: string;
      switch (code) {
        case 'auth/email-already-in-use':
          message = 'Este e-mail já está cadastrado.';
          break;
        case 'auth/invalid-email':
          message = 'E-mail inválido.';
          break;
        case 'auth/weak-password':
          message = 'A senha precisa ter no mínimo 6 caracteres.';
          break;
        case 'auth/operation-not-allowed':
          message = 'Login por e-mail/senha não está habilitado no Firebase.';
          break;
        case 'auth/network-request-failed':
          message = 'Sem conexão com a internet.';
          break;
        default:
          message = code ?? 'Erro desconhecido.';
      }
      Alert.alert('Erro', message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
          ]}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={12}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={26} color={colors.text} />
            </Pressable>
            <Text style={styles.title}>Criar conta</Text>
            <View style={styles.backButton} />
          </View>

          <Text style={styles.subtitle}>
            Cadastre-se para descobrir os melhores destinos.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Cidade de residência</Text>
            <TextInput
              value={cidade}
              onChangeText={setCidade}
              placeholder="Sua cidade"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              style={styles.input}
            />
          </View>

          <Pressable
            onPress={handleSignUp}
            disabled={submitting}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              submitting && styles.primaryButtonDisabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.primaryButtonText}>Criar conta</Text>
            )}
          </Pressable>

          <Text style={styles.footerText}>
            Já tem uma conta?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Login')}
            >
              entrar
            </Text>
          </Text>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 18,
  },
  primaryButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});
