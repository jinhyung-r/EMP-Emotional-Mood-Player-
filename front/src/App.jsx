import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import SpotifyLogin from './components/login/SpotifyLogin';
import Callback from './components/login/Callback';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={SpotifyLogin} />
        <Route path="/auth/spotify" component={Callback} />
      </Switch>
    </Router>
  );
}

export default App;
