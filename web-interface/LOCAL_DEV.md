# Local development (web interface)

## One-command local stack (recommended)

From the repo root (requires [Homebrew](https://brew.sh/) for MongoDB on first run):

```bash
chmod +x scripts/local-dev.sh
./scripts/local-dev.sh start
```

Then open **http://localhost:4021**.

### First-time setup (if the app fails to load scripts)

1. **`v-key.js` missing** — copy `app/vcore/src/v/v-key-example.js` → `v-key.js` (or run `./scripts/local-dev.sh start`, which does this automatically).
2. **Socket connection failed** — the entity store uses Socket.IO **v2**; the browser client must match. `./scripts/local-dev.sh start` copies the v2 client from `mongodb-entity-store/node_modules` into `app/vcore/dependencies/secondary/socket.io.min.js`.

### Soil calculator test data (no join required)

With `devSeedPlot: true` in `hosts/localhost-4021/app-localhost-4021.html` (already set), the app seeds and auto-opens a demo plot:

```bash
cd mongodb-entity-store
node seed-dev-plot.js    # Person "Dev Tester #1001" + Plot "Demo Field #2121" + 2 seasons
```

Reload **http://localhost:4021** — you should land on the demo plot profile with the soil calculator compact card (or use **Open soil calculator**).

| Item | Value |
|------|--------|
| Plot | Demo Field #2121 |
| Person | Dev Tester #1001 |
| Access key | `dev-soil-tester-key` |

Without auto-bootstrap, click **Join** to create an account, use **+** to add a **Plot**, and open its profile for the soil calculator.

```bash
./scripts/local-dev.sh status   # check services
./scripts/local-dev.sh stop     # stop web + entity store
```

The host `localhost-4021` is configured for **MongoDB** on port **6022** (fully local data). Logs: `.local-dev/*.log`.

---

For a full onboarding guide (architecture, seeded account, troubleshooting), see **[`../DEV_GUIDE.md`](../DEV_GUIDE.md)** at the repo root.

With `./scripts/local-dev.sh start`, the `localhost-4021` host uses **MongoDB** locally (`entityLedger: 'MongoDB'`, entity store on **6022**). You do **not** need Firebase or remote APIs for that path.

The sections below describe **alternate** setups if you want remote or emulator backends instead.

---

## Quick start (UI only — remote Firebase data)

```bash
cd web-interface
npm install
npm start
```

Then in the browser:

1. Open http://localhost:4021  
2. **Sign in** (join / wallet / access key — same as on the live network)  
3. Create or open **Plot** entities you hold  
4. Use **Plots** in the farm menu or a plot **profile** for the soil calculator  

If the page loads but lists are empty, you are usually **not signed in** or your account has **no plots** on the humbilka namespace.

---

## Option A — Full local stack (Firebase emulator)

Used by `hosts/localhost-4042` (`namespaceEndpoint: 'firebase-local'`).

**Prerequisites:** Node.js, [Firebase CLI](https://firebase.google.com/docs/cli), Firebase project credentials.

1. Copy credentials (from your team; not in git):

   ```bash
   cp graphql-firebase-entity-store/functions/credentials/credentials-example-file.js \
      graphql-firebase-entity-store/functions/credentials/credentials.js
   ```

   Edit `credentials.js` with real `dbEnvs`, `jwtSignature`, `auth`, and whitelist including `http://localhost:4021`.

2. Install and run the GraphQL function emulator:

   ```bash
   cd graphql-firebase-entity-store/functions
   npm install
   npm run serve
   ```

   API should be at `http://localhost:5001/entity-profile/europe-west1/api/v1` (see `v-config.js` → `firebase-local`).

3. Point your host at the emulator — in `app-localhost-4021.html` (or use port 4042 host):

   ```javascript
   namespaceEndpoint: 'firebase-local',  // resolves via v-config.js
   ```

4. Start the web UI (`npm start` in `web-interface/`) and use http://localhost:4021 or http://localhost:4042.

---

## Option B — Legacy MongoDB stack

Described in the repo root [`INSTALL.md`](../INSTALL.md). Summary:

1. Install and run **MongoDB** (`mongod`).
2. Start the entity store:

   ```bash
   cd mongodb-entity-store
   npm install
   node server-es.js    # default port 6022 in current server-es.js
   ```

3. Change host config to `entityLedger: 'MongoDB'` and `mongodbEndpoint: 'local'`.
4. Add `http://localhost:4021` to the CORS whitelist in `mongodb-entity-store/server-es.js` if needed.

Note: `INSTALL.md` mentions port **6029** and `node server.js`; this repo uses **`server-hosts.js` on 4021** for the UI instead.

---

## Option C — Use hosted dev/staging assets + API

In `app-localhost-4021.html`:

```javascript
sourceEndpoint: 'development',  // or 'staging'
namespaceEndpoint: 'https://us-central1-entity-profile.cloudfunctions.net/api/v1',
```

Reload the page. You still need an account on that environment.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| `Cannot find module 'express'` | Run `npm install` in `web-interface/` |
| Blank page / scripts 404 | Use http://localhost:4021 (not file://). Check terminal for `App server ... listening on port 4021` |
| UI loads, no entities | Not logged in, or `marketContent: 1` (only your held entities). Sign in and create content with **+** |
| GraphQL / network errors in DevTools | Remote API down, wrong `namespaceEndpoint`, or missing Firebase emulator + credentials |
| Soil calculator empty on profile | Open a **Plot** profile (not Farm). Use **Open soil calculator** or add seasons after sign-in |

---

## Farm / soil calculator (this branch)

- Timeline UI: `soilCalcTimeline: true` in host HTML (default on localhost-4021).
- Plot list: `/farms/plots` (needs signed-in user with plots).
- Full editor route: `/plot/<fullId>/calculator`

For agronomy and storage rules, see the farm UX plan in the repo (do not change `s1`–`s31` / `s28` / `s29` without review).
