import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FirebaseContext } from '../../firebase';
import { useNavigate } from 'react-router';
//import { useNavigate } from 'react-router';
// Context con las operaciones de firebase

// validación y leer los datos del formulario 


const Nuevoproductos = () => {
    const { firebaseInstance } = useContext(FirebaseContext);
    // State para las imágenes
const [subiendo, guardarSubiendo] = useState(false);
const [progreso, guardarProgreso] = useState(0);
const [urlimagen, guardarUrlImagen] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({ 
        initialValues: {
            nombre: ' ',
            precio: '', 
            categoria: '',
            imagen: '',
            descripcion: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .min(3, 'Los productoss deben tener al menos 3 caracteres')
                .required('El Nombre del productos es obligatorio'), 
            precio: Yup.number()
                .min(1, 'Debes agregar un número')
                .required('El Precio es obligatorio'),
            categoria: Yup.string()
                .required('La categoría es obligatoria'),
            descripcion: Yup.string()
                .min(10, 'La descripción debe ser más larga') 
                .required('La descripción es obligatoria'),
    }),
    onSubmit: productos => {
      try {
      //Agregamos un campo llamado existencia que inicia en true
      productos.existencia = true;
      //Agregamos el campo para agregar la imagen del producto
      productos.imagen = urlimagen;
      firebaseInstance.db.collection('productos').add(productos);
      // Redireccionar al guardar hacia el menú
      navigate('/menu'); 
      } catch (error) {
        console.log(error); 
        }
      }
    })
    //Todo lo que tiene que ver con la imagen
    const handleUploadFile = async (event) => { const file = event.target.files[0];
      const storageRef = firebaseInstance.storage.ref('productos');
      const fileRef = storageRef.child(file.name);
      try {
      guardarSubiendo(true);
      const uploadTask = fileRef.put(file);
      uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; guardarProgreso(progress); });
      await uploadTask;
      guardarSubiendo(false);
      const downloadURL = await fileRef.getDownloadURL(); 
      guardarUrlImagen(downloadURL); } catch (error) { console.log(error); guardarSubiendo(false); }
      };
  return (
    <>
      <h1 className="text-3xl font-light mb-4">Producto</h1>
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-3xl">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre">
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                placeholder="Nombre productos"
                value={formik.values.nombre} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
              />
            </div>
            { formik.touched.nombre && formik.errors.nombre ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb- 5" role="alert">
            <p className="font-bold">Hubo un error:</p> <p>{formik.errors.nombre} </p>
            </div>
            ) : null }
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="precio"
              >
                Precio
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="precio"
                type="number"
                placeholder="₡0"
                min="0"
                value={formik.values.precio} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
              />
            </div>
            { formik.touched.precio && formik.errors.precio ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb- 5" role="alert">
            <p className="font-bold">Hubo un error:</p> <p>{formik.errors.precio} </p>
            </div>
            ) : null }
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="categoria"
              >
                Categoría
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="categoria"
                name="categoria"
                value={formik.values.categoria} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
              >
                <option value="">-- Seleccione --</option>
                <option value="cuidadoPersonal">Cuidado Personal</option>{" "}
                <option value="infantil">Infantil</option>{" "}
                <option value="ortopedia">Ortopedia</option>{" "}
                <option value="natural">Natural</option>{" "}
                <option value="cosmeticoDietetica">Cosmético y dietético</option>{" "}
              </select>
            </div>
            { formik.touched.categoria && formik.errors.categoria ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb- 5" role="alert">
            <p className="font-bold">Hubo un error:</p> <p>{formik.errors.categoria} </p>
            </div>
            ) : null }
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="imagen">
                Imagen
              </label>
              <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline- none focus:shadow-outline" 
              id="imagen" 
              name="imagen" 
              type="file"
                onChange={handleUploadFile} 
                onBlur={formik.handleBlur}
                />
            </div>
            {subiendo && (
            <div className="h-12 relative w-full border"> 
            <div className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
            style={{ width: `${progreso}%` }}>
               {progreso}% 
            </div>
            </div>
            )}
            {urlimagen && (
              <p className="bg-green-500 text-white p-3 text-center my-5">
                La imagen se subió correctamente
              </p>
               )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="descripcion">
                Descripción
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                id="descripcion"
                placeholder="Descripción del productos"
                value={formik.values.descripcion} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}>
                </textarea>
            </div>
            { formik.touched.descripcion && formik.errors.descripcion ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb- 5" role="alert">
            <p className="font-bold">Hubo un error:</p> <p>{formik.errors.descripcion} </p>
            </div>
            ) : null }
            <input
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
              value="Guardar productos"
              />
          </form>
        </div>
      </div>
    </>
  );
};
export default Nuevoproductos;
