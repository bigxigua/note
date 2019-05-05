import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index.js';
import 'antd/dist/antd.css'; 
import './App.css';
import Index from './page/index/Index.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Router>
          <div className='container'>
            <Route exact path="/" component={Index} />
          </div>
        </Router>
      </div>
    )
  }
}


ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
    </div>
  </Provider>,
  document.getElementById('root')
);
