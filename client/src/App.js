import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';

import Chat from './components/Chat';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Register} />
      <Route exact path="/chat" component={Chat} />
    </Router>
  );
}

export default App;
