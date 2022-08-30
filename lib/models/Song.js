const pool = require('../utils/pool');

module.exports = class Song {
  id;
  title;
  author;
  uri;

  constructor({ id, title, author, uri }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.uri = uri;
  }

  // static async getByTitle(title) {
  //   title = `%${title}%`;
  //   const { rows } = await pool.query(
  //     `SELECT * FROM songs
  //     WHERE title ILIKE $1`,
  //     [title]
  //   );
  //   return rows.map((row) => new Song(row));
  // }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM songs WHERE id=$1', [id]);
    if (!rows[0]) return null;
    return new Song(rows[0]);
  }

  static async insert({ title, author, uri }) {
    const { rows } = await pool.query(
      'INSERT INTO songs (title, author, uri) VALUES ($1, $2, $3) RETURNING *;',
      [title, author, uri]
    );

    return new Song(rows[0]);
  }
};
