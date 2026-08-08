const API_URL = "http://localhost:3000/api";

export async function getPedidosStats() {
    const response = await fetch(`${API_URL}/stats`, {
        method: "GET",
        credentials: "include"
    })

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}

export async function getPedidosInfo() {
    const response = await fetch(`${API_URL}/pedidos-info`, {
        method: "GET",
        credentials: "include"
    })

    const data = await response.json()

    if (!response.ok) {
        throw data;
    }


    return data;
}