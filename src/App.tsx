import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Header from './Components/Header';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Switch>
        <Route path={['/tv', '/tv/:tvId/:category']}>
          <Tv />
        </Route>
        <Route path={['/search', '/search/:id/:category']}>
          <Search />
        </Route>
        <Route path={['/', '/movies/:movieId/:category']}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
