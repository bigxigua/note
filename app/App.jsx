import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index.js';
import 'antd/dist/antd.css';
import './App.css';
import Index from './page/index/index.js';
class App extends React.Component {
  render() {
    return (
      <Router>
        <Route exact
          path="/"
          component={Index}
        />
      </Router>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
