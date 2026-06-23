import { useEffect, useState } from "react";
import { getMe, getEndereco } from '../../../services/userService';

export function usePerfilData() {
    const [user, setUser] = useState({
        Id: '', Nome: '', Username: '', Email: '', Telefone: '', CPF: ''
    });
    const [originalUser, setOriginalUser] = useState({});

    const [endereco, setEndereco] = useState({
        Rua: '', Numero: '', Complemento: '', Bairro: '',
        Cidade: '', Estado: '', CEP: '', Principal: null
    });
    const [originalEndereco, setOriginalEndereco] = useState({});

    useEffect(() => {
        let ativo = true;

        const carregarInfoUser = async () => {
            try {
                const data = await getMe();
                const response = await getEndereco({ signal: new AbortController().signal });
                const enderecos = await response.json();

                if (!ativo) return;

                setUser(data.user || data);
                setOriginalUser(data.user || data);

                const enderecoPrincipal = Array.isArray(enderecos)
                    ? enderecos.find(e => e.Principal)
                    : null;

                setOriginalEndereco(enderecoPrincipal || {});
                setEndereco(enderecoPrincipal || {});

            } catch (error) {
                if (ativo) console.error("Erro ao carregar info do usuário:", error);
            }
        };

        carregarInfoUser();

        return () => { ativo = false; };
    }, []);

    return {
        user, setUser,
        originalUser, setOriginalUser,
        endereco, setEndereco,
        originalEndereco, setOriginalEndereco,
    };
}