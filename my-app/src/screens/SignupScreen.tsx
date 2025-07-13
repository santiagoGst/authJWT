import React from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerApi } from '../api/auth';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';

const RegisterSchema = Yup.object().shape({
  userName: Yup.string().min(3, 'Mínimo 3 caracteres').required('Campo requerido'),
  email: Yup.string().email('Email inválido').required('Campo requerido'),
  password: Yup.string().min(4, 'Mínimo 4 caracteres').required('Campo requerido'),
});

export default function RegisterScreen() {
  const navigation = useNavigation();

  const mutation = useMutation({
    mutationFn: ({userName, email, password }: {userName: string, email: string; password: string }) =>
      registerApi(userName, email, password),
    onSuccess: () => {
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
      navigation.navigate('Login' as never);
    },
    onError: () => {
      Alert.alert('Error', 'Ya existe un usuario con ese correo');
    },
  });

  return (
    <Formik
      initialValues={{userName: '',  email: '', password: '' }}
      validationSchema={RegisterSchema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            placeholder="nombre del usuario"
            style={styles.input}
            autoCapitalize="none"
            onChangeText={handleChange('userName')}
            onBlur={handleBlur('userName')}
            value={values.userName}
          />
          {touched.userName && errors.userName && <Text style={styles.error}>{errors.userName}</Text>}

          <Text style={styles.label}>Correo</Text>
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            autoCapitalize="none"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            secureTextEntry
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
          />
          {touched.password && errors.password && (<Text style={styles.error}>{errors.password}</Text>
          )}

          <Button title="Registrar" onPress={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  error: { color: 'red', marginBottom: 10 },
});
