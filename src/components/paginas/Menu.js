import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import Producto from "../ui/Producto";

const Menu = () => {
  const [productos, guardarProductos] = useState([]);
  const { firebaseInstance } = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProductos = () => {
      firebaseInstance.db.collection("productos").onSnapshot(manejarSnapshot);
    };

    obtenerProductos();
  }, [firebaseInstance.db]);

  function manejarSnapshot(snapshot) {
    const productos = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    guardarProductos(productos);
  }

  return (
    <>
      <h1 className="text-3xl font-light mb-4" style={{textAlign: "center", fontFamily: "initial", fontSize: 40}}>Catálogo</h1>
      {productos.map((producto) => (
        <div key={producto.id}>
          <Producto producto={producto} />
          
        </div>
      ))}
    </>
  );
};

export default Menu;