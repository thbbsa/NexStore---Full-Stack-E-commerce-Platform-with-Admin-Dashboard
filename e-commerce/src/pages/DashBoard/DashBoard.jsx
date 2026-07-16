import { Outlet } from "react-router-dom";
import AdminHeader from "../../componentes/DashBoard/Header/AdminHeader";
import SideBar from "../../componentes/DashBoard/SideBar/SideBar";

const DashBoard = () => {
    return (
        <div className="d-flex">
            <SideBar />

            <div className="flex-grow-1">
                <AdminHeader />
                <Outlet /> {/* AQUI MUDA SÓ O MEIO */}
            </div>
        </div>
    );
};

export default DashBoard;
