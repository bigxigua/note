import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import UserState from './context/user/userState.js';
// import 'antd/dist/antd.css';
import './App.css';
import './public/css/anima.css';
import Index from './page/index/index.js';
class App extends React.Component {
  render() {
    return (
      <UserState>
        <Router>
          <Route exact
            path="/"
            component={Index}
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
