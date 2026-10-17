import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useLogin() {
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData(e.target);
        const value = Object.fromEntries(data.entries());

        setIsLoading(true);
        setIsDisabled(true);
        setError("");

        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(value),
        });

        const result = await response.json();

        if (response.ok) {
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } else {
            console.error("Login failed:", result);
            setError(result.message || "Erro ao fazer login.");
            setIsLoading(false);
            setIsDisabled(false);
        }
    };

    return {
        error,
        setError,
        isDisabled,
        setIsDisabled,
        isLoading,
        setIsLoading,
        handleSubmit
    }
}