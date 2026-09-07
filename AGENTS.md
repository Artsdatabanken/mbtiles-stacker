# AGENTS.md

## Project overview

This repository is a small Node.js service that serves stacked raster tile data from MBTiles sources. It is centered around a Micro HTTP app and a tile pipeline in `src/`.

Primary references:
- [README.md](README.md)
- [index.js](index.js)
- [package.json](package.json)
- [src/mbtiles.js](src/mbtiles.js)
- [src/tilestacker.js](src/tilestacker.js)
- [src/tileproxy.js](src/tileproxy.js)

## Working conventions

- Use Node.js and keep changes compatible with the project’s older runtime expectations (`node >= 10` in [package.json](package.json)).
- Prefer small, direct changes in the existing style rather than introducing new frameworks or large abstractions.
- The app is a server-side tile service, not a frontend app. Most logic is in plain JavaScript modules under `src/`.
- Keep API compatibility in mind when changing request routing or tile output behavior.

## Runtime and entry points

- The app entry point is [index.js](index.js). It looks for a data directory at `./data` or `/data` and loads `config.json` from that folder.
- `npm run start` launches the service via `micro`.
- The app redirects requests to Swagger UI unless they are under the `v1` route, and it sets CORS headers on each response.

## Important project-specific behavior

- The service expects one or more MBTiles files under the runtime data directory and uses a dynamic layer configuration loaded from `config.json`.
- Tile row storage in [src/mbtiles.js](src/mbtiles.js) is not a straight `y` lookup: it converts the DB row with `2^z - 1 - row` because MBTiles stores rows in TMS order.
- Any change to tile retrieval or stacking logic should account for `z/x/y` coordinate conversion and MBTiles row inversion.
- The tile stack logic is built around the layer config and the `tileproxy` abstraction; keep those boundaries in mind when modifying data flow.

## Validation and verification

- There is no dedicated `test` script in [package.json](package.json), so verification is typically via project-specific runtime checks or targeted manual validation.
- Before claiming a fix, validate the behavior with the smallest relevant command or request path. If a change impacts serving or stack logic, prefer a focused runtime check over broad repo-wide assumptions.
- Keep changes narrow and easy to reason about; this project is compact but behavior-sensitive.

## Safe edit guidance

- Do not rename or repurpose config keys without checking how `config.json` is used by the server and tile pipeline.
- If a change affects the HTTP routes or CORS headers, inspect [index.js](index.js) before editing.
- If a change affects SQLite MBTiles reads/writes, inspect [src/mbtiles.js](src/mbtiles.js) first because the database schema and row conversion are easy to get wrong.
- If a change affects tile composition or source selection, inspect [src/tilestacker.js](src/tilestacker.js) and [src/tileproxy.js](src/tileproxy.js) together.

## Typical task flow for agents

1. Read the relevant runtime file and the config contract before editing.
2. Keep the fix localized to the tile or routing logic involved.
3. Re-run the smallest relevant validation path.
4. Document any project-specific behavior in code comments only when it is not obvious from existing conventions.

## Related documentation

- [README.md](README.md) for installation and usage.
- [src/swagger.js](src/swagger.js) if working on API documentation or endpoint behavior.
- [Dockerfile](Dockerfile) for container/runtime assumptions.
