export const formatarCpf = (value) => {
    value = value.replace(/\D/g, '')
    value = value.slice(0, 11)

    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    return value
}

export const formatarTelefone = (value) => {
    value = value.replace(/\D/g, '')
    value = value.slice(0, 11)

    if (value.length <= 10) {
        // telefone fixo
        value = value.replace(/(\d{2})(\d)/, '($1) $2')
        value = value.replace(/(\d{4})(\d)/, '$1-$2')
    } else {
        // celular
        value = value.replace(/(\d{2})(\d)/, '($1) $2')
        value = value.replace(/(\d{5})(\d)/, '$1-$2')
    }

    return value
}

export const formatarCartao = (numero) => {
    const apenasNumeros = numero.replace(/\D/g, '');
    const partes = [];

    for (let i = 0; i < apenasNumeros.length; i += 4) {
        partes.push(apenasNumeros.substring(i, i + 4));
    }

    return partes.join(' ');
}

export const formartarValidadeCartao = (validade) => {
    const apenasNumeros = validade.replace(/\D/g, '');
    let formatted = apenasNumeros;
    if (apenasNumeros.length > 2) {
        formatted = apenasNumeros.substring(0, 2) + '/' + apenasNumeros.substring(2, 4);
    }
    return formatted;
}