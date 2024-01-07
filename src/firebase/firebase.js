import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
//Importamos nuestra credencial de Firebase
import firebaseConfig from './config';
class Firebase {
    //Creamos nuestro constructor para reconocer Firebase en nuestra App
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        /* Firestore es la base de datos
        Storage es donde se guardan los archivos e imágenes */
        this.db = firebase.firestore();
        this.storage = firebase.storage();
    }
}
//serán las instancias que utilizaremos a nivel del proyecto
//para reconocer la conexión a Firebase
const firebaseInstance = new Firebase();
export default firebaseInstance