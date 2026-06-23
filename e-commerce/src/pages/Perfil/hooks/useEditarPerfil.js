import { storeUser, UpdateEndereco } from '../../../services/userService';
import { useState } from "react";
import { verificarCamposMudados } from "../../../utils/objectDiff";

export function useEditarPerfil({
    user, setUser,
    endereco, setEndereco,
    originalUser, setOriginalUser,
    originalEndereco, setOriginalEndereco,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const handleCancel = () => {
        setUser(originalUser);
        setEndereco(originalEndereco);
        setMessage("");
        setStatus("");
        setIsEditing(false);
    };

    const handleEditProfile = async () => {
        if (!isEditing) {
            setMessage("");
            setStatus("");
            setIsEditing(true);
            return;
        }

        const isEqualUser = JSON.stringify(user) === JSON.stringify(originalUser);
        const isEqualEndereco = JSON.stringify(endereco) === JSON.stringify(originalEndereco);

        if (isEqualUser && isEqualEndereco) {
            setMessage("Nenhuma alteração feita.");
            setStatus("error");
            setIsEditing(false);
            return;
        }

        try {
            const userToSend = {
                ...user,
                CPF: user.CPF.replace(/\D/g, ''),
                Telefone: user.Telefone.replace(/\D/g, '')
            };

            const camposMudadosUser = verificarCamposMudados(originalUser, userToSend, "Id");
            const camposMudadosEndereco = verificarCamposMudados(originalEndereco, endereco, "Id_endereco");

            const semMudancaUser = Object.keys(camposMudadosUser).length === 1;
            const semMudancaEndereco = Object.keys(camposMudadosEndereco).length === 1;

            if (semMudancaUser && semMudancaEndereco) {
                setMessage("Nenhuma alteração feita.");
                setStatus("error");
                setIsEditing(false);
                return;
            }

            let userResponse = null;
            let enderecoResponse = null;

            if (!semMudancaUser) {
                userResponse = await storeUser(camposMudadosUser);
            }

            if (!semMudancaEndereco) {
                enderecoResponse = await UpdateEndereco(camposMudadosEndereco);
            }

            const userSuccess = userResponse?.ok;
            const enderecoSuccess = enderecoResponse?.ok;

            if (userSuccess || enderecoSuccess) {
                let result = null;

                if (userResponse) {
                    result = await userResponse.json();
                } else if (enderecoResponse) {
                    result = await enderecoResponse.json();
                }

                setMessage(result?.message || "Perfil atualizado.");
                setStatus("success");

                setOriginalUser(user);
                setOriginalEndereco(endereco);

                setIsEditing(false);
            } else {
                let errorData = null;

                if (userResponse && !userResponse.ok) {
                    errorData = await userResponse.json();
                } else if (enderecoResponse && !enderecoResponse.ok) {
                    errorData = await enderecoResponse.json();
                }

                setMessage(errorData?.message || "Erro ao atualizar perfil.");
                setStatus("error");
            }

        } catch (error) {
            console.error("Erro de rede ao atualizar perfil:", error);
            setMessage("Erro de rede ao atualizar perfil.");
            setStatus("error");
        }
    };

    return {
        isEditing,
        message,
        status,
        handleCancel,
        handleEditProfile,
    };
}