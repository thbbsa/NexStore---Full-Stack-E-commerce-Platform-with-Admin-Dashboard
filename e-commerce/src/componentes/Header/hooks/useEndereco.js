import { useState, useEffect } from "react";
import { getEndereco, storeEndereco, UpdateEndereco } from "../../../services/userService";

function formatarLabel(cep, numero, complemento) {
    if (!cep?.trim()) return "";
    if (complemento?.trim()) return `${cep}, nº ${numero} — ${complemento}`;
    if (numero?.trim()) return `${cep}, nº ${numero}`;
    return cep;
}

export function useEndereco() {
    const [enderecos, setEnderecos] = useState([]);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
    const [enderecoSalvo, setEnderecoSalvo] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function buscarEnderecos() {
            try {
                const response = await getEndereco({ signal: controller.signal });
                if (!response.ok) return;

                const dados = await response.json();
                if (!dados) return;

                const lista = Array.isArray(dados) ? dados : [dados];
                setEnderecos(lista);

                const principal = lista.find((e) => e.Principal === true);
                if (principal) {
                    setEnderecoSalvo(formatarLabel(principal.Cep, principal.Numero, principal.Complemento));
                    setEnderecoSelecionado(principal.Id_endereco);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Erro ao buscar endereço:", error);
                }
            }
        }

        buscarEnderecos();
        return () => controller.abort();
    }, []);

    async function confirmarEndereco(cep, numero, complemento) {
        if (!cep.trim()) {
            // Selecionar um endereço já cadastrado
            const endereco = enderecos.find((e) => e.Id_endereco === enderecoSelecionado);
            if (!endereco) return;
            await UpdateEndereco(endereco);
            setEnderecoSalvo(formatarLabel(endereco.Cep, endereco.Numero, endereco.Complemento));
        } else {
            // Cadastrar novo endereço via CEP
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const dados = await res.json();
                await storeEndereco(dados, numero, complemento);
                setEnderecoSalvo(formatarLabel(cep, numero, complemento));
            } catch (error) {
                console.error("Erro ao salvar endereço:", error);
            }
        }
    }

    return {
        enderecos,
        enderecoSelecionado,
        setEnderecoSelecionado,
        enderecoSalvo,
        confirmarEndereco,
    };
}