export const validadeCartaoValida = (validade) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(validade)) {
        return false;
    }

    const [mes, ano] = validade.split('/');

    const hoje = new Date();

    const anoAtual = hoje.getFullYear() % 100;
    const mesAtual = hoje.getMonth() + 1;

    const anoCartao = parseInt(ano);
    const mesCartao = parseInt(mes);

    if (anoCartao < anoAtual) {
        return false;
    }

    if (anoCartao === anoAtual && mesCartao < mesAtual) {
        return false;
    }

    return true;
}