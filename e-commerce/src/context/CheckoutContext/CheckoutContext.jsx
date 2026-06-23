// context/CheckoutContext/CheckoutContext.js
import { createContext, useState } from "react";

export const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [dadosCheckout, setDadosCheckout] = useState(() => {
    const salvo = sessionStorage.getItem("dadosCheckout");
    return salvo 
      ? JSON.parse(salvo) 
      : { enderecoId: null, tipoEntrega: null };
  });

  function atualizarDados(novos) {
    setDadosCheckout(prev => {
      const atualizado = { ...prev, ...novos };
      sessionStorage.setItem("dadosCheckout", JSON.stringify(atualizado));
      return atualizado;
    });
  }

  // Limpar ao finalizar o pedido
  function limparCheckout() {
    sessionStorage.removeItem("dadosCheckout");
    setDadosCheckout({ enderecoId: null, tipoEntrega: null });
  }

  return (
    <CheckoutContext.Provider value={{ dadosCheckout, atualizarDados, limparCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}