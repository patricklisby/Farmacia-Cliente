import React, { useContext, useRef, useState, useEffect } from "react";
import { FirebaseContext } from "../../firebase";

const Pedido = ({ pedido }) => {
  // Existencia ref para acceder al valor directamente
  const existenciaRef = useRef(pedido.existencia);
  // context de firebase para cambios en la BD
  const { firebaseInstance } = useContext(FirebaseContext);
  const { id, PrecioTotal, articulos , estado} = pedido;

  let msgEstado = pedido.estado ? 'En curso' : 'Finalizado';

  const articulosConSaltoDeLinea = articulos.split(",").join("\n");

  //Timer

  const Ref = useRef(null);
  const [timer, setTimer] = useState('00:00');


  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total, minutes, seconds
    };
  }
  const startTimer = (e) => {
    let { total, minutes, seconds }
      = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : '0' + minutes) + ':'
        + (seconds > 9 ? seconds : '0' + seconds)
      )
    }
  }

  const clearTimer = (e) => {
    setTimer('05:00');
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000)
    Ref.current = id;
  }

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + 5);
    return deadline;

  }

  useEffect(() => {
    if (estado) {
      clearTimer(getDeadTime());
    } else {
      //clearTimer(getDeadTime());
    }
  }, [estado]);

  return (
    <div className="w-full px-3 mb-4 pl-5 shadow-md" style={{textAlign:"center"}}>
      <span className="text-black-100 font-bold">Orden: {id.toUpperCase()}</span>
      <p className="text-black-100 mb-4">
        <table className="table-auto w-full border-collapse">
          <thead >
            <tr>
              <th className="px-4 py-2">Artículos</th>
            </tr>
          </thead>
          <tbody>
            {articulosConSaltoDeLinea.split('\n').map((articulo, index) => (
              <tr key={index}>
                <td>{articulo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <span className="text-black-100">Tiempo del pedido: {timer} </span>
        <p className="text-black-100 mb-4">Precio Total: {PrecioTotal}</p>
        <p className="text-black-100 mb-4">Estado Orden: {msgEstado}</p>
      </p>
    </div>
  );
};

export default Pedido;
