import styled from 'styled-components';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e09, #d0e);
`;

const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow:
    0 2px 3px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.06);
  border-radius: 40px;
`;

function App() {
  const x = useMotionValue(0);

  const rotate = useTransform(x, [-800, 800], [-360, 360]);
  const background = useTransform(
    x,
    [-800, 0, 800],
    [
      'linear-gradient(135deg, #a1c, #1df)',
      'linear-gradient(135deg, #d0e, #e09)',
      'linear-gradient(135deg, #15c, #1c9)',
    ],
  );

  useEffect(() => {
    x.onChange(() => {
      console.log('x', x.get());
    });
  }, [x]);

  return (
    <Wrapper style={{ background }}>
      <Box style={{ x, rotate }} drag="x" dragSnapToOrigin />
    </Wrapper>
  );
}

export default App;
