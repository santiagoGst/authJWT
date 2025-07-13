Sección 5: Teoría y preguntas abiertas



¿Cómo aplicarías el patrón Adapter al integrar EncryptedStorage?

Usando el adapter como un intermediario para traducir las llamadas de la interfaz a los métodos específicos de EncryptedStorage. Así la aplicación puede seguir usando una interfaz consistente sin necesidad de preocuparse por los detalles del almacenamiento cifrado haciendo que el código sea más flexible y fácil de mantener.



¿Qué ventaja ofrece react-query sobre Redux para datos asincrónicos?

react-query está específicamente diseñado para manejar datos asincrónicos como son las peticiones a una API lo que lo hace más eficiente que Redux para ese propósito. Tiene caché automática y estados de carga, con Redux se tendría que escribir más código para lograr estas funcionalidades



¿Qué patrón aplicarías para aislar reglas de negocio del UI?

Un patrón basado en el tipo de aplicación que se está construyendo. Clean architecture o MVVM pueden ser las opciones más optimas si se trata de una aplicación compleja con una lógica de negocio muy grande y está sujeto a constantes cambios ya que ofrecen un fuerte desacoplamiento. Para algo más sencillo, MVC o una simple capa de servicios puede ser suficiente.













Sección 6: Refactor de código inseguro



Corrige el siguiente fragmento:



const login = async (email, password) => {

&nbsp;	const response = await axios.post('http://api.banco.com/login', { email, password });

&nbsp;	await AsyncStorage.setItem('token', response.data. token);

&nbsp;	navigation.navigate('Home');

};



Corrígelo para:

HTTPS obligatorio

Almacenamiento seguro

Mecanismo defensivo contra errores

Protección en segundo plano



const login = async (email, password) => {

&nbsp; try {

&nbsp;   const response = await axios.post('https://api.banco.com/login', { email, password });

&nbsp;   await Keychain.setGenericPassword('token', response.data.token); // Almacenamiento seguro

&nbsp;   navigation.navigate('Home');

&nbsp; } catch (error) {

&nbsp;   console.error("Error de inicio de sesión: ", error); // Mecanismo defensivo contra errores

&nbsp;   Alert.alert("Error", "Hubo un problema al iniciar sesión. Intenta nuevamente.");

&nbsp; }

};

