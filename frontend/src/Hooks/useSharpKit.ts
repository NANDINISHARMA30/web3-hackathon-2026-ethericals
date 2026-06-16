const API_BASE = "http://localhost:4000";
const DEFAULT_KEY = "test_key";

function headers(apiKey = DEFAULT_KEY) {
  return {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  };
}

async function post(path: string, body: Record<string, unknown>, apiKey?: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

async function get(path: string, apiKey?: string) {
  const res = await fetch(`${API_BASE}${path}`, { headers: headers(apiKey) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const sharpkit = {
  earn: (userId: string, amount: number, reason = "reward", apiKey?: string) =>
    post("/api/earn", { userId, amount, reason }, apiKey),

  spend: (userId: string, amount: number, reason = "redeem", apiKey?: string) =>
    post("/api/spend", { userId, amount, reason }, apiKey),

  buyFiat: (userId: string, amount: number, apiKey?: string) =>
    post("/api/buy/mock", { userId, amount, paymentMethod: "card" }, apiKey),

  verifyCrypto: (userId: string, txHash: string, amount: number, apiKey?: string) =>
    post("/api/buy/verify-crypto", { userId, txHash, amount }, apiKey),

  balance: (userId: string, apiKey?: string) =>
    get(`/api/balance/${encodeURIComponent(userId)}`, apiKey),

  txLog: (limit = 20, apiKey?: string) =>
    get(`/api/balance/txlog/all?limit=${limit}`, apiKey),
};

export { API_BASE };
