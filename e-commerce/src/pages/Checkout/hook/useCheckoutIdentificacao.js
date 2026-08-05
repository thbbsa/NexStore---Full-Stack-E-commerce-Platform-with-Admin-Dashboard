import { useEffect, useState, useCallback } from "react";
import { getMe, getEndereco } from "../../../services/userService";

const ESTADO_INICIAL_USER = {
  Id: '', Nome: '', Username: '', Email: '', Telefone: '', CPF: '',
  Enderecos: []
};

export function useCheckoutIdentificacao() {
  const [user, setUser] = useState(ESTADO_INICIAL_USER);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);

  const buscarDadosUsuario = useCallback(async (signal) => {
    try {
      const data = await getMe();
      // Passa um objeto vazio {} como fallback para evitar desestruturar undefined
      const response = await getEndereco(signal ? { signal } : {});
      const enderecos = await response.json();

      const normalizarEndereco = (e) => ({
        id: e.Id_endereco,
        label: "Casa",
        rua: e.Rua,
        numero: e.Numero,
        complemento: e.Complemento,
        bairro: e.Bairro,
        cidade: e.Cidade,
        estado: e.Estado,
        cep: e.Cep,
        principal: e.Principal
      });

      const lista = Array.isArray(enderecos)
        ? enderecos.map(normalizarEndereco)
        : enderecos ? [normalizarEndereco(enderecos)] : [];

      if (data?.user) {
        setUser(prev => ({ ...prev, ...data.user, Enderecos: lista }));

        if (lista.length > 0) {
          setEnderecoSelecionado(prev => {
            if (prev && lista.some(e => e.id === prev)) return prev;
            const principal = lista.find(e => e.principal);
            return principal ? principal.id : lista[0].id;
          });
        } else {
          setEnderecoSelecionado(null);
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    buscarDadosUsuario(controller.signal);
    return () => controller.abort();
  }, [buscarDadosUsuario]);

  return {
    user,
    enderecoSelecionado,
    setEnderecoSelecionado,
    buscarUsuario: buscarDadosUsuario
  };
}