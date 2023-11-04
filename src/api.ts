const API_KEY = 'e9b4c98a133b45c6d3e1649c64bc5ca0';
const BASE_PATH = 'https://api.themoviedb.org/3';

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}
