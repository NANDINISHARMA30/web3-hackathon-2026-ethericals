/**
 * SharpKit SDK v1.0.0
 * Plug-and-play Sharp Token integration for any JavaScript app.
 *
 * Usage:
 *   SharpKit.init({ apiKey: "test_key", baseUrl: "http://localhost:4000" })
 *   await SharpKit.reward("user123", 50, "daily_login")
 *   await SharpKit.spend("user123", 20, "redeem_discount")
 *   await SharpKit.getBalance("user123")
 */
(function (global) {
  "use strict";

  let _config = { apiKey: "", baseUrl: "http://localhost:4000" };

  function _headers() {
    return {
      "Content-Type": "application/json",
      "x-api-key": _config.apiKey,
    };
  }

  async function _post(path, body) {
    const res = await fetch(_config.baseUrl + path, {
      method: "POST",
      headers: _headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "SharpKit API error");
    return data;
  }

  async function _get(path) {
    const res = await fetch(_config.baseUrl + path, { headers: _headers() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "SharpKit API error");
    return data;
  }

  const SharpKit = {
    /**
     * Initialize the SDK
     * @param {{ apiKey: string, baseUrl?: string }} options
     */
    init(options) {
      if (!options || !options.apiKey) throw new Error("SharpKit.init requires { apiKey }");
      _config = { ..._config, ...options };
      console.log("[SharpKit] Initialized ✓");
    },

    /**
     * Reward a user with Sharp Tokens
     * @param {string} userId
     * @param {number} amount
     * @param {string} [reason]
     */
    async reward(userId, amount, reason = "reward") {
      return _post("/api/earn", { userId, amount, reason });
    },

    /**
     * Deduct Sharp Tokens from a user
     * @param {string} userId
     * @param {number} amount
     * @param {string} [reason]
     */
    async spend(userId, amount, reason = "spend") {
      return _post("/api/spend", { userId, amount, reason });
    },

    /**
     * Get a user's Sharp Token balance
     * @param {string} userId
     * @returns {Promise<{ userId: string, balance: number }>}
     */
    async getBalance(userId) {
      return _get(`/api/balance/${encodeURIComponent(userId)}`);
    },

    /**
     * Simulate a fiat purchase of Sharp Tokens
     * @param {string} userId
     * @param {number} amount
     * @param {string} [paymentMethod]
     */
    async buyWithFiat(userId, amount, paymentMethod = "card") {
      return _post("/api/buy/mock", { userId, amount, paymentMethod });
    },

    /**
     * Credit tokens after a verified on-chain purchase
     * @param {string} userId
     * @param {string} txHash  — Sepolia tx hash
     * @param {number} amount
     */
    async verifyCryptoPurchase(userId, txHash, amount) {
      return _post("/api/buy/verify-crypto", { userId, txHash, amount });
    },
  };

  // Export: ESM, CommonJS, or browser global
  if (typeof module !== "undefined" && module.exports) {
    module.exports = SharpKit;
  } else if (typeof define === "function" && define.amd) {
    define([], function () { return SharpKit; });
  } else {
    global.SharpKit = SharpKit;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
