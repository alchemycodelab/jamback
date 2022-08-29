-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS playlists_songs, playlists, songs, search_results  CASCADE;

CREATE TABLE playlists (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE songs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR NOT NULL,
  author VARCHAR NOT NULL,
  uri VARCHAR NOT NULL
);

CREATE TABLE playlists_songs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    playlist_id BIGINT,
    song_id BIGINT,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE
);

CREATE TABLE search_results (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR NOT NULL,
  author VARCHAR NOT NULL,
  uri VARCHAR NOT NULL
);

INSERT INTO playlists (name) VALUES
('Sunshine Mix'), 
('Rainy Mix');

INSERT INTO songs (title, author, uri) VALUES
('Good Times', 'Jungle', ''),
('Oooh Child', 'The Five Stairsteps', ''),
('Monday Morning', 'Death Cab For Cutie', ''),
('Esmerelda', 'Ben Howard', ''),
('Naked As We Came', 'Iron & Wine', ''),
('Little Lights', 'Punch Brothers','');

INSERT INTO playlists_songs (playlist_id, song_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(2, 6);