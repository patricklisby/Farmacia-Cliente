import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { FirebaseContext } from "../../firebase";

import Orden from "../ui/Orden";
import Swal from "sweetalert2";

const Ordenes = () => {
  const { firebaseInstance } = useContext(FirebaseContext);
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    const cargarOrdenes = () => {
      firebaseInstance.db
        .collection("Ordenes")
        .get()
        .then((querySnapshot) => {
          const ordenesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setOrdenes(ordenesData);
        })
        .catch((error) => {
          console.error("Error al cargar las órdenes:", error);
        });
    };

    cargarOrdenes();
  }, [firebaseInstance]);

  const finalizarCompra = () => {
    let precioTotal = 0;
    let articulos = "";
    let estados = true;

    ordenes.forEach((orden) => {
      const precio = parseInt(orden.precio);
      const cantidad = parseInt(orden.cantidad);
      const precioTotalArticulo = precio * cantidad;
      precioTotal += precioTotalArticulo;
      articulos += `${orden.nombre} (${orden.cantidad}) $${precioTotalArticulo},\n`;
      estados = true;
    });

    firebaseInstance.db
      .collection("Recibo")
      .add({
        articulos: articulos.trim(),
        PrecioTotal: precioTotal,
        estado : estados
      })
      .then(() => {
        //console.log("La nueva colección se creó correctamente.");
        Swal.fire({
          icon: "success",
          title: "Su pedido ha sido procesado."
        });
        

        // Eliminar todos los documentos de la colección "Ordenes"
        firebaseInstance.db.collection("Ordenes")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete();
            });
          })
          .then(() => {
            console.log("Se eliminaron todos los documentos de la colección 'Ordenes'.");
          })
          .catch((error) => {
            console.error("Error al eliminar los documentos de la colección 'Ordenes':", error);
          });
      })
      .catch((error) => {
        console.error("Error al crear la nueva colección:", error);
      });
  };

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Carrito de compra</h1>
    
      {ordenes.map((orden) => (
        <div key={orden.id}>
          <Orden orden={orden} />
        </div>
      ))}
      <Link to = "/pedido">
      <button
        className="bg-green-700 hover:bg-green-800 inline-block ml-3 p-2 text-white uppercase font-bold"
        id="finalizarCompra"
        onClick={finalizarCompra}
        
      >
        Completar el pedido
      </button>
      </Link>
      
    </>
  );
};

export default Ordenes;
