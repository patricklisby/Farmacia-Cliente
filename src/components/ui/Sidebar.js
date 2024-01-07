import React from 'react';
import { NavLink } from 'react-router-dom';
import icon from '../../img/imgPortrait.png';
const Sidebar = () => {
    return (
        <div className="md:w-2/6 xl:w-1/6 bg-gray-800">
            <div className="p-6">
            <img src={icon} alt="Descripción de la imagen" />
                <p className="uppercase text-gray-100 text-3xl tracking-wide text-center font-bold">Sin Gripe</p>
                <nav className="mt-10" style={{textAlign:"center"}}>
                    <NavLink className="p-1 mb-3 text-2xl font-bold text-gray-100 block hover:bg-blue-300 hover:text-gray-900" activeclassname="text-yellow-500" exact="true" to="/menu">Catálogo</NavLink>
                    <NavLink className="p-1 mb-3 text-2xl font-bold text-gray-100 block hover:bg-blue-300 hover:text-gray-900" activeclassname="text-yellow-500" exact="true" to="/">Carrito</NavLink>
                    <NavLink className="p-1 mb-3 text-2xl font-bold text-gray-100 block hover:bg-blue-300 hover:text-gray-900" activeclassname="text-yellow-500" exact="true" to="/pedido">Ver pedido</NavLink>
                </nav>
            </div>
        </div>
    );
}
export default Sidebar;