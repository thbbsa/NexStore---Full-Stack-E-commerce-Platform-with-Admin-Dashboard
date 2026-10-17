export const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    return score;
};

export const checkName = (name, setError, clearError) => {
    if (!name || name.length < 3) {
        setError("Nome inválido. Deve conter no mínimo 3 caracteres.");
        return false;
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
        setError("Nome deve conter apenas letras e espaços.");
        return false;
    }
    clearError();
    return true;
};

export const checkUsername = (username, setError, clearError) => {
    if (!username || username.length < 3) {
        setError("Username inválido. Mínimo 3 caracteres.");
        return false;
    }
    if (!/^\w+$/.test(username)) {
        setError("Username deve conter apenas letras, números e underscores.");
        return false;
    }
    clearError();
    return true;
};

export const checkEmail = (email, setError, clearError) => {
    if (!email) { setError("O campo de e-mail não pode estar vazio."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Digite um e-mail válido (ex: exemplo@dominio.com).");
        return false;
    }
    clearError();
    return true;
};


export const checkCPF = (cpf, setError, clearError) => {
    const cpfLimpo = cpf.replace(/\D/g, '')

    if (!cpf) { setError("O campo de CPF não pode estar vazio."); return false; }
    if (cpfLimpo.length < 11) { setError("Cpf inválido. Coloque um cpf válido"); return false; }

    clearError();
    return true;
}


export const checkTelefone = (telefone, setError, clearError) => {
    if (!telefone) { setError("O campo de Telefone não pode estar vazio."); return false; }
    if (telefone.length < 11) { setError("Telefone inválido."); return false; }

    clearError();
    return true;
}

export const checkPassword = (password, setError, clearError) => {
    if (!password) { setError("O campo de senha não pode estar vazio."); return false; }
    if (password.length < 8) { setError("A senha deve ter no mínimo 8 caracteres."); return false; }
    if (!/[A-Z]/.test(password)) { setError("A senha deve conter pelo menos uma letra maiúscula."); return false; }
    if (!/[0-9]/.test(password)) { setError("A senha deve conter pelo menos um número."); return false; }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setError("A senha deve conter pelo menos um caractere especial (ex: @, #, !).");
        return false;
    }
    clearError();
    return true;
};

export const checkPasswordMatch = (password, confirmPassword, setError, clearError) => {
    if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        return false;
    }
    clearError();
    return true;
};
