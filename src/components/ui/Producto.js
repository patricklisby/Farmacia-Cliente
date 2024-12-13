import React, { useContext, useRef } from "react";
import { FirebaseContext } from "../../firebase";
import Swal from "sweetalert2";

const Producto = ({ producto }) => {
  // Existencia ref para acceder al valor directamente
  const existenciaRef = useRef(producto.existencia);
  // context de firebase para cambios en la BD
  const { firebaseInstance } = useContext(FirebaseContext);
  const { id, nombre, imagen, existencia, categoria, precio, descripcion } = producto;
  let estado = producto.cantidad > 0 ? producto.cantidad : "Sin Inventario";

  const enviarDatosOtraTabla = (producto) => {
    const { nombre, cantidad: cantidadDeseada } = producto;
    const ordenesRef = firebaseInstance.db.collection("Ordenes");

    // Verificar si ya existe una orden con el mismo nombre de producto
    ordenesRef
      .where("nombre", "==", nombre)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          // La orden no existe, agregar una nueva
          ordenesRef
            .add({
              nombre: producto.nombre,
              cantidad: cantidadDeseada,
              imagen: producto.imagen,
              categoria: producto.categoria,
              precio: producto.precio,
              descripcion: producto.descripcion,
            })
            .then(() => {
              console.log("Datos enviados a la tabla Ordenes correctamente");
            })
            .catch((error) => {
              console.error("Error al enviar los datos a la tabla Ordenes:", error);
            });
        } else {
          // La orden existe, obtener el primer documento encontrado
          const ordenDoc = querySnapshot.docs[0];
          const ordenData = ordenDoc.data();
          // Obtener la cantidad actual y actualizarla sumando la cantidad deseada
          const cantidadActual = ordenData.cantidad || 0;
          const nuevaCantidad = cantidadActual + cantidadDeseada;
          // Actualizar la cantidad en la orden existente
          ordenDoc.ref
            .update({ cantidad: nuevaCantidad })
            .then(() => {
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Error al actualizar la cantidad en la orden"
              }, error);
            });
        }
      })
      .catch((error) => {
        console.error("Error al buscar la orden en la tabla Ordenes:", error);
        Swal.fire({
          icon: "error",
          title: "Error al buscar la orden"
        }, error);
      });
  };

  const restarCantidadTablaOriginal = (productoId, cantidad) => {
    firebaseInstance.db
      .collection("productos")
      .doc(productoId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const { cantidad: cantidadOriginal } = doc.data();
          const cantidadRestante = cantidadOriginal - cantidad;

          firebaseInstance.db
            .collection("productos")
            .doc(productoId)
            .update({
              cantidad: cantidadRestante
            })
            .then(() => {
              console.log("Cantidad restada en la tabla original correctamente");
            })
            .catch((error) => {
              //console.error("Error al restar la cantidad en la tabla original:", error);
              Swal.fire({
                icon: "error",
                title: "Error al restar la cantidad"
              }, error);
            });
        }
      })
      .catch((error) => {
        console.error("Error al obtener el producto de la tabla original:", error);
        Swal.fire({
          icon: "error",
          title: "Error al obtener el producto"
        }, error);
      });
  };

  const manejarEnvioOrden = (producto) => {
    const selectCantidad = document.getElementById("cantidad");
    const cantidadDeseada = parseInt(selectCantidad.value);

    if (!isNaN(cantidadDeseada) && cantidadDeseada > 0) {
      if (cantidadDeseada <= producto.cantidad) {
        const productoOrden = { ...producto, cantidad: cantidadDeseada };
        enviarDatosOtraTabla(productoOrden);
        restarCantidadTablaOriginal(producto.id, cantidadDeseada);
        Swal.fire({
          icon: "success",
          title: "Se ha agregado un producto a la orden."
        });

      } else {
        //alert("La cantidad deseada es mayor a la cantidad disponible en el menú.");
        Swal.fire({
          icon: "error",
          title: "¡Solo existen " + producto.cantidad + " en inventario!"
        });
      }
    } else {
      //alert("Ingrese una cantidad válida.");
      Swal.fire({
        icon: "error",
        title: "¡Se ocupa al menos un producto!"
      });
    }
  };

  const handleCantidadChange = (event) => {
    const inputCantidad = event.target.value;
    const cantidad = parseInt(inputCantidad);
    if (isNaN(cantidad) || cantidad < 0) {
      event.target.value = "";
    }
  };

  return (
    <div className="w-full px-3 mb-4">
      <div className="p-5 shadow-md">
        <div className="lg:flex">
          <div className="lg:w-5/12 xl:w-3/12">
            <img src={imagen} alt="imagen producto" />
            <div className="sm:flex sm:-mx-2 pl-2">
              <label className="block mt-3 sm:w-2/2">
                <span className="block text-black-100 font-bold mb-2">Cantidad</span>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="cantidad"
                  type="number"
                  defaultValue={1}
                  onChange={handleCantidadChange}
                />
                <button
                  className="bg-gray-800 rounded hover:bg-gray-800 inline-block mt-5 pt-1 text-white uppercase font-bold text-lg"
                  onClick={() => manejarEnvioOrden(producto)}
                >
                  Agregar al Carrito de Compra
                </button>
              </label>
            </div>
          </div>
          <div className="lg:w-7/12 xl:w-9/12 pl-5">
            <p className="font-bold text-2xl text-black-100 mb-4">{nombre}</p>
            <p className="text-black-100 mb-4">
              Categoría: <span className="text-black-300">{categoria.toUpperCase()}</span>
            </p>
            <p className="text-black-300 mb-4">Descripción: {descripcion}</p>
            <p className="text-black-100 mb-4">
              Precio: <span className="text-black-300">$  {precio}</span>
            </p>
            <p className="text-black-100 mb-4">
              Cantidad disponible: <span className="text-black-300">{estado}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Producto;
