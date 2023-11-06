import { useQuery } from 'react-query';
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResult,
} from '../api';

function useMultipleMovieQuery() {
  const nowPlaying = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'],
    getNowPlayingMovies,
  );
  const popular = useQuery<IGetMoviesResult>(
    ['movies', 'popular'],
    getPopularMovies,
  );
  const topRated = useQuery<IGetMoviesResult>(
    ['movies', 'topRated'],
    getTopRatedMovies,
  );
  const upcoming = useQuery<IGetMoviesResult>(
    ['movies', 'upcoming'],
    getUpcomingMovies,
  );

  return [nowPlaying, popular, topRated, upcoming];
}

export default useMultipleMovieQuery;
