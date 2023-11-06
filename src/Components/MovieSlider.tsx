import { AnimatePresence, motion } from 'framer-motion';
import { makeImagePath } from '../utils';
import styled from 'styled-components';
import { useState } from 'react';
import { IGetMoviesResult } from '../api';
import { useHistory } from 'react-router-dom';

const Slider = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 250px;
  top: -120px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  color: white;
  font-size: 24px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)),
    url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: left;
  }
  &:last-child {
    transform-origin: right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: -20px;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const LeftArrow = styled(motion.svg)`
  position: absolute;
  left: 10px;
  font-size: 100px;
  fill: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  z-index: 1;
`;

const RightArrow = styled(motion.svg)`
  position: absolute;
  right: 10px;
  font-size: 100px;
  fill: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  z-index: 1;
`;

const rowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (back: boolean) => ({
    x: back ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -10,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const offset = 6;

interface IData {
  category: string;
  data: IGetMoviesResult | undefined;
}

function MovieSlider({ category = '', data }: IData) {
  const history = useHistory();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setBack(false);
      toggleLeaving();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      setBack(true);
      toggleLeaving();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const movies = data?.results || [];

  const onBoxClicked = (category: string, movieId: number) => {
    history.push(`/movies/${movieId}/${category}`);
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  return (
    <>
      <Slider>
        <LeftArrow
          initial={{ scale: 1, opacity: 0.5 }}
          whileHover={{ scale: 1.2, opacity: 1 }}
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 256 512"
          onClick={decreaseIndex}
        >
          <path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" />
        </LeftArrow>
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={back}
        >
          <Row
            key={index}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: 'tween',
              duration: 1,
            }}
            custom={back}
          >
            {[...movies]
              .slice(index * offset, (index + 1) * offset)
              .map((movie) => (
                <Box
                  variants={boxVariants}
                  whileHover="hover"
                  initial="normal"
                  key={movie.id}
                  bgphoto={makeImagePath(movie.backdrop_path, 'w500')}
                  transition={{ type: 'tween' }}
                  onClick={() => onBoxClicked(category, movie.id)}
                  layoutId={`${category}_${movie.id}`}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <RightArrow
          initial={{ scale: 1, opacity: 0.5 }}
          whileHover={{ scale: 1.2, opacity: 1 }}
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 256 512"
          onClick={increaseIndex}
        >
          <path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" />
        </RightArrow>
      </Slider>
    </>
  );
}

export default MovieSlider;
