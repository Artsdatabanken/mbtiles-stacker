const log = require("log-less-fancy")();
const Database = require("better-sqlite3");
const fs = require("fs");

const dbrow = (zoom, row) => (Math.pow(2, zoom) - 1 - row).toString();

class Mbtiles {
  constructor(dbPath, options = {}) {
    if (options.createNew) if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

    const exists = fs.existsSync(dbPath);
    this.db = new Database(dbPath, {
      /*verbose: console.log*/
    });
    if (!exists) createSchema(this.db);
  }

  close() {
    this.db.close();
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
    const dbRow = dbrow(zoom, row);
    const record = this.getCommand().get(zoom, column, dbRow);
    if (record) log.info(`Found ${this.db.name}/${zoom},${column},${dbRow}`);
    return record && new Buffer(record.tile_data);
  }

  async writeTile(tileCoord, arrayBuffer) {
    const zoom = tileCoord.z;
    const row = tileCoord.y;
    const column = tileCoord.x;
    const dbRow = dbrow(zoom, row);
    const buffer = arrayBuffer;
    try {
      this.putCommand().run(zoom, column, dbRow, buffer);
    } catch (e) {
      console.error(`/${zoom}/${column}/${dbRow}: ${e}`);
    }
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
