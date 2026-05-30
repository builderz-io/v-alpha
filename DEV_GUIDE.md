# Local Dev Environment Guide

A practical, start-to-finish guide for running `v-alpha` locally. By the end you'll
have the full stack running at **http://localhost:4021** with seeded test data and
no cloud dependencies.

> For alternate backends (Firebase emulator, hosted dev/staging), see
> [`web-interface/LOCAL_DEV.md`](web-interface/LOCAL_DEV.md). This guide covers the
> **fully-local MongoDB stack**, which is the default for the `localhost-4021` host.

---

## 1. What you're running

The app is **three separate processes**. The helper script starts all of them for you.

| Process | What it does | Port |
|---------|--------------|------|
| **MongoDB** (`mongod`) | Stores all entities (people, plots, groups, …) | `27017` |
| **Entity store** (`mongodb-entity-store/server-local.js`) | Socket.IO API the web app talks to | `6022` |
| **Web UI** (`web-interface/server-hosts.js`) | Serves the static frontend (HTML/JS/CSS) | `4021` |

The host config `web-interface/hosts/localhost-4021/app-localhost-4021.html` wires the
frontend to the local stack:

- `entityLedger: 'MongoDB'` + `mongodbEndpoint: 'local'` → data lives in your local MongoDB
- `devMode: true` → dev conveniences (auto-fill, verbose logging)
- `devSeedPlot: true` → a demo Person + Plot are seeded and auto-opened on first load

---

## 2. Prerequisites

- **Node.js** (LTS, v18+) and **npm**
- **Git**
- **MongoDB** — on macOS the script installs it via [Homebrew](https://brew.sh/) automatically on first run.
  On Linux, install MongoDB yourself (e.g. `mongodb-community`) and make sure `mongod` is on your `PATH`.

No cloud accounts or credentials are required for the local stack. **Google Places** is optional: the default `v-key.js` placeholder skips the Maps script. When creating a group/plot, the location step shows **continent radios** automatically. Pick a continent (e.g. Europe) or type a place name like `Amsterdam` and tap **Weiter** — coordinates are filled in without Google. To use address autocomplete, add a real `googlePlaces` key in `web-interface/app/vcore/src/v/v-key.js`.

---

## 3. One-command start (recommended)

From the repo root:

```bash
chmod +x scripts/local-dev.sh   # first time only
./scripts/local-dev.sh start
```

This single command:

1. Ensures **MongoDB** is running (installs/starts it via Homebrew on macOS if needed).
2. Starts the **entity store** on `:6022` (runs `npm install` the first time).
3. Syncs the matching **Socket.IO v2** client into the web app (version must match the server).
4. **Seeds** the demo Person + Plot (idempotent — safe to re-run).
5. Creates `web-interface/app/vcore/src/v/v-key.js` from the example if missing.
6. Starts the **web UI** on `:4021`.

When it finishes, open **http://localhost:4021**.

### Manage the stack

```bash
./scripts/local-dev.sh status   # are web / entity store / mongo up?
./scripts/local-dev.sh stop     # stop web + entity store (leaves mongod running)
```

Logs are written to `.local-dev/*.log` (gitignored). Tail them while debugging:

```bash
tail -f .local-dev/web.log .local-dev/entity-store.log .local-dev/seed.log
```

---

## 4. Seeded dev account

With `devSeedPlot: true`, the app auto-loads the demo plot on open — **no sign-in needed**
to explore. To sign in as the dev user (e.g. to create groups or more plots), use the access key.

| Item | Value |
|------|-------|
| Person | `Dev Tester #1001` |
| Plot | `Demo Field #2121` (2 crop seasons) |
| Access key | `dev-soil-tester-key` |

Re-seed at any time (wipes and recreates just these two entities):

```bash
cd mongodb-entity-store
node seed-dev-plot.js
```

---

## 5. Everyday tasks

**Create your own account:** click **Join** → fill the form → **save the generated key**
(there's no password reset locally).

**Add a Plot:** use the **+** button, or open **Farms → Plots**. Open a plot's profile for
the soil calculator.

**Create a network/community Group:** open **Groups** (`/groups`) → **Add new group**.
Groups are first-class entities (role `Group`, compact code `aq`); membership is stored
on the group in `servicefields.s30`. On a **group profile** you hold, use the **Members**
card to add or remove entities from your account (plots, farms, etc.).

**Deep-link `/groups`:** works after app load (route is registered in `v-route.js`).
With `devSeedPlot`, dev bootstrap also opens `/groups` when you land on that URL.

**Reset everything:** stop the stack, drop the local DB, then re-seed:

```bash
./scripts/local-dev.sh stop
mongosh v-alpha-local --eval "db.dropDatabase()"
./scripts/local-dev.sh start   # re-seeds automatically
```

---

## 6. Editing code

The web UI serves files **straight from `web-interface/app/`** — there is **no build step**
(`useBuilds: false`). Just edit a file and **reload the browser**.

- Frontend source: `web-interface/app/` (plugins in `app/plugins/src/`, core in `app/vcore/`, theme in `app/theme/`)
- Entity store source: `mongodb-entity-store/`
- Lint (web): the repo uses ESLint (`web-interface/.eslintrc.js`) — 2-space indent, single quotes,
  spaces inside parens, trailing commas on multiline.

After changing the **entity store**, restart it so the change takes effect:

```bash
./scripts/local-dev.sh stop && ./scripts/local-dev.sh start
```

---

## 7. Troubleshooting

| Symptom | Likely cause / fix |
|---------|--------------------|
| `./scripts/local-dev.sh status` shows entity store **down** | Check `.local-dev/entity-store.log`. Usually a missing `npm install` in `mongodb-entity-store/` or port `6022` already in use. |
| Web is up but lists are empty / can't log in | Entity store or MongoDB isn't running. Run `status`; check `.local-dev/*.log`. |
| Socket connection errors in DevTools console | Socket.IO client/server version mismatch — re-run `./scripts/local-dev.sh start` (it re-syncs the v2 client). |
| Blank page / scripts 404 | Use `http://localhost:4021` (not `file://`). Confirm `App server ... listening on port 4021` in `.local-dev/web.log`. |
| Demo plot didn't appear | Re-run `node seed-dev-plot.js` in `mongodb-entity-store/`, then reload. |
| `mongod` won't start on macOS | `brew services start mongodb-community` (or `@7.0`). Verify with `pgrep -x mongod`. |
| Port already in use | Find it: `lsof -i :4021` / `lsof -i :6022`, then kill the stale process. |

---

## 8. Quick reference

```bash
# start / stop / status
./scripts/local-dev.sh start
./scripts/local-dev.sh stop
./scripts/local-dev.sh status

# logs
tail -f .local-dev/*.log

# re-seed dev data
cd mongodb-entity-store && node seed-dev-plot.js
```

| URL / value | Meaning |
|-------------|---------|
| http://localhost:4021 | The app |
| `:6022` | Entity store (Socket.IO) |
| `v-alpha-local` | Local MongoDB database name |
| `dev-soil-tester-key` | Dev account access key |
