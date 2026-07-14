const API_URL = "http://localhost:3000/api";

export async function getUsuarios() {
    const response = await fetch(`${API_URL}/usuarios`, {
    method: "GET",
  });

  const data = await response.json();

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) throw data;

  return data;
}