import styled from 'styled-components';
import {
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion';
import { useEffect, useState } from 'react';

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface IBoxProps {
  xvalue: number;
}

const Box = styled(motion.div)<IBoxProps>`
  width: ${(props) =>
    props.xvalue >= 0 ? 200 - props.xvalue / 5 : 200 - props.xvalue / 5}px;
  height: ${(props) =>
    props.xvalue >= 0 ? 200 - props.xvalue / 5 : 200 - props.xvalue / 5}px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow:
    0 2px 3px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.06);
  border-radius: 40px;
`;

function App() {
  const x = useMotionValue(0);
  const [xvalue, setXValue] = useState(0);

  useMotionValueEvent(x, 'change', (latest) => {
    setXValue((prev) => x.get());
  });

  return (
    <Wrapper>
      <Box style={{ x }} drag="x" dragSnapToOrigin xvalue={xvalue} />
    </Wrapper>
  );
}

export default App;
