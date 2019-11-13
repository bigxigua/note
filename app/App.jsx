import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import UserState from './context/user/userState.js';
import './App.css';
import './public/css/anima.css';
import Index from './page/index/index.js';
import Article from './page/article/index.js';
import Editor from './page/editor/editor.js';
class App extends React.Component {
  render() {
    return (
      <UserState>
        <Router>
          <Route exact
            path="/"
            component={Index}
          />
          <Route exact
            path="/article/:id"
            component={Article}
          />
          <Route exact
            path="/editor/:id"
            component={Editor}
          />
        </Router>
      </UserState>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
