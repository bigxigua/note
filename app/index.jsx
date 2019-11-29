import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import UserState from '@context/user/userState';
import EditorState from '@context/editor/editorState';
import VerifiRoute from '@components/verifi-route';
import Index from '@page/index';
import Article from '@page/article';
import Editor from '@page/editor';
import Login from '@page/login';
import New from '@page/new';
import Space from '@page/space';
import Docs from '@page/docs';
import Recycle from '@page/recycle';
import Star from '@page/star';
import './index.css';
import '@public/css/anima.css';
import BasicLayout from '@page/layout/BasicLayout';

// TODO 动态路由 http://react-guide.github.io/react-router-cn/docs/guides/advanced/DynamicRouting.html
// 按需加载

const PageWrapper = (Compoment, pathname, layout) => {
  return () => {
    return <VerifiRoute
      component={Compoment}
      pathname={pathname}
      layout={layout} />;
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
        <EditorState>
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
              path="/docs/"
              component={PageWrapper(Docs, '/docs/')}
            />
            <Route
              path="/recycle/"
              component={PageWrapper(Recycle, '/recycle/')}
            />
            <Route
              exact
              path="/star"
              component={PageWrapper(Star, '/star', BasicLayout)}
            />
            <Route
              exact
              path="/(login|register)"
              component={Login}
            />
          </Router>
        </EditorState>
      </UserState>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
