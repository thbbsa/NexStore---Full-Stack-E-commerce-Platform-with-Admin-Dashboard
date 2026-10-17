import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeUser } from "../../../services/userService.js";

import {
    checkName,
    checkUsername,
    checkEmail,
    checkCPF,
    checkTelefone,
    checkPassword,
    checkPasswordMatch
} from "../../../utils/validationUtils.js";

export default function useRegister() {
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const clearError = () => setError("");

    const validateForm = (value) => {
        if (!checkName(value.nome, setError, clearError)) return false;
        if (!checkUsername(value.username, setError, clearError)) return false;
        if (!checkCPF(value.cpf, setError, clearError)) return false;
        if (!checkEmail(value.email, setError, clearError)) return false;
        if (!checkTelefone(value.telefone, setError, clearError)) return false;
        if (!checkPassword(value.senha, setError, clearError)) return false;

        if (!checkPasswordMatch(
            value.senha,
            value.confirmPassword,
            setError,
            clearError
        )) return false;

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.target);
        const value = Object.fromEntries(data.entries());

        // LIMPAR MÁSCARAS
        value.cpf = value.cpf.replace(/\D/g, '')
        value.telefone = value.telefone.replace(/\D/g, '')

        if (!validateForm(value)) return;

        setIsLoading(true);
        setIsDisabled(true);
        setError("");

        try {
            const response = await storeUser(value);
            const result = await response.json();

            if (response.ok) {
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setError(result.message || "Erro ao registrar usuário.");
                setIsLoading(false);
                setIsDisabled(false);
            }
        } catch (err) {
            console.error("Erro de rede:", err);
            setError("Erro de conexão com o servidor.");
            setIsLoading(false);
            setIsDisabled(false);
        }
    };

    return {
        error,
        setError,
        isLoading,
        isDisabled,
        handleSubmit
    }
}