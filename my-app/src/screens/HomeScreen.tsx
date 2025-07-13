import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Bienvenido, {user}</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
