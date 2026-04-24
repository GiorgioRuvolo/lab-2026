import dayjs from 'dayjs';
import db from './db.js';
import Film from './Film.js';  

const filters = {
    'filter-favorite': {label: 'Favorites', filterFunction: film => film.favorite},
    'filter-best': {label: 'Best Rated', filterFunction: film => film.rating >= 5},
    'filter-lastmonth': {label: 'Seen Last Month', filterFunction: film => isSeenLastMonth(film)},
    'filter-unseen': {label: 'Unseen', filterFunction: film => !film.watchDate}
};

const isSeenLastMonth = (film) => {
    if ('watchDate' in film && film.watchDate) {  // Accessing watchDate only if defined
        const diff = film.watchDate.diff(dayjs(), 'month');
        const isLastMonth = diff <= 0 && diff > -1;      // last month
        return isLastMonth;
    }
};

function mapRowsToFilms(rows) {
    // Note: the parameters must follow the same order specified in the constructor.
    return rows.map(row => new Film(row.id, row.title, row.isFavorite === 1, row.watchDate, row.rating, row.userId));
}

// NOTE: all functions return error messages as json object { error: <string> }
export default function FilmDao() {
    // This function retrieves the whole list of films from the database.
    this.getFilms = (filter) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films';
            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const films = mapRowsToFilms(rows);
                    if (filter && filters[filter]) {
                        films = films.filter(filters[filter].filterFunction);
                    }
                    resolve(films);
                }
            });
        });
    };

    // This function retrieves a film given its id and the associated user id.
    this.getFilm = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE id=?';
            db.get(query, [id], (err, row) => {
                if (err) { 
                    reject(err);
                } else if (row === undefined) {
                    resolve({error: 'Film not found.'});
                } else {
                    resolve(new Film(row.id, row.title, row.isFavorite === 1, row.watchDate, row.rating, row.userId));
                }  
            });
        });
    };

    // This function adds a new film to the database.
    this.addFilm = (film) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO films (title, isFavorite, watchDate, rating, userId) VALUES (?, ?, ?, ?, ?)';
            db.run(query, [film.title, film.favorite ? 1 : 0, film.watchDate, film.rating, film.userId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({id: this.lastID});
                }
            });
        });
    };

    // This function updates the film with the given id.
    this.updateFilm = (id, film) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE films SET title=?, isFavorite=?, watchDate=?, rating=?, userId=? WHERE id=?';
            db.run(query, [film.title, film.favorite ? 1 : 0, film.watchDate, film.rating, film.userId, id], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    resolve({error: 'Film not found.'});
                }   else {
                    resolve({message: 'Film updated successfully.'});
                }   
            });
        }); 
    };

    // This function deletes the film with the given id.
    this.deleteFilm = (id) => {
        return new Promise((resolve, reject) => {   
            const query = 'DELETE FROM films WHERE id=?';
            db.run(query, [id], function(err) {
                if (err) {  
                    reject(err);
                } else if (this.changes === 0) {
                    resolve({error: 'Film not found.'});
                } else {
                    resolve({message: 'Film deleted successfully.'});
                }  
            });
        }); 
    };
}