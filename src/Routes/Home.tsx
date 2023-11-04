import { useQuery } from 'react-query';
import { getMovies } from '../api';

// https://image.tmdb.org/t/p/original/eSsMzJpzAwCa69tm6Wco2il44aJ.jpg

function Home() {
  const { data, isLoading } = useQuery(['movies', 'nowPlaying'], getMovies);
  console.log(data, isLoading);
  return (
    <div
      style={{
        backgroundColor: 'whitesmoke',
        height: '200vh',
        marginTop: '80px',
      }}
    >
      Home
    </div>
  );
}

export default Home;
