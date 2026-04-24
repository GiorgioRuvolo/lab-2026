import sqlite3 from 'sqlite3';
import Film from './Film.js';

function mapRowsToFilms(rows) {
    return rows.map(row => new Film(row.id, row.title, row.isFavorite === 1, row.watchDate, row.rating, row.userId));
}

export default function FilmLibrary() {
    const db = new sqlite3.Database('films.db', (err) => {
        if (err) throw err;
    });

    this.closeDB = () => {
        try {
            db.close();
        } catch (err) {
            console.error('Error closing database:', err);
        }
    };

    this.getAll = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films';
            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mapRowsToFilms(rows));
                }
            });
        });
    };

    this.getFavorites = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE isFavorite = 1';
            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mapRowsToFilms(rows));
                }
            });
        });
    };

    this.getWatchedBefore = (watchDate) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE watchDate < ?';
            db.all(query, [watchDate.format('YYYY-MM-DD')], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mapRowsToFilms(rows));
                }
            });
        });
    };

    this.getContainingString = (substring) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE title LIKE ?';
            db.all(query, [`%${substring}%`], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mapRowsToFilms(rows));
                }
            });
        });
    };

    this.deleteFilm = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM films WHERE id = ?';
            db.run(query, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    };

    this.addFilm = (film) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO films (title, isFavorite, watchDate, rating, userId) VALUES (?, ?, ?, ?, ?)';
            const watchDate = film.watchDate ? film.watchDate.format('YYYY-MM-DD') : null;

            let rating = null;
            if (film.rating && film.rating >= 1 && film.rating <= 5) {
                rating = film.rating;
            }

            db.run(query, [film.title, film.favorite, watchDate, rating, film.userId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    film.id = this.lastID;
                    resolve(film);
                }
            });
        });
    };

    this.resetWatchDates = () => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE films SET watchDate = NULL';
            db.run(query, [], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };
}


