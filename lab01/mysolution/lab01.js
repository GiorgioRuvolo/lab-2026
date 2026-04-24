import dayjs from 'dayjs';

function Film(id, title, favorite=false, watchDate=null, rating=null, userId) {
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    this.watchDate = watchDate ? dayjs(watchDate) : null;
    this.rating = rating;
    this.userId = userId;
}

function FilmLibrary() {
    this.films = []; 
    this.addFilm = function(film) {
        if (!this.films.some(f => f.id === film.id)) {
            this.films.push(film);
        }
    };

    this.deleteFilm = function(id) {
        this.films = this.films.filter(film => film.id !== id);
    };

    this.updateRating = function(id, rating) {
        const film = this.films.find(f => f.id === id);
        if (film) {
            film.rating = rating;
        }
    };
    

    this.sortByDate = () => {
        return this.films.slice().sort((a, b) => {
            if (!a.watchDate) return 1; // null watchDate is considered lower
            if (!b.watchDate) return -1;
            return a.watchDate.diff(b.watchDate);
        });
    };  

    this.sortByRating = () => {
        return this.films.slice().sort((a, b) => {
            if (!a.rating) return 1; // null rating is considered lower
            if (!b.rating) return -1;
            return b.rating - a.rating; // sort in descending order
        });
    };
}


function printFilms(films) { 
    films.forEach(film => console.log(film.toString()));
}

