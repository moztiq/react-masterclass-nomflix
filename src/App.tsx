import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e09, #d0e);
  flex-direction: column;
`;

const Box = styled(motion.div)`
  width: 400px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  box-shadow:
    0 2px 3px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  position: absolute;
  top: 100px;
`;

const box = {
  entry: (back: boolean) => {
    console.log('entry back', back);
    return {
      x: back ? -500 : 500,
      opacity: 0,
    };
  },
  exit: (back: boolean) => {
    console.log('exit back', back);
    return {
      x: back ? 500 : -500,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    };
  },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};
function App() {
  const [visible, setVisible] = useState(1);
  const [back, setBack] = useState(false);

  const prevPlease = () => {
    setBack(true);
    setVisible((prev) => (prev === 1 ? 1 : prev - 1));
  };
  const nextPlease = () => {
    setBack(false);
    setVisible((prev) => (prev === 10 ? 10 : prev + 1));
  };
  console.log('re-rendered');

  return (
    <Wrapper>
      <AnimatePresence custom={back}>
        <Box
          key={visible}
          variants={box}
          initial="entry"
          animate="center"
          exit="exit"
        >
          {visible}
        </Box>
      </AnimatePresence>
      <button onClick={prevPlease}>prev</button>
      <button onClick={nextPlease}>next</button>
    </Wrapper>
  );
}

export default App;
