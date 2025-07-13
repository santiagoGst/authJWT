import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5082/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});


export const loginApi = async (email: string, password: string) => {
  try {
    const res = await api.post('/login', {
      usr_email: email,
      usr_password: password
    });
    console.log("Respuesta del servidor:", res.data); 
    return res.data;
  } catch (error) {
    console.error('Error al inciar sesión:', error);
    throw error;
  }
};


export const registerApi = async (userName: string, email: string, password: string) => {
  try {
    const res = await api.post('/signup', {
      usr_user_name: userName,
      usr_email: email,
      usr_password: password
    });
    console.log("Respuesta del servidor:", res.data); 
    return res.data;
  } catch (error) {
    console.error('Error al registrar:', error);
    throw error;
  }
};