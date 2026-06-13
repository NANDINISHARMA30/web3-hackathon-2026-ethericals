const express = require("express");
const { getBalance, getTxLog, getAllBalances, getRules, addRule, deleteRule } = require("../store");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// GET /api/txlog?limit=50
router.get("/txlog/all", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  res.json({ transactions: getTxLog(limit) });
});

// GET /api/balances  — all users (admin)
router.get("/admin/all", (req, res) => {
  res.json({ balances: getAllBalances() });
});

// GET /api/rules
router.get("/rules/all", (req, res) => {
  res.json({ rules: getRules() });
});

// GET /api/balance/:userId  — must come after all specific routes
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  res.json({ userId, balance: getBalance(userId) });
});

// POST /api/rules
router.post("/rules/create", (req, res) => {
  const { name, event, reward } = req.body;
  if (!name || !event || !reward) {
    return res.status(400).json({ error: "name, event, reward required" });
  }
  const rule = { id: "rule_" + uuidv4().split("-")[0], name, event, reward: Number(reward), createdAt: new Date().toISOString() };
  addRule(rule);
  res.json({ success: true, rule });
});

// DELETE /api/rules/:id
router.delete("/rules/:id", (req, res) => {
  const deleted = deleteRule(req.params.id);
  res.json({ success: deleted });
});

module.exports = router;
