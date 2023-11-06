import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import {
  getSearchMovie,
  getSearchTv,
  IGetMoviesResult,
  IGetTvResult,
} from '../api';
import SearchTvSlider from '../Components/SearchTvSlider';
import SearchMovieSlider from '../Components/SearchMovieSlider';
import { useEffect } from 'react';

const Wrapper = styled.div`
  background-color: black;
  padding-top: 300px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Keyword = styled.div`
  height: 200px;
  font-size: 80px;
  font-weight: bold;
  background-color: white;
  opacity: 0.8;
  color: black;
  position: relative;
  top: -180px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
`;

const CategoryTitle = styled.h1`
  color: ${(props) => props.theme.white.lighter};
  font-size: 30px;
  font-weight: bold;
  margin-left: 10px;
  position: relative;
  top: -120px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigContainer = styled(motion.div)`
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
  overflow-y: scroll;
  height: 220px;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword');

  const history = useHistory();

  const { scrollY } = useScroll();

  const {
    data: movieData,
    isLoading: isLoadingMovie,
    refetch: refetchMovie,
  } = useQuery<IGetMoviesResult>(['search', 'movie'], () =>
    getSearchMovie(keyword!),
  );
  const {
    data: tvData,
    isLoading: isLoadingTv,
    refetch: refetchTv,
  } = useQuery<IGetTvResult>(['search', 'tv'], () => getSearchTv(keyword!));

  const bigMatch = useRouteMatch<{ category: string; id: string }>(
    '/search/:id/:category',
  );
  const clickedMovie =
    bigMatch?.params.category === 'movie' &&
    bigMatch?.params.id &&
    movieData?.results.find((movie) => movie.id + '' === bigMatch.params.id);

  const clickedTv =
    bigMatch?.params.category === 'tv' &&
    bigMatch?.params.id &&
    tvData?.results.find((tv) => tv.id + '' === bigMatch.params.id);

  const onOverlayClick = () => {
    history.push(`/search?keyword=${keyword}`);
  };

  useEffect(() => {
    if (!keyword) return;
    refetchMovie();
    refetchTv();
  }, [keyword]);

  return (
    <Wrapper>
      {isLoadingMovie && isLoadingTv ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {keyword && (
            <Keyword>
              <span>{keyword}</span>
            </Keyword>
          )}
          {movieData?.total_results! > 0 && (
            <Category>
              <CategoryTitle>Movies</CategoryTitle>
              <SearchMovieSlider data={movieData} category="movie" />
            </Category>
          )}
          {tvData?.total_results! > 0 && (
            <Category>
              <CategoryTitle>Tv Series</CategoryTitle>
              <SearchTvSlider data={tvData} category="tv" />
            </Category>
          )}
          <AnimatePresence>
            {clickedMovie && bigMatch?.isExact && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigContainer
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={`${bigMatch.params.category}_${bigMatch.params.id}`}
                >
                  <BigCover
                    bgphoto={makeImagePath(clickedMovie.backdrop_path, 'w500')}
                  />
                  <BigTitle>
                    {clickedMovie.title}{' '}
                    {clickedMovie.adult && <Adult>19</Adult>}
                  </BigTitle>
                  <BigInfo>
                    {clickedMovie.release_date && (
                      <li>Release : {clickedMovie.release_date}</li>
                    )}
                    {clickedMovie.vote_average > 0 && (
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
                    )}
                  </BigInfo>
                  {clickedMovie.overview && (
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                  )}
                </BigContainer>
              </>
            )}
            {clickedTv && bigMatch?.isExact && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigContainer
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={`${bigMatch.params.category}_${bigMatch.params.id}`}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        bgphoto={makeImagePath(clickedTv.backdrop_path, 'w500')}
                      />
                      <BigTitle>
                        {clickedTv.name} {clickedTv.adult && <Adult>19</Adult>}
                      </BigTitle>
                      <BigInfo>
                        {clickedTv.first_air_date && (
                          <li>First Air Date : {clickedTv.first_air_date}</li>
                        )}
                        {clickedTv.vote_average > 0 && (
                          <li>
                            {Array.from(
                              {
                                length: Math.round(clickedTv.vote_average / 2),
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
                            <span>({clickedTv.vote_count})</span>
                          </li>
                        )}
                      </BigInfo>
                      {clickedTv.overview && (
                        <BigOverview>{clickedTv.overview}</BigOverview>
                      )}
                    </>
                  )}
                </BigContainer>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
