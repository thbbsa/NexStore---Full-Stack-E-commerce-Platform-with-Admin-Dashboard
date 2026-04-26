import { Outlet } from "react-router-dom";
import AdminHeader from "../componentes/DashBoard/AdminHeader";
import SideBar from "../componentes/DashBoard/SideBar";

const DashBoard = () => {
    return (
        <div className="d-flex">
            <SideBar />

            <div className="flex-grow-1">
                <AdminHeader />
                <Outlet /> {/* 🔥 AQUI MUDA SÓ O MEIO */}
            </div>
        </div>
    );
};

export default DashBoard;
