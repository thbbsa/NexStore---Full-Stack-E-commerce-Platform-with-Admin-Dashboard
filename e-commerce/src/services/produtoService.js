const API_URL = "http://localhost:3000/api/produtos";

export async function buscarProdutosAdmin() {
  const response = await fetch(`${API_URL}/admin`, {
    method: "GET",
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function buscarProdutosPublicos() {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}


export async function excluirProduto(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return true;
}


export async function buscarProdutoPorId(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function atualizarProduto(id, produto) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(produto)
  }); 

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function buscarProdutosPorQuery(term, categoria) {
  const params = new URLSearchParams();

  if (term) params.append("q", term);
  if (categoria) params.append("categoria", categoria);

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    method: "GET",
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) throw data;

  return data;
}

