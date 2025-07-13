import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { loginApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useMutation } from '@tanstack/react-query';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Correo electrónico inválido').required('El correo es requerido'),
  password: Yup.string().min(4, 'La contraseña debe tener al menos 4 caracteres').required('La contraseña es requerida'),
});


export default function LoginScreen({ navigation }: any) {
  const login = useAuthStore((state) => state.login);
  const [validCredentials, setValidCredentials] = useState(true);

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (data) => {
      setValidCredentials(data.isSuccess);
      login(data.isSuccess, data.token, data.nameUser);
    }
  });

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={(values) => mutation.mutate(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            style={styles.input}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <TextInput
            placeholder="Password"
            secureTextEntry
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            style={styles.input}
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {!validCredentials ? <span style={styles.error}>Usuario y/o contraseña incorrectos</span> : <></>}

          <Button title="Iniciar sesión" onPress={() => handleSubmit()} />
          <Button title="Registrarse" onPress={() => navigation.navigate('Register')} />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 },
  error: { color: 'red', marginBottom: 10 }
});
