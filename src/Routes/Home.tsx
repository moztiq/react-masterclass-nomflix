import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useHistory, useRouteMatch } from 'react-router-dom';
import MovieSlider from '../Components/MovieSlider';
import useMultipleMovieQuery from '../hooks/useMultipleMovieQuery';
import { useEffect, useState } from 'react';
import { IGetMoviesResult, IMovie } from '../api';

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 70px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div<{ bgphoto: string }>`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(to top, black, transparent),
    url(${(props) => props.bgphoto});
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  position: relative;
  top: -80px;
  padding: 20px;
`;

const Adult = styled.div`
  width: 30px;
  height: 30px;
  color: black;
  font-size: 20px;
  font-weight: bold;
  border-radius: 50%;
  border: 2px solid red;
  background-color: red;
  display: inline-block;
  padding: 2px;
`;

const BigInfo = styled.ul`
  padding: 20px;
  font-size: 16px;
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
  position: relative;
  li {
    display: flex;
    align-items: center;
    height: 25px;
    span {
      margin-left: 5px;
    }
  }
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 18px;
  top: -80px;
  position: relative;
`;

const MovieCategory = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  position: relative;
  top: -100px;
`;

const CategoryTitle = styled.h1`
  color: ${(props) => props.theme.white.lighter};
  font-size: 30px;
  font-weight: bold;
  margin-left: 10px;
  position: relative;
  top: -120px;
`;

function Home() {
  const history = useHistory();

  const { scrollY } = useScroll();
  const bigMovieMatch = useRouteMatch<{ category: string; movieId: string }>(
    '/movies/:movieId/:category',
  );
  const [clickedMovie, setClickedMovie] = useState<IMovie>();

  const [
    { data: nowPlayingMovies, isLoading: isLoadingNowPlaying },
    { data: popularMovies, isLoading: isLoadingPopular },
    { data: topRatedMovies, isLoading: isLoadingTopRated },
    { data: upcomingMovies, isLoading: isLoadingUpcoming },
  ] = useMultipleMovieQuery();

  const onOverlayClick = () => {
    history.push(`/`);
  };

  useEffect(() => {
    if (
      !bigMovieMatch?.params.category ||
      isLoadingNowPlaying ||
      isLoadingPopular ||
      isLoadingTopRated ||
      isLoadingUpcoming
    )
      return;

    bigMovieMatch?.params.movieId &&
      setClickedMovie((prev) => {
        let selectedMovies: IGetMoviesResult | undefined;
        switch (bigMovieMatch?.params.category) {
          case 'nowPlaying':
            selectedMovies = nowPlayingMovies;
            break;
          case 'popular':
            selectedMovies = popularMovies;
            break;
          case 'topRated':
            selectedMovies = topRatedMovies;
            break;
          case 'upcoming':
            selectedMovies = upcomingMovies;
            break;
        }
        return selectedMovies?.results.find(
          (movie) => movie.id + '' === bigMovieMatch.params.movieId,
        );
      });
  }, [
    bigMovieMatch?.params.category,
    isLoadingNowPlaying,
    isLoadingPopular,
    isLoadingTopRated,
    isLoadingUpcoming,
  ]);

  return (
    <Wrapper>
      {isLoadingNowPlaying &&
      isLoadingPopular &&
      isLoadingTopRated &&
      isLoadingUpcoming ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(nowPlayingMovies?.results[0].backdrop_path!)}
          >
            <Title>{nowPlayingMovies?.results[0].title}</Title>
            <Overview>{nowPlayingMovies?.results[0].overview}</Overview>
          </Banner>
          <MovieCategory>
            <CategoryTitle>Now Playing</CategoryTitle>
            <MovieSlider category="nowPlaying" data={nowPlayingMovies} />
          </MovieCategory>
          <MovieCategory>
            <CategoryTitle>Top Rated</CategoryTitle>
            <MovieSlider category="topRated" data={topRatedMovies} />
          </MovieCategory>
          <MovieCategory>
            <CategoryTitle>Upcoming</CategoryTitle>
            <MovieSlider category="upcoming" data={upcomingMovies} />
          </MovieCategory>
          <MovieCategory>
            <CategoryTitle>Popular</CategoryTitle>
            <MovieSlider category="popular" data={popularMovies} />
          </MovieCategory>
          <AnimatePresence>
            {bigMovieMatch?.isExact && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={`${bigMovieMatch.params.category}_${bigMovieMatch.params.movieId}`}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        bgphoto={makeImagePath(
                          clickedMovie.backdrop_path,
                          'w500',
                        )}
                      />
                      <BigTitle>
                        {clickedMovie.title}{' '}
                        {clickedMovie.adult && <Adult>19</Adult>}
                      </BigTitle>
                      <BigInfo>
                        <li>Release : {clickedMovie.release_date}</li>
                        <li>
                          {Array.from(
                            {
                              length: Math.round(clickedMovie.vote_average / 2),
                            },
                            (_, index) => index + 1,
                          )
                            .map((i) => i + 1)
                            .map((item, idx) => (
                              <svg
                                key={idx}
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 576 512"
                                fill={'#fad865'}
                              >
                                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                              </svg>
                            ))}{' '}
                          <span>({clickedMovie.vote_count})</span>
                        </li>
                      </BigInfo>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
