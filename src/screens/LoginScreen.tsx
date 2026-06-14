import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    try {
      setSubmitting(true);
      await signIn(email, password);
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
          <Image
            source={require('../../assets/images/guide-hero.png')}
            style={styles.hero}
            resizeMode="contain"
          />

          <Text style={styles.title}>GuiaTur</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Login</Text>
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
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton}>
              <FontAwesome name="google" size={22} color={colors.text} />
            </Pressable>
            <Pressable style={styles.socialButton}>
              <FontAwesome name="apple" size={22} color={colors.text} />
            </Pressable>
            <Pressable style={styles.socialButton}>
              <FontAwesome name="facebook" size={22} color={colors.text} />
            </Pressable>
          </View>

          <Pressable
            onPress={handleSignIn}
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
              <Text style={styles.primaryButtonText}>Começar a navegar</Text>
            )}
          </Pressable>

          <Text style={styles.footerText}>
            Ainda não possui uma conta?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('SignUp')}
            >
              clique aqui
            </Text>{' '}
            para criar a sua!
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
  hero: {
    width: '100%',
    height: 200,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 16,
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
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    lineHeight: 20,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});
