import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import UserState from './context/user/userState.js';
import VerifiRoute from './components/verifi-route/index.js';
import Index from './page/index/index.js';
import Article from './page/article/index.js';
import Editor from './page/editor/editor.js';
import Login from './page/login/index.js';
import './App.css';
import './public/css/anima.css';
// TODO 动态路由 http://react-guide.github.io/react-router-cn/docs/guides/advanced/DynamicRouting.html
// 按需加载
class App extends React.Component {
  componentDidMount() {
  }

  componentDidCatch(e) {
    console.log('[发生语法错误]', e);
  }

  render() {
    return (
      <UserState>
        <Router>
          <VerifiRoute
            exact
            path="/"
            component={Index}
          />
          <VerifiRoute
            path="/article/:id"
            component={Article}
          />
          <VerifiRoute
            path="/editor/:id"
            component={Editor}
          />
          <Route
            exact
            path="/(login|register)"
            component={Login}
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
