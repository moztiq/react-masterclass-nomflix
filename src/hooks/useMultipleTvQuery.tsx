import { useQuery } from 'react-query';
import {
  getAiringTodayTv,
  getOnTheAirTv,
  getPopularTv,
  getTopRatedTv,
  IGetTvResult,
} from '../api';

function useMultipleTvQuery() {
  const airingToday = useQuery<IGetTvResult>(
    ['tv', 'airingToday'],
    getAiringTodayTv,
  );
  const onTheAir = useQuery<IGetTvResult>(['tv', 'onTheAir'], getOnTheAirTv);
  const popular = useQuery<IGetTvResult>(['tv', 'popular'], getPopularTv);
  const topRated = useQuery<IGetTvResult>(['tv', 'topRated'], getTopRatedTv);

  return [airingToday, onTheAir, popular, topRated];
}

export default useMultipleTvQuery;
