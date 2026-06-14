import { Alert, Linking } from 'react-native';

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export async function openWhatsApp(whatsapp: string, message?: string) {
  const number = onlyDigits(whatsapp ?? '');
  if (!number) {
    Alert.alert('WhatsApp não disponível');
    return;
  }
  const base = `https://wa.me/${number}`;
  const url = message ? `${base}?text=${encodeURIComponent(message)}` : base;
  try {
    await Linking.openURL(url);
  } catch (error: any) {
    console.error('WHATSAPP ERROR:', error?.code, error?.message);
    Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
  }
}

export async function openPhone(phone: string) {
  const number = onlyDigits(phone ?? '');
  if (!number) {
    Alert.alert('Telefone não disponível');
    return;
  }
  const url = `tel:${number}`;
  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    Alert.alert('Erro', 'Não foi possível abrir o discador.');
    return;
  }
  await Linking.openURL(url);
}
