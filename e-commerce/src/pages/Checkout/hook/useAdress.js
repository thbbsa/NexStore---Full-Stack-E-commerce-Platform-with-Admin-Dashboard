// hooks/useAddress.js
import { useState } from 'react';

export function useAddress() {
  const [endereco, setEndereco] = useState({
    logradouro: '', bairro: '', localidade: '', estado: ''
  });

  async function completeAddressFields(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) return;

    setEndereco(prev => ({
      ...prev,
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      estado: data.uf
    }));
  }

  return { endereco, setEndereco, completeAddressFields };
}