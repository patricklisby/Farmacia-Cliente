import React, { useContext, useRef } from "react";
import { FirebaseContext } from "../../firebase";
import Swal from "sweetalert2";

const Orden = ({ orden }) => {

  // context de firebase para cambios en la BD
  const { firebaseInstance } = useContext(FirebaseContext);
  const { id, nombre, imagen,cantidad, existencia, categoria, precio, descripcion } =
    orden;
      // Existencia ref para acceder al valor directamente
  const existenciaRef = useRef(orden.existencia);
 const total= cantidad*precio;

 const restarCantidadTablaOriginal = (ordenId, cantidad) => {
  firebaseInstance.db
    .collection("Ordenes")
    .doc(ordenId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const { cantidad: cantidadOriginal, nombre } = doc.data();
        const cantidadRestante = cantidadOriginal - cantidad;

        firebaseInstance.db
          .collection("Ordenes")
          .doc(ordenId)
          .update({
            cantidad: cantidadRestante
          })
          .then(() => {
            //console.log("Cantidad restada en la tabla original correctamente");
            Swal.fire({
              icon: "success",
              title: "Se elimino el articulo"
            });

            if (cantidadRestante === 0) {
              firebaseInstance.db
                .collection("Ordenes")
                .doc(ordenId)
                .delete()
                .then(() => {
                  console.log("Documento eliminado correctamente");
                })
                .catch((error) => {
                  //console.error("Error al eliminar el documento:", error);
                  Swal.fire({
                    icon: "error",
                    title: "Error al eliminar el articulo"
                  }, error);      
                });
            }

            // Actualizar la cantidad en la colección "Productos"
            firebaseInstance.db
              .collection("productos")
              .where("nombre", "==", nombre)
              .get()
              .then((snapshot) => {
                if (!snapshot.empty) {
                  const productoDoc = snapshot.docs[0];
                  const productoId = productoDoc.id;
                  const { cantidad: cantidadProducto } = productoDoc.data();
                  const nuevaCantidadProducto = cantidadProducto + cantidad;

                  firebaseInstance.db
                    .collection("productos")
                    .doc(productoId)
                    .update({
                      cantidad: nuevaCantidadProducto
                    })
                    .then(() => {
                      console.log("Cantidad actualizada en la colección 'productos'");
                    })
                    .catch((error) => {
                      //console.error("Error al actualizar la cantidad en la colección 'productos':", error);
                      Swal.fire({
                        icon: "error",
                        title: "Error al actualizar la cantidad"
                      }, error);
                    });
                }
              })
              .catch((error) => {
                //console.error("Error al obtener el producto de la colección 'productos':", error);
                Swal.fire({
                  icon: "error",
                  title: "Error al obtener el producto"
                }, error);
              });
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
      //console.error("Error al obtener el orden de la tabla original:", error);
      Swal.fire({
        icon: "error",
        title: "Error al obtener el producto"
      }, error);
    });
 };

 const manejarEnvioOrden = (orden) => {

  const selectCantidad = document.getElementById("cantidad");
  const cantidadDeseada = parseInt(selectCantidad.value);
  if(true){
  if(cantidadDeseada <= orden.cantidad || cantidadDeseada > 0){
     restarCantidadTablaOriginal(orden.id, cantidadDeseada);
    }
    else{
      //alert("digite un numero mamapichas");
      Swal.fire({
        icon: "info",
        title: "La cantidad del carrito es "+orden.cantidad + " producto y usted ha intentado eliminar "+cantidadDeseada + " productos"
      });
    } 
  }else{
    Swal.fire({
      icon: "info",
      title: cantidadDeseada > 0
    });
  }
};
  return (
    <div className="w-full px-3 mb-4">
      <div className="p-5 shadow-md">
        <div className="lg:flex ">
          <div className="lg:w-5/12 xl:w-3/12">
            <img src={imagen} alt=" imagen orden " />
            <div className="sm:flex sm:-mx-2 pl-2 ">
              <label className="block mt-3 sm:w-2/1">
              
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-black-700 leading-tight focus:outline- none focus:shadow-outline" 
              id="cantidad"
              type = "number"
              defaultValue={1}/>{" "}
                <button className="bg-red-700 rounded hover:bg-red-600 inline-block mt-2 mb-2 p-1 text-gray-100 uppercase font-bold" onClick={() => manejarEnvioOrden(orden)}>
                  Eliminar Producto
                </button>
              </label>
            </div>
          </div>
          <div className="lg:w-7/12 xl:w-9/12 pl-5">
            <p className="font-bold text-2xl text-black-100 mb-4">{nombre}</p>
            <p className="mb-4 text-black-100 font-bold">
              Categoría: {""}
              <span className="text-black-300">
                {categoria.toUpperCase()}
              </span>
            </p>
            <p className="text-black-100 mb-4">{descripcion}</p>
            <p className="text-black-100 mb-4 font-bold">
              Cantidad: {""}
              <span className="text-black-300 ">{cantidad}</span>
            </p>{" "}
            <p className="text-black-100 mb-4 font-bold">
              Precio Total: {""}
              <span className="text-black-300 ">$ {total}</span>
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default Orden;
