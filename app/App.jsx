import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import UserState from './context/user/userState.js';
import VerifiRoute from './components/verifi-route/index.js';
import Index from './page/index/index.js';
import Article from './page/article/index.js';
import Editor from './page/editor/editor.js';
import Login from './page/login/index.js';
import New from './page/new/index.js';
import Space from './page/space/index.js';
import './App.css';
import './public/css/anima.css';
// TODO 动态路由 http://react-guide.github.io/react-router-cn/docs/guides/advanced/DynamicRouting.html
// 按需加载

const PageWrapper = (Compoment, pathname) => {
  return () => {
    return <VerifiRoute
      component={Compoment}
      pathname={pathname} />;
  };
};
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
          <Route
            exact
            path="/"
            component={PageWrapper(Index, '/')}
          />
          <Route
            path="/article/:id"
            component={PageWrapper(Article, '/article/:id')}
          />
          <Route
            path="/editor/:id"
            component={PageWrapper(Editor, '/editor/:id')}
          />
          <Route
            path="/new/"
            component={PageWrapper(New, '/new/')}
          />
          <Route
            path="/space/"
            component={PageWrapper(Space, '/space/')}
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
