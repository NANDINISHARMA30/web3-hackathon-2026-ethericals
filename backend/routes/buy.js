const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { credit, addTx } = require("../store");

const router = express.Router();

// POST /api/buy/mock  — simulated fiat (Razorpay mock)
// Body: { userId, amount, currency?, paymentMethod? }
router.post("/mock", (req, res) => {
  const { userId, amount, currency = "INR", paymentMethod = "card" } = req.body;

  if (!userId || !amount || Number(amount) <= 0) {
    return res.status(400).json({ success: false, error: "userId and amount required" });
  }

  const shrpAmount = Math.floor(Number(amount)); // 1 INR = 1 SHRP for demo
  // Simulate 500ms payment gateway delay
  setTimeout(() => {
    const newBalance = credit(userId, shrpAmount);
    const tx = {
      id: uuidv4(),
      type: "buy_fiat",
      userId,
      amount: shrpAmount,
      fiatAmount: Number(amount),
      currency,
      paymentMethod,
      mockPaymentId: "pay_mock_" + uuidv4().split("-")[0],
      newBalance,
    };
    addTx(tx);
    res.json({ success: true, tx });
  }, 500);
});

// POST /api/buy/verify-crypto  — called after MetaMask tx to credit off-chain ledger
// Body: { userId, txHash, amount }
router.post("/verify-crypto", async (req, res) => {
  const { userId, txHash, amount } = req.body;

  if (!userId || !txHash || !amount) {
    return res.status(400).json({ success: false, error: "userId, txHash, amount required" });
  }

  // In production: verify txHash on-chain via ethers provider
  // For demo: trust the client-submitted amount after hash format check
  if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
    return res.status(400).json({ success: false, error: "Invalid txHash format" });
  }

  const shrpAmount = Number(amount);
  const newBalance = credit(userId, shrpAmount);
  const tx = {
    id: uuidv4(),
    type: "buy_crypto",
    userId,
    amount: shrpAmount,
    txHash,
    network: "sepolia",
    newBalance,
  };
  addTx(tx);

  res.json({ success: true, tx });
});

module.exports = router;
