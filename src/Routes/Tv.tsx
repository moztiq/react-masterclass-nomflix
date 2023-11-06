import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useHistory, useRouteMatch } from 'react-router-dom';
import TvSlider from '../Components/TvSlider';
import { useEffect, useState } from 'react';
import { IGetTvResult, ITv } from '../api';
import useMultipleTvQuery from '../hooks/useMultipleTvQuery';

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

const BigTv = styled(motion.div)`
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

const TvCategory = styled.div`
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

function Tv() {
  const history = useHistory();

  const { scrollY } = useScroll();
  const bigTvMatch = useRouteMatch<{ category: string; tvId: string }>(
    '/tv/:tvId/:category',
  );
  const [clickedTv, setClickedTv] = useState<ITv>();

  const [
    { data: airingTodayTv, isLoading: isLoadingAiringToday },
    { data: onTheAirTv, isLoading: isLoadingOnTheAir },
    { data: popularTv, isLoading: isLoadingPopular },
    { data: topRatedTv, isLoading: isLoadingTopRated },
  ] = useMultipleTvQuery();

  const onOverlayClick = () => {
    history.push(`/tv`);
  };

  useEffect(() => {
    if (
      !bigTvMatch?.params.category ||
      isLoadingAiringToday ||
      isLoadingOnTheAir ||
      isLoadingPopular ||
      isLoadingTopRated
    )
      return;

    bigTvMatch?.params.tvId &&
      setClickedTv((prev) => {
        let selectedTvList: IGetTvResult | undefined;
        switch (bigTvMatch?.params.category) {
          case 'airingToday':
            selectedTvList = airingTodayTv;
            break;
          case 'onTheAir':
            selectedTvList = onTheAirTv;
            break;
          case 'popular':
            selectedTvList = popularTv;
            break;
          case 'topRated':
            selectedTvList = topRatedTv;
            break;
        }
        return selectedTvList?.results.find(
          (tv) => tv.id + '' === bigTvMatch.params.tvId,
        );
      });
  }, [
    bigTvMatch?.params.category,
    isLoadingAiringToday,
    isLoadingOnTheAir,
    isLoadingPopular,
    isLoadingTopRated,
  ]);

  return (
    <Wrapper>
      {isLoadingAiringToday &&
      isLoadingOnTheAir &&
      isLoadingPopular &&
      isLoadingTopRated ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(airingTodayTv?.results[0].backdrop_path!)}
          >
            <Title>{airingTodayTv?.results[0].name}</Title>
            <Overview>{airingTodayTv?.results[0].overview}</Overview>
          </Banner>
          <TvCategory>
            <CategoryTitle>Airing Today</CategoryTitle>
            <TvSlider category="airingToday" data={airingTodayTv} />
          </TvCategory>
          <TvCategory>
            <CategoryTitle>On The Air</CategoryTitle>
            <TvSlider category="onTheAir" data={onTheAirTv} />
          </TvCategory>
          <TvCategory>
            <CategoryTitle>Popular</CategoryTitle>
            <TvSlider category="popular" data={popularTv} />
          </TvCategory>
          <TvCategory>
            <CategoryTitle>Top Rated</CategoryTitle>
            <TvSlider category="topRated" data={topRatedTv} />
          </TvCategory>
          <AnimatePresence>
            {bigTvMatch?.isExact && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigTv
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={`${bigTvMatch.params.category}_${bigTvMatch.params.tvId}`}
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
                        <li>First Air Date : {clickedTv.first_air_date}</li>
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
                      </BigInfo>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                    </>
                  )}
                </BigTv>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
