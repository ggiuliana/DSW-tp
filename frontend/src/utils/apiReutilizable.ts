export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3000/api${path}`, {
        ...options,
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
    const resultado = await response.json() as { data?: T; message?: string };
    if (!response.ok) throw new Error(resultado.message || "No se pudo completar la solicitud.");
    return resultado.data as T;
}