const pool = require('../utils/pool');

module.exports = class Playlist{
  id;
  name;

  constructor({ id, name, songs = [] }) {
    this.id = id;
    this.name = name;
    this.songs = songs;
  }

  static async insert(name) {
    const { rows } = await pool.query('INSERT into playlists (name) VALUES ($1) returning *;', [name]);
    
    return new Playlist(rows[0]);
  }

  static async delete(name) {
    const { rows } = await pool.query('DELETE from playlists WHERE name = $1 returning *;', [name]);

    return new Playlist(rows[0]);
  }
};
