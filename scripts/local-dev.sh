#!/usr/bin/env bash
# Start full local v-alpha stack: MongoDB + entity store + web UI.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MONGO_STORE="$ROOT/mongodb-entity-store"
WEB="$ROOT/web-interface"
PID_DIR="$ROOT/.local-dev"
mkdir -p "$PID_DIR"

log() { echo "[local-dev] $*"; }

ensure_mongodb() {
  if command -v mongod >/dev/null 2>&1; then
    if ! pgrep -x mongod >/dev/null 2>&1; then
      log "Starting MongoDB (mongod)..."
      if command -v brew >/dev/null 2>&1 && brew services list 2>/dev/null | grep -q mongodb; then
        brew services start mongodb-community@7.0 2>/dev/null \
          || brew services start mongodb-community 2>/dev/null \
          || mongod --config "$(brew --prefix)/etc/mongod.conf" --fork 2>/dev/null \
          || true
      else
        mongod --dbpath "$PID_DIR/mongo-data" --fork --logpath "$PID_DIR/mongod.log" 2>/dev/null || true
        mkdir -p "$PID_DIR/mongo-data"
        mongod --dbpath "$PID_DIR/mongo-data" --fork --logpath "$PID_DIR/mongod.log" || {
          log "Install MongoDB: brew tap mongodb/brew && brew install mongodb-community@7"
          exit 1
        }
      fi
      sleep 2
    fi
    return
  fi

  log "MongoDB not installed. Installing via Homebrew..."
  brew tap mongodb/brew
  brew install mongodb-community@7.0
  brew services start mongodb-community@7.0
  sleep 3
}

sync_socket_io_client() {
  local src="$MONGO_STORE/node_modules/socket.io-client/dist/socket.io.js"
  local dest="$WEB/app/vcore/dependencies/secondary/socket.io.min.js"
  if [[ -f "$src" ]]; then
    cp "$src" "$dest"
  fi
}

start_entity_store() {
  if lsof -i :6022 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log "Entity store already on port 6022"
    sync_socket_io_client
    return
  fi
  log "Starting MongoDB entity store on :6022..."
  cd "$MONGO_STORE"
  npm install --silent 2>/dev/null || npm install
  sync_socket_io_client
  nohup node server-local.js > "$PID_DIR/entity-store.log" 2>&1 &
  echo $! > "$PID_DIR/entity-store.pid"
  sleep 2
  if ! lsof -i :6022 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log "Entity store failed. See $PID_DIR/entity-store.log"
    tail -20 "$PID_DIR/entity-store.log" || true
    exit 1
  fi
  log "Seeding dev plot + user (if needed)..."
  ( cd "$MONGO_STORE" && node seed-dev-plot.js ) >> "$PID_DIR/seed.log" 2>&1 || true
}

ensure_v_key() {
  local key="$WEB/app/vcore/src/v/v-key.js"
  local example="$WEB/app/vcore/src/v/v-key-example.js"
  if [[ ! -f "$key" && -f "$example" ]]; then
    cp "$example" "$key"
    log "Created v-key.js from v-key-example.js (API keys optional for soil calc)"
  fi
}

start_web() {
  if lsof -i :4021 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log "Web UI already on http://localhost:4021"
    ensure_v_key
    return
  fi
  ensure_v_key
  log "Starting web UI on http://localhost:4021..."
  cd "$WEB"
  npm install --silent 2>/dev/null || npm install
  nohup node server-hosts.js > "$PID_DIR/web.log" 2>&1 &
  echo $! > "$PID_DIR/web.pid"
  sleep 1
}

stop_all() {
  log "Stopping local dev processes..."
  for f in entity-store web; do
    if [[ -f "$PID_DIR/$f.pid" ]]; then
      kill "$(cat "$PID_DIR/$f.pid")" 2>/dev/null || true
      rm -f "$PID_DIR/$f.pid"
    fi
  done
}

case "${1:-start}" in
  start)
    ensure_mongodb
    start_entity_store
    start_web
    log ""
    log "Ready:"
    log "  App:          http://localhost:4021"
    log "  Entity API:   socket http://localhost:6022 (MongoDB)"
    log ""
    log "1. Click Join → create account (save your key)"
    log "2. Use + to add a Plot, or open Farms → Plots"
    log "3. Plot profile opens automatically (devSeedPlot), or go to Farms → Plots"
    log "   Dev login key: dev-soil-tester-key (see mongodb-entity-store/seed-dev-plot.js)"
    log ""
    log "Stop:  $0 stop"
    log "Logs:  tail -f $PID_DIR/*.log"
    ;;
  stop)
    stop_all
    ;;
  status)
    lsof -i :4021 -sTCP:LISTEN 2>/dev/null && log "Web: up" || log "Web: down"
    lsof -i :6022 -sTCP:LISTEN 2>/dev/null && log "Entity store: up" || log "Entity store: down"
    pgrep -x mongod >/dev/null && log "MongoDB: up" || log "MongoDB: down"
    ;;
  *)
    echo "Usage: $0 [start|stop|status]"
    exit 1
    ;;
esac
