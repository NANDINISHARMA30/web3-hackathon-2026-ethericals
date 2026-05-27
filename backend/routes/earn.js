const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { credit, addTx } = require("../store");

const router = express.Router();

// POST /api/earn
// Body: { userId, amount, reason? }
router.post("/", (req, res) => {
  const { userId, amount, reason = "reward" } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ success: false, error: "userId required" });
  }
  const amt = Number(amount);
  if (!amt || amt <= 0 || !Number.isFinite(amt)) {
    return res.status(400).json({ success: false, error: "Invalid amount" });
  }

  const newBalance = credit(userId, amt);
  const tx = {
    id: uuidv4(),
    type: "earn",
    userId,
    amount: amt,
    reason,
    newBalance,
  };
  addTx(tx);

  return res.json({ success: true, tx });
});

module.exports = router;
