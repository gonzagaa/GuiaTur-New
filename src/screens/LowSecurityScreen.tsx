import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types/navigation';
import { useDestination } from '../contexts/DestinationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'LowSecurity'>;

type RiskZone = {
  id: string;
  cityId?: string;
  description: string;
  riskLevel?: string;
  lat: number;
  lng: number;
};

const FALLBACK_CENTER = { lat: -22.9068, lng: -43.1729 };
const CIRCLE_RADIUS_METERS = 300;

type LatLng = { lat: number; lng: number };

function buildMapHtml(
  center: LatLng,
  userPosition: LatLng | null,
  zones: RiskZone[],
): string {
  const zonesJson = JSON.stringify(
    zones.map((z) => ({
      lat: z.lat,
      lng: z.lng,
      description: z.description ?? '',
    })),
  );
  const userJson = userPosition ? JSON.stringify(userPosition) : 'null';
  const centerJson = JSON.stringify(center);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #1E1E1E; }
    .user-pin {
      width: 18px; height: 18px; border-radius: 50%;
      background: #8257E5; border: 3px solid #fff;
      box-shadow: 0 0 0 2px rgba(130,87,229,0.4);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var center = ${centerJson};
    var user = ${userJson};
    var zones = ${zonesJson};

    var map = L.map('map', { zoomControl: true }).setView([center.lat, center.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    if (user) {
      var userIcon = L.divIcon({
        className: '',
        html: '<div class="user-pin"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      L.marker([user.lat, user.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('Você está aqui');
    }

    zones.forEach(function (z) {
      L.circle([z.lat, z.lng], {
        radius: ${CIRCLE_RADIUS_METERS},
        color: '#E53935',
        weight: 1,
        fillColor: '#E53935',
        fillOpacity: 0.35
      }).addTo(map).bindPopup(z.description || 'Área de baixa segurança');
    });
  </script>
</body>
</html>`;
}

export default function LowSecurityScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { destination } = useDestination();

  const [zones, setZones] = useState<RiskZone[]>([]);
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setFetchError(false);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;

        if (status !== 'granted') {
          setPermissionDenied(true);
        } else {
          try {
            const pos = await Location.getCurrentPositionAsync({});
            if (!cancelled) {
              setUserPosition({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
            }
          } catch (error: any) {
            console.error('LOCATION ERROR:', error?.code, error?.message);
          }
        }

        const ref = collection(db, 'riskZones');
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

        const data: RiskZone[] = snapshot.docs
          .map((doc) => {
            const raw = doc.data() as Omit<RiskZone, 'id'>;
            return { id: doc.id, ...raw };
          })
          .filter(
            (z) => typeof z.lat === 'number' && typeof z.lng === 'number',
          );

        if (!cancelled) setZones(data);
      } catch (error: any) {
        console.error('FETCH ERROR:', error?.code, error?.message);
        if (!cancelled) setFetchError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [destination]);

  const center: LatLng = useMemo(() => {
    if (userPosition) return userPosition;
    if (zones.length > 0) {
      const lat = zones.reduce((sum, z) => sum + z.lat, 0) / zones.length;
      const lng = zones.reduce((sum, z) => sum + z.lng, 0) / zones.length;
      return { lat, lng };
    }
    return FALLBACK_CENTER;
  }, [userPosition, zones]);

  const html = useMemo(
    () => buildMapHtml(center, userPosition, zones),
    [center, userPosition, zones],
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>
          {destination
            ? `Baixa Segurança · ${destination.cityName}, ${destination.state}`
            : 'Baixa Segurança'}
        </Text>
      </View>

      <View style={styles.mapWrapper}>
        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando mapa...</Text>
          </View>
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            setSupportMultipleWindows={false}
          />
        )}
      </View>

      {permissionDenied && (
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoBannerText}>
            Permissão de localização negada. Mostrando o mapa sem sua posição.
          </Text>
        </View>
      )}

      {fetchError && (
        <View style={styles.infoBanner}>
          <Ionicons name="cloud-offline" size={20} color={colors.primary} />
          <Text style={styles.infoBannerText}>
            Não foi possível carregar as zonas de risco.
          </Text>
        </View>
      )}

      <View style={styles.warningBar}>
        <Ionicons name="warning" size={26} color="#F5C518" />
        <Text style={styles.warningText}>
          Você está próximo de uma área de Baixa Segurança
        </Text>
      </View>

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
    paddingBottom: 12,
    alignItems: 'center',
  },
  title: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  mapWrapper: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.backgroundSecondary,
  },
  webview: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoBannerText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
  },
  warningBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#2A1F1F',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#3E2A2A',
  },
  warningText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  bottomBar: {
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
