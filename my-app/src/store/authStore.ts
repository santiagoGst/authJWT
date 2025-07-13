import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: string | null;
  login: (isSuccess: boolean, token: string, user: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const isKeychainAvailable = (): boolean => {
  if (Platform.OS === 'web') {
    return false;
  }
  
  try {
    if (!Keychain || typeof Keychain !== 'object') {
      return false;
    }
    if (typeof Keychain.setGenericPassword !== 'function' || typeof Keychain.getGenericPassword !== 'function') {
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Keychain no está disponible:', error);
    return false;
  }
};


const testKeychainAvailability = async (): Promise<boolean> => {
  if (!isKeychainAvailable()) {
    return false;
  }
  try {
    await Keychain.getSupportedBiometryType();
    return true;
  } catch (error) {
    console.warn('Keychain no funciona correctamente:', error);
    return false;
  }
};


const webStorage = {
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error guardando en localStorage:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Error leyendo de localStorage:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Error eliminando de localStorage:', error);
    }
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  user: null,

  login: async (isSuccess, token, user) => {
    console.log('Iniciando login...');
    
    try {
      if (isSuccess) {
        console.log('Login exitoso, guardando credenciales...');
        
        const keychainAvailable = await testKeychainAvailability();
        
        if (keychainAvailable) {
          console.log('Usando Keychain para guardar credenciales');
          const credentials = JSON.stringify({ token, user });
          await Keychain.setGenericPassword(user, credentials, { 
            service: 'auth_service' 
          });
        } else {
          console.log('Usando localStorage para guardar credenciales');
          const credentials = JSON.stringify({ token, user });
          webStorage.setItem('auth_credentials', credentials);
        }
        
        set({ isAuthenticated: true, token, user });
        console.log('Credenciales guardadas exitosamente');
      } else {
        set({ isAuthenticated: false, token: null, user: null });
      }
    } catch (error) {
      console.error('Error al guardar sesión:', error);
      set({ isAuthenticated: false, token: null, user: null });
    }
  },

  logout: async () => {
    try {
      console.log('Cerrando sesión...');
      
      const keychainAvailable = await testKeychainAvailability();
      
      if (keychainAvailable) {
        await Keychain.resetGenericPassword({ service: 'auth_service' });
      } else {
        webStorage.removeItem('auth_credentials');
      }
      
      set({ isAuthenticated: false, token: null, user: null });
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      set({ isAuthenticated: false, token: null, user: null });
    }
  },

  restoreSession: async () => {
    try {
      console.log('Restaurando sesión...');
      
      let credentialsData: string | null = null;
      const keychainAvailable = await testKeychainAvailability();
      if (keychainAvailable) {
        console.log('Obteniendo credenciales de Keychain');
        const credentials = await Keychain.getGenericPassword({ 
          service: 'auth_service' 
        });
        
        if (credentials && credentials.password) {
          credentialsData = credentials.password;
        }
      } else {
        console.log('Obteniendo credenciales de localStorage');
        credentialsData = webStorage.getItem('auth_credentials');
      }
      if (credentialsData) {
        try {
          const parsed = JSON.parse(credentialsData);
          
          if (parsed.token && parsed.user) {
            set({ 
              isAuthenticated: true, 
              token: parsed.token, 
              user: parsed.user 
            });
            console.log('Sesión restaurada exitosamente');
          } else {
            console.log('Credenciales inválidas, limpiando...');
            if (keychainAvailable) {
              await Keychain.resetGenericPassword({ service: 'auth_service' });
            } else {
              webStorage.removeItem('auth_credentials');
            }
            set({ isAuthenticated: false, token: null, user: null });
          }
        } catch (parseError) {
          console.error('Error al parsear credenciales:', parseError);
          if (keychainAvailable) {
            await Keychain.resetGenericPassword({ service: 'auth_service' });
          } else {
            webStorage.removeItem('auth_credentials');
          }
          set({ isAuthenticated: false, token: null, user: null });
        }
      } else {
        console.log('No se encontraron credenciales guardadas');
        set({ isAuthenticated: false, token: null, user: null });
      }
    } catch (error) {
      console.error('Error al restaurar sesión:', error);
      set({ isAuthenticated: false, token: null, user: null });
    }
  },
}));

