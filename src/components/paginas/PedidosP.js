import React, { useState, useEffect, useContext } from "react";

import { FirebaseContext } from "../../firebase";
import Pedido from "../ui/Pedido";

const Menu = () => {
  const [pedidos, guardarPedidos] = useState([]);
  const { firebaseInstance } = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerPedidos = () => {
      firebaseInstance.db.collection("Recibo").onSnapshot(manejarSnapshot);
    };

    obtenerPedidos();
  }, [firebaseInstance.db]);

  function manejarSnapshot(snapshot) {
    const pedidos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    // Ordenar los pedidos por estado, colocando primero los que tienen estado true
    const pedidosOrdenados = pedidos.sort((a, b) => {
      if (a.estado === true && b.estado === false) {
        return -1; // Colocar a antes que b
      } else if (a.estado === false && b.estado === true) {
        return 1; // Colocar b antes que a
      } else {
        return 0; // Mantener el orden actual
      }
    });
  
    guardarPedidos(pedidosOrdenados);
  }
  

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Pedidos Realizados</h1>
      {/** 
      {pedidos.map((pedido) => (
        <div key={pedido.id}>
          <Pedido pedido={pedido} />
        </div>
      ))}
      */}
    <div className="grid grid-cols-2 gap-4">
      {pedidos.map((pedido) => (
        <a
          href="#"
          class="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <h5 class="mb-2 text-2m font-bold tracking-tight text-gray-900 dark:text-white">
            <div key={pedido.id}>
              <p class="font-normal text-gray-700 dark:text-gray-400">
                <Pedido pedido={pedido} />
              </p>
            </div>
          </h5>
        </a>
      ))}
      </div>
    </>
  );
};

export default Menu;
