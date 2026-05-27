// In-memory ledger — survives server restarts if you swap with a DB
const balances = new Map();   // userId → number (SHRP)
const txLog    = [];          // array of tx objects
const rules    = new Map();   // ruleId → rule object

// Seed demo data
balances.set("user123", 250);
balances.set("alice",   1000);
balances.set("bob",     75);

rules.set("rule_daily_login", {
  id: "rule_daily_login",
  name: "Daily Login",
  event: "daily_login",
  reward: 5,
  createdAt: new Date().toISOString(),
});
rules.set("rule_purchase", {
  id: "rule_purchase",
  name: "First Purchase",
  event: "first_purchase",
  reward: 50,
  createdAt: new Date().toISOString(),
});

function getBalance(userId) {
  return balances.get(userId) ?? 0;
}

function credit(userId, amount) {
  const prev = getBalance(userId);
  balances.set(userId, prev + amount);
  return balances.get(userId);
}

function debit(userId, amount) {
  const prev = getBalance(userId);
  if (prev < amount) throw new Error("Insufficient balance");
  balances.set(userId, prev - amount);
  return balances.get(userId);
}

function addTx(tx) {
  txLog.unshift({ ...tx, timestamp: new Date().toISOString() });
  if (txLog.length > 500) txLog.pop();
}

function getTxLog(limit = 50) {
  return txLog.slice(0, limit);
}

function getAllBalances() {
  return Object.fromEntries(balances);
}

function getRules() {
  return Array.from(rules.values());
}

function addRule(rule) {
  rules.set(rule.id, rule);
}

function deleteRule(id) {
  return rules.delete(id);
}

module.exports = { getBalance, credit, debit, addTx, getTxLog, getAllBalances, getRules, addRule, deleteRule };
