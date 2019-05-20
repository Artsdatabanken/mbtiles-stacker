const Jimp = require("jimp");
const log = require("log-less-fancy")();
const Database = require("better-sqlite3");
const fs = require("fs");

class Mbtiles {
  constructor(dbPath, options = {}) {
    if (options.createNew) if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

    const exists = fs.existsSync(dbPath);
    this.db = new Database(dbPath, {});
    if (!exists) createSchema(this.db);
  }

  getCommand() {
    if (this.getcmd) return this.getcmd;
    this.getcmd = this.db.prepare(
      "SELECT tile_data from tiles WHERE zoom_level=? AND tile_column=? AND tile_row=?"
    );
    return this.getcmd;
  }

  putCommand() {
    if (this.putcmd) return this.putcmd;
    this.putcmd = this.db.prepare("INSERT INTO tiles VALUES (?,?,?,?)");
    return this.putcmd;
  }

  getTile(tileCoord) {
    const zoom = tileCoord.z;
    const row = tileCoord.y;
    const column = tileCoord.x;
    let dbRow = Math.pow(2, zoom) - 1 - row;
    log.info(`Read tile ${zoom},${column},${dbRow}`);
    const record = this.getCommand().get(zoom, column, dbRow);
    return record.tile_data;
  }

  async writeTile(tileCoord, png) {
    const row = (2 << (tileCoord.z - 1)) - 1 - tileCoord.y;
    const buffer = await png.getBufferAsync(Jimp.MIME_PNG);
    this.putCommand().run(tileCoord.z, tileCoord.x, row, buffer);
  }

  writeMetadata(meta) {
    const merged = Object.assign({}, defaultMetadata, meta);
    Object.entries(merged).forEach(([name, value]) =>
      writeMeta(this.db, name, value)
    );
  }

  close() {
    this.db.close();
  }
}

const defaultMetadata = {
  name: "palette indexed map",
  description:
    "created by https://github.com/Artsdatabanken/rasterize-mbtiles-from-geojson",
  version: 2,
  minzoom: 0,
  maxzoom: 20,
  center: "0,0",
  bounds: "-180,-90,180,90",
  type: "overlay",
  format: "png",
  json: "{}"
};

function writeMeta(db, name, value) {
  db.exec(`INSERT INTO metadata VALUES("${name}", "${value}")`);
}

function createSchema(db) {
  db.exec("CREATE TABLE metadata (name text, value text)");
  db.exec(
    "CREATE TABLE tiles (zoom_level integer, tile_column integer, tile_row integer, tile_data blob)"
  );
  db.exec("CREATE UNIQUE INDEX name on metadata (name)");
  db.exec(
    "CREATE UNIQUE INDEX tile_index on tiles (zoom_level, tile_column, tile_row)"
  );
}

module.exports = Mbtiles;
