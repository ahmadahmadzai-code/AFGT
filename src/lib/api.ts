interface ApiOptions {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, signal } = options;
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
    credentials: "same-origin",
  });
  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(json.error ?? `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  get: <T,>(url: string, signal?: AbortSignal) => request<T>(url, { signal }),
  post: <T,>(url: string, body: unknown) => request<T>(url, { method: "POST", body }),
  patch: <T,>(url: string, body: unknown) => request<T>(url, { method: "PATCH", body }),
  delete: <T,>(url: string) => request<T>(url, { method: "DELETE" }),
};
