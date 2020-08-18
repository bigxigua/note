// |  _ |_   _/ ____\ \ / |_   _/ ____| |  | |  /\
// | |_) || || |  __ \ V /  | || |  __| |  | | /  \
// |  _ < | || | |_ | > <   | || | |_ | |  | |/ /\ \
// | |_) _| || |__| |/ . \ _| || |__| | |__| / ____ \
// |____|_____\_____/_/ \_|_____\_____|\____/_/    \_\`

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { checkBrowser } from '@util/util';
import './index.css';
import './mkfx.css';
import '@public/css/anima.css';
import 'react-photoswipe/lib/photoswipe.css';
import 'xigua-components/dist/css/index.css';

import UserState from '@context/user/userState';
import EditorState from '@context/editor/editorState';
import VerifiRoute from '@components/verifi-route';
import Index from '@page/index';
import Article from '@page/article';
import Share from '@page/share';
import Login from '@page/login';
import Simditor from '@page/simditor';
import New from '@page/new';
import Space from '@page/space';
import SpaceDetail from '@page/spacedetail';
import Docs from '@page/docs';
// import Graph from '@page/graph';

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
    const xiguaWorker = new window.Worker('/worker.js');
    window.xiguaWorker = xiguaWorker;

    window.isMobile = Boolean(checkBrowser().isMobile);
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
              component={PageWrapper(Index, '/', '工作台 - 西瓜文档')}
            />
            <Route
              path="/simditor/:id"
              component={PageWrapper(Simditor, '/simditor/:id', '文档 - Simditor')}
            />
            <Route
              path="/share/:id"
              component={PageWrapper(Share, '/share/:id', '文档 - 西瓜文档')}
            />
            <Route
              path="/article/:id"
              component={PageWrapper(Article, '/article/:id', '文档 - 西瓜文档')}
            />
            <Route
              path="/new/"
              component={PageWrapper(New, '/new/', '新建空间 - 西瓜文档')}
            />
            <Route
              path="/space/"
              exact
              component={PageWrapper(Space, '/space/', '知识库 - 西瓜文档')}
            />
            <Route
              path="/spacedetail/"
              exact
              component={PageWrapper(SpaceDetail, '/spacedetail/', '空间 - 西瓜文档')}
            />
            <Route
              path="/docs/"
              component={PageWrapper(Docs, '/docs/', '文档 - 西瓜文档')}
            />
            {/* <Route
              path="/graph/"
              component={PageWrapper(Graph, '/graph/', '图表 · 西瓜文档')}
            /> */}
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
