import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './index.css';
import './mkfx.css';
import '@public/css/anima.css';

import UserState from '@context/user/userState';
import EditorState from '@context/editor/editorState';
import VerifiRoute from '@components/verifi-route';
import Index from '@page/index';
import Article from '@page/article';
import Login from '@page/login';
import Simditor from '@page/simditor';
import New from '@page/new';
import Space from '@page/space';
import SpaceDetail from '@page/spacedetail';
import Docs from '@page/docs';

import './media.css';

// 动态路由 http://react-guide.github.io/react-router-cn/docs/guides/advanced/DynamicRouting.html

const PageWrapper = (Compoment, pathname, title) => {
  return () => {
    return <VerifiRoute
      title={title}
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
        <EditorState>
          <Router>
            <Route
              exact
              path="/(index|)"
              component={PageWrapper(Index, '/', '工作台 · 一日一记')}
            />
            <Route
              path="/simditor/:id"
              component={PageWrapper(Simditor, '/simditor/:id', '文档 · Simditor')}
            />
            <Route
              path="/article/:id"
              component={PageWrapper(Article, '/article/:id', '文档 · 一日一记')}
            />
            <Route
              path="/new/"
              component={PageWrapper(New, '/new/', '新建空间 · 一日一记')}
            />
            <Route
              path="/space/"
              exact
              component={PageWrapper(Space, '/space/', '空间 · 一日一记')}
            />
            <Route
              path="/spacedetail/"
              exact
              component={PageWrapper(SpaceDetail, '/spacedetail/', '空间 · 一日一记')}
            />
            <Route
              path="/docs/"
              component={PageWrapper(Docs, '/docs/', '文档 · 一日一记')}
            />
            <Route
              exact
              path="/(login|register)"
              component={Login}
            />
          </Router>
        </EditorState>
        {/* <div className="footer-myssl ">
          <a href="https://myssl.com/www.bigxigua.net?from=mysslid">
            <img src="https://static.myssl.com/res/images/myssl-id.png" />
          </a>
        </div> */}
      </UserState>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
