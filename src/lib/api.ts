/**
 * Robust API helper for Vercel and local deployments.
 * Validates Content-Type before parsing JSON and provides clean error messages
 * instead of throwing Unexpected token syntax errors when receiving non-JSON (like 404 HTML).
 */
export async function apiFetch(url: string, options?: RequestInit) {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (err: any) {
    throw new Error(`Network connection error: ${err.message || 'Failed to fetch'}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    if (res.status === 404 || text.toLowerCase().includes("not found") || text.toLowerCase().includes("html")) {
      throw new Error("API endpoint not found or serverless function unavailable (404).");
    }
    throw new Error(`Server returned non-JSON response (${res.status} ${res.statusText}). Content-Type was ${contentType}`);
  }

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Failed to parse server response as JSON.");
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
  }

  return data;
}
