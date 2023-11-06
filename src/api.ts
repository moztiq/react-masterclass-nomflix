const API_KEY = 'e9b4c98a133b45c6d3e1649c64bc5ca0';
const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  adult: boolean;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  total_pages: number;
  total_results: number;
  results: IMovie[];
}

export interface IGetTvResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  total_pages: number;
  total_results: number;
  results: ITv[];
}

export interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  adult: boolean;
}

export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getAiringTodayTv() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getOnTheAirTv() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getPopularTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json(),
  );
}

export function getTopRatedTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json(),
  );
}

export function getSearchMovie(query: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${query}`,
  ).then((response) => response.json());
}

export function getSearchTv(query: string) {
  return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${query}`).then(
    (response) => response.json(),
  );
}
