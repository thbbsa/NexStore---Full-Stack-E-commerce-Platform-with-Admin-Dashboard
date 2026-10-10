import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../../services/userService";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getMe();

                if (!res || !res.user) {
                    setStatus("login");
                } else if (adminOnly && res.user.Role !== "admin") {
                    setStatus("negado");
                } else {
                    setStatus("ok");
                }
            } catch (error) {
                setStatus("login");
            }
        };

        checkAuth();
    }, [adminOnly]);

    if (status === "loading") {
        return <p>Carregando...</p>;
    }

    if (status === "login") {
        return <Navigate to="/login" replace />;
    }

    if (status === "negado") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;