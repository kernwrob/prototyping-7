import { MongoClient, ObjectId } from 'mongodb';
import { DB_URI } from '$app/env/private';

// Only import this module from server files, never from a Svelte component.
const client = new MongoClient(DB_URI);

async function moviesCollection() {
  // Reuse MongoClient's connection pool; connect only when data is requested.
  await client.connect();
  return client.db('ScreenStackDB').collection('movies');
}

/**
 * Convert ObjectId into a string before passing a movie to Svelte.
 * @param {import('mongodb').WithId<import('mongodb').Document>} movie
 * @returns {import('./types.js').Movie}
 */
function serializeMovie(movie) {
  return {
    _id: movie._id.toString(),
    title: String(movie.title ?? ''),
    year: Number(movie.year),
    length: String(movie.length ?? ''),
    actors: Array.isArray(movie.actors) ? movie.actors.map(String) : [],
    poster: String(movie.poster || '/images/placeholder.jpg'),
    watchlist: Boolean(movie.watchlist),
    genre: typeof movie.genre === 'string' ? movie.genre : '',
    description: typeof movie.description === 'string' ? movie.description : ''
  };
}

async function getMovies() {
  const collection = await moviesCollection();
  const movies = await collection.find({}).sort({ _id: 1 }).toArray();
  return movies.map(serializeMovie);
}

/** @param {string} id */
async function getMovie(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = await moviesCollection();
  const movie = await collection.findOne({ _id: new ObjectId(id) });
  return movie ? serializeMovie(movie) : null;
}

/** @param {{ title: string, year: number, length: string, poster?: string }} movie */
async function createMovie(movie) {
  const collection = await moviesCollection();
  const result = await collection.insertOne({
    ...movie,
    poster: movie.poster || '/images/placeholder.jpg',
    actors: [],
    watchlist: false
  });
  return result.insertedId.toString();
}

/** @param {import('./types.js').Movie} movie */
async function updateMovie(movie) {
  if (!ObjectId.isValid(movie._id)) return null;
  const { _id, ...fields } = movie;
  const collection = await moviesCollection();
  const result = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
  return result.matchedCount === 1 ? _id : null;
}

/** @param {string} id */
async function deleteMovie(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = await moviesCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1 ? id : null;
}

export default { getMovies, getMovie, createMovie, updateMovie, deleteMovie };
