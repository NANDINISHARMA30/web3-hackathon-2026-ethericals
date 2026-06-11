# CLAUDE.md — SharpKit Codebase Reference

Read this file at the start of every session. Update it whenever code changes.

---

## Project Identity

**Name:** SharpKit  
**Repo:** `/Users/rahultiwari/Desktop/LABS/projects/web3-hackathon-2026-ethericals`  
**Purpose:** Plug-and-play Sharp Token (SHRP) integration layer — Stripe for a Web3 loyalty token  
**Hackathon:** HackIndia Web3 2026 — Team Ethericals  
**Chain:** Ethereum Sepolia (chainId 11155111)  
**Stack:** Solidity 0.8.24, OpenZeppelin 5.x, Hardhat 2.22, Express 4, Vanilla JS frontend, no frameworks

---

## Directory Map

```
contracts/
  SharpToken.sol           ERC20("Sharp Token","SHRP") + Ownable + mint(to,amount,reason) + burn(amount)

scripts/
  deploy.js                Hardhat deploy → deployments.<network>.json + frontend/SharpToken.json (ABI+address)

backend/
  server.js                Express entry point, port 4000, mounts all routes, rate limiting, serves /sdk static, serves /frontend static
  store.js                 In-memory state: balances Map, txLog array (capped 500), rules Map — NO database
  contract.js              Ethers v6 singleton: getProvider(), getWallet(), getContract() — lazy init, reused across requests
  routes/
    earn.js                POST /api/earn     → credit(userId, amount) + addTx
    spend.js               POST /api/spend    → debit(userId, amount) + addTx, 402 on insufficient
    buy.js                 POST /api/buy/mock → simulated fiat, 500ms delay, credits ledger
                           POST /api/buy/verify-crypto → validates txHash format, credits ledger
    balance.js             GET  /api/balance/:userId
                           GET  /api/balance/txlog/all?limit=N
                           GET  /api/balance/admin/all          (all balances)
                           GET  /api/balance/rules/all
                           POST /api/balance/rules/create
                           DELETE /api/balance/rules/:id

frontend/
  index.html               Single-page dashboard — 7 cards: Earn, Spend, Balance, Buy, Rules, TxLog, SDK Snippet
  style.css                Glassmorphism dark theme, CSS vars, no framework — accent color: #7c3aed (purple)
  app.js                   Vanilla JS — all fetch calls, MetaMask (eth_requestAccounts + eth_sendTransaction), live reload every 15s
  vite-tanstack-config.ts   Local shim for the generated Vite/TanStack config helper used by vite.config.ts

sdk/
  sharpkit.js              UMD module (browser global + CJS + AMD)
                           Methods: init({apiKey,baseUrl}), reward(userId,amount,reason),
                           spend(userId,amount,reason), getBalance(userId),
                           buyWithFiat(userId,amount,paymentMethod), verifyCryptoPurchase(userId,txHash,amount)
                           Served at GET /sdk/sharpkit.js (static from backend)
```

---

## Key Design Decisions

- **No database.** `store.js` is pure in-memory. Data resets on server restart. For production: swap `store.js` functions with MongoDB/Redis calls — interfaces stay identical.
- **API key auth** is middleware in `server.js`. Keys live in `process.env.API_KEYS` (comma-separated). Default: `test_key,demo_key_123`. Header: `x-api-key`.
- **Buy flow:** fiat is fully mocked (no real Razorpay). Crypto uses MetaMask `eth_sendTransaction` on Sepolia, then calls `/api/buy/verify-crypto` to credit off-chain. In production, the backend should verify the txHash via ethers provider before crediting.
- **Contract minting:** `SharpToken.mint()` is `onlyOwner`. Treasury wallet = deployer. For production earn flow, backend should call `contract.mint(userWallet, amount)` using `TREASURY_PRIVATE_KEY`.
- **Pre-seeded data:** `store.js` seeds `user123 (250)`, `alice (1000)`, `bob (75)` and 2 default rules on startup.

---

## Smart Contract

### `contracts/SharpToken.sol`

- `ERC20("Sharp Token", "SHRP")` + `Ownable(msg.sender)` — OZ 5.x
- Constructor: `_mint(treasury, 10_000_000 * 1e18)` — treasury passed as constructor arg
- `mint(address to, uint256 amount, string reason)` — `onlyOwner`, checks MAX_SUPPLY (1B)
- `burn(uint256 amount)` — caller burns own tokens
- Events: `TokensMinted(to, amount, reason)`, `TokensBurned(from, amount)`
- Decimals: 18

---

## Backend Routes — Full Reference

| Method | Path                        | Auth | Body/Params                                   | Returns                        |
| ------ | --------------------------- | ---- | --------------------------------------------- | ------------------------------ |
| GET    | `/api/health`               | None | —                                             | `{status, version}`            |
| POST   | `/api/earn`                 | ✓    | `{userId, amount, reason?}`                   | `{success, tx}`                |
| POST   | `/api/spend`                | ✓    | `{userId, amount, reason?}`                   | `{success, tx}` or 402         |
| GET    | `/api/balance/:userId`      | ✓    | —                                             | `{userId, balance}`            |
| GET    | `/api/balance/txlog/all`    | ✓    | `?limit=N`                                    | `{transactions[]}`             |
| GET    | `/api/balance/admin/all`    | ✓    | —                                             | `{balances: {userId: number}}` |
| GET    | `/api/balance/rules/all`    | ✓    | —                                             | `{rules[]}`                    |
| POST   | `/api/balance/rules/create` | ✓    | `{name, event, reward}`                       | `{success, rule}`              |
| DELETE | `/api/balance/rules/:id`    | ✓    | —                                             | `{success: bool}`              |
| POST   | `/api/buy/mock`             | ✓    | `{userId, amount, currency?, paymentMethod?}` | `{success, tx}`                |
| POST   | `/api/buy/verify-crypto`    | ✓    | `{userId, txHash, amount}`                    | `{success, tx}`                |

---

## Frontend Logic (`frontend/app.js`)

- `apiKey()` — reads `#apiKeyInput` value, falls back to `test_key`
- `doEarn()` / `doSpend()` / `doBalance()` — direct fetch to backend
- `doBuyFiat()` — POST `/api/buy/mock`, 500ms real delay visible in UI
- `doBuyCrypto()` — requests MetaMask accounts → checks chainId = `0xaa36a7` (Sepolia) → `eth_sendTransaction` (sends to self for demo) → POST `/api/buy/verify-crypto`
- `loadTxLog()` — builds `<table>` from `/api/balance/txlog/all`
- `loadStats()` — reads `/api/balance/admin/all` for total users + total SHRP
- `loadRules()` → `createRule()` → `deleteRule()` — full CRUD via balance routes
- `renderSnippet()` — generates SDK code block, updates on API key change
- Auto-refresh: `setInterval` every 15s calls `loadStats()` + `loadTxLog()`

---

## SDK (`sdk/sharpkit.js`)

UMD pattern — works in `<script>` tag (sets `window.SharpKit`), `require()` (CommonJS), or `define()` (AMD).

```js
SharpKit.init({ apiKey: "test_key", baseUrl: "http://localhost:4000" });
SharpKit.reward(userId, amount, reason); // POST /api/earn
SharpKit.spend(userId, amount, reason); // POST /api/spend
SharpKit.getBalance(userId); // GET  /api/balance/:userId
SharpKit.buyWithFiat(userId, amount, method); // POST /api/buy/mock
SharpKit.verifyCryptoPurchase(userId, txHash, amount); // POST /api/buy/verify-crypto
```

Internal: `_post(path, body)` and `_get(path)` share auth headers. Throws on non-ok responses.

---

## npm Scripts

```bash
npm run backend          # node backend/server.js (port 4000)
npm run compile          # hardhat compile
npm run deploy:sepolia   # hardhat run scripts/deploy.js --network sepolia
npm run deploy:local     # hardhat run scripts/deploy.js --network localhost
npm run node             # hardhat node (local chain)
```

---

## Env Variables

| Variable               | Default                 | Used In                                  |
| ---------------------- | ----------------------- | ---------------------------------------- |
| `PORT`                 | `4000`                  | `server.js`                              |
| `API_KEYS`             | `test_key,demo_key_123` | `server.js` auth middleware              |
| `SEPOLIA_RPC_URL`      | —                       | `hardhat.config.js`                      |
| `PRIVATE_KEY`          | —                       | `hardhat.config.js`                      |
| `ETHERSCAN_API_KEY`    | —                       | `hardhat.config.js`                      |
| `SHARP_TOKEN_ADDRESS`  | —                       | Not yet wired (for future on-chain earn) |
| `TREASURY_PRIVATE_KEY` | —                       | Not yet wired (for future on-chain mint) |

---

## Known Gaps / Future Work

| ID     | Priority | Description                                                                                                            |
| ------ | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| ~~F1~~ | ~~MED~~  | ~~Backend should verify Sepolia txHash on-chain~~ — DONE: `buy/verify-crypto` uses `waitForTransaction` + amount check |
| ~~F2~~ | ~~MED~~  | ~~Wire on-chain mint for earn~~ — DONE: fire-and-forget `SharpToken.mint()` after res.json() in earn.js                |
| F3     | MED      | Replace in-memory `store.js` with MongoDB/Redis for persistence                                                        |
| ~~F4~~ | ~~LOW~~  | ~~Add rate limiting~~ — DONE: Map-based limiter in server.js (100/min global, 20/min earn/spend/buy)                   |
| F5     | LOW      | Add JWT or Clerk auth for the dashboard itself                                                                         |
| F6     | LOW      | Webhook retry logic + signature verification                                                                           |

## Bug Fixed

- `.env` had `SHARP_TOKEN_ADDRESS=0xe96Caa87...` (deployer wallet). Corrected to `0x264F12a1d8e671673D2A71198D212482aAFc9dBa` (actual contract).

---

## Deployment Checklist (Sepolia)

1. `cp .env.example .env` — fill `SEPOLIA_RPC_URL`, `PRIVATE_KEY`
2. `npm run compile`
3. `npm run deploy:sepolia` — note deployed address
4. Update `.env`: `SHARP_TOKEN_ADDRESS=0x...`
5. `node backend/server.js`
6. Open `http://localhost:4000`

---

## How to Update This File

After any code change, update the relevant section:

- Added a route → update **Backend Routes** table
- Changed store schema → update **Key Design Decisions**
- New SDK method → update **SDK** section
- New env var → update **Env Variables** table
- Closed a gap → remove from **Known Gaps**
