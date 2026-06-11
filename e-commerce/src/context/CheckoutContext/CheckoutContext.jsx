// context/Checkout/CheckoutContext.js
import { createContext, useState, useContext } from "react";

export const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [dadosCheckout, setDadosCheckout] = useState({
    enderecoId: null,
    tipoEntrega: null,
  });

  return (
    <CheckoutContext.Provider value={{ dadosCheckout, setDadosCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}