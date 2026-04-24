import dayjs from 'dayjs';

export default function Film(id, title, isFavorite = false, watchDate = null, rating = null, userId = 1) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    this.watchDate = watchDate && dayjs(watchDate);
    this.userId = userId;

    this.toJSON = () => {
        return {
            ...this,
            watchDate: this.watchDate ? this.watchDate.format("YYYY-MM-DD") : null,
        };
    };
}