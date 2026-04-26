import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getMe } from "../../../services/userService";

export function useHeader() {
    const [busca, setBusca] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [username, setUsername] = useState("");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Detectar scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Buscar dados do usuário logado
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await getMe();
                setUsername(res?.user?.Username || "");
            } catch {
                setUsername("");
            }
        }
        fetchUser();
    }, []);

    function handleBuscar(e) {
        e.preventDefault();
        if (!busca.trim()) return;
        navigate(`/produtos?q=${busca}`);
    }

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    }

    const isLogged = username !== "";
    const initials = username ? username.slice(0, 2).toUpperCase() : "??";

    return {
        busca,
        setBusca,
        scrolled,
        dropdownOpen,
        setDropdownOpen,
        openModal,
        setOpenModal,
        username,
        isLogged,
        initials,
        dropdownRef,
        handleBuscar,
        handleLogout,
    };
}