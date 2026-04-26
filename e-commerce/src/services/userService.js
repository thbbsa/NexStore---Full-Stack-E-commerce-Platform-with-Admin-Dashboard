const API_URL = "http://localhost:3000/api";

export async function getMe() {
  const response = await fetch(`${API_URL}/perfil`, {
    method: "GET",
    credentials: "include"
  });

  const data = await response.json();

  if (response.status === 401) {
      return null; // evita erro feio
    }

  if (!response.ok) throw data;

  return data;
}

export async function storeUser(user) {
  if (user.Id) {
    // UPDATE
    return await fetch(`${API_URL}/perfil/${user.Id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
  } else {
    return await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
  }
}

export async function logout() {
  await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include"
  });
}

export async function storeEndereco(endereco, numero, complemento) {
  return await fetch(`${API_URL}/criar-endereco`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // importante para enviar o cookie de autenticação
    body: JSON.stringify({ ...endereco, numero, complemento }),
  })
}

export async function getEndereco({signal}) {
  return await fetch(`${API_URL}/meu-endereco`, {
    method: "GET",
    credentials: "include",
    signal: signal
  })
}

export async function UpdateEndereco(endereco) {
  return await fetch(`${API_URL}/atualizar-endereco/${endereco.Id_endereco}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(endereco)
  })
}



