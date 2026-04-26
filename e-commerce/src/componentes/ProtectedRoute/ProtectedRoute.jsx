import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../../services/userService";

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getMe();
                if (!res || !res.user) {
                    setIsAuth(false);
                } else {
                    setIsAuth(true);
                }
            } catch (error) {
                setIsAuth(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuth === null) {
        return <p>Carregando...</p>;
    }

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;