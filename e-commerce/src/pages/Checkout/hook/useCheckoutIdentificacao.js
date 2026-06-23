import { useEffect, useState } from "react";
import { getMe, getEndereco, storeEndereco, UpdateEndereco } from "../../../services/userService";


const ESTADO_INICIAL_USER = {
    Id: '', Nome: '', Username: '', Email: '', Telefone: '', CPF: '',
    Enderecos: []
}

export function useCheckoutIdentificacao() {
    const [user, setUser] = useState(ESTADO_INICIAL_USER);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const buscarDadosUsuario = async () => {
            try {
                const data = await getMe();
                const response = await getEndereco({ signal: controller.signal });
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
                    : [normalizarEndereco(enderecos)];

                if (data?.user) {
                    setUser(prev => ({ ...prev, ...data.user, Enderecos: lista }));
                    if (lista.length > 0) {
                        const principal = lista.find(e => e.principal);
                        setEnderecoSelecionado(principal ? principal.id : lista[0].id);
                    } else {
                        setEnderecoSelecionado(null);
                    }
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Erro ao buscar dados do usuário:", error);
                }
            }
        };

        buscarDadosUsuario();
        return () => controller.abort();
    }, []);


    return  {
        user,
        enderecoSelecionado,
        setEnderecoSelecionado
    }
}