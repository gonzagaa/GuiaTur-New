import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Destination = {
  cityId: string;
  cityName: string;
  state: string;
};

type DestinationContextValue = {
  destination: Destination | null;
  loading: boolean;
  setDestination: (destination: Destination | null) => Promise<void>;
};

const STORAGE_KEY = '@guiatur:destination';

const DestinationContext = createContext<DestinationContextValue | undefined>(
  undefined,
);

type DestinationProviderProps = {
  children: ReactNode;
};

export function DestinationProvider({ children }: DestinationProviderProps) {
  const [destination, setDestinationState] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Destination;
          if (parsed?.cityId && parsed?.cityName && parsed?.state) {
            setDestinationState(parsed);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar destino:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const setDestination = useCallback(async (next: Destination | null) => {
    setDestinationState(next);
    try {
      if (next) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Erro ao salvar destino:', error);
    }
  }, []);

  return (
    <DestinationContext.Provider value={{ destination, loading, setDestination }}>
      {children}
    </DestinationContext.Provider>
  );
}

export function useDestination(): DestinationContextValue {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error(
      'useDestination deve ser usado dentro de um DestinationProvider',
    );
  }
  return context;
}
