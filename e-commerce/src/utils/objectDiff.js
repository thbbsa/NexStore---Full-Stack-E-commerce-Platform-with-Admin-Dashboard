export function verificarCamposMudados(original, atual, id) {
    const mudancas = {};

    for (const key in original) {
        if (key === id) {
            mudancas[key] = original[key]; // sempre envie o Id para identificação
            continue;
        }

        if (atual.hasOwnProperty(key) && original[key] !== atual[key]) {
            mudancas[key] = atual[key];
        }
    }

    return mudancas;
}