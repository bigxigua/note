import React, { Component } from 'react';
import './Index.css';
import Nav from '../../components/nav/Nav.jsx';
import Editor from '../../components/editor/Editor.jsx';
import Catalog from '../../components/catalog/Catalog.jsx';
import './media-screen.css';
export default class Index extends Component {
  componentDidMount() {
    // 隐藏骨架屏
    // const skeletonDom = document.querySelector('.skeleton');
    // document.body.removeChild(skeletonDom);
    // 禁用Ctrl-S/Cmd-S
    document.addEventListener('keydown', function (e) {
      if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
      }
    }, false);
  }

  render() {
    const {
      setSaveStatusToStore, // action 保存文本
      setUserInfoToStore, // 更新用户信息
      setCurrentEditSubnoteInfoToStore, // 更新正在编辑的markdown文本
      setNotesInfoToStore, // 更新用户笔记本信息
      setDrawerVisibleToStore, // 更新侧边栏展示状态
      setEditorToStore, // 将editor对象保存到store
      userInfo, // 用户信息
      notes, // 笔记本信息
      saveStatus, // 保存编辑内容的当前状态
      markdownInfo, // 正在被编辑的markdown
      editorInstance, // 编辑器对象
      canShowDrawer // 是否展示侧边栏

    } = this.props;
    return (
      <div className="editor_container">
        <Nav
          saveStatus={saveStatus}
          userInfo={userInfo}
          canShowDrawer={canShowDrawer}
          editorInstance={editorInstance}
          setCurrentEditSubnoteInfoToStore={setCurrentEditSubnoteInfoToStore}
          setDrawerVisibleToStore={setDrawerVisibleToStore}
          setNotesInfoToStore={setNotesInfoToStore}
          markdownInfo={markdownInfo}
          notes={notes}
          setUserInfoToStore={setUserInfoToStore}
        />
        <div className="editor_content">
          <Editor
            setUserInfoToStore={setUserInfoToStore}
            setCurrentEditSubnoteInfoToStore={setCurrentEditSubnoteInfoToStore}
            setSaveStatusToStore={setSaveStatusToStore}
            setNotesInfoToStore={setNotesInfoToStore}
            setDrawerVisibleToStore={setDrawerVisibleToStore}
            setEditorToStore={setEditorToStore}
            markdownInfo={markdownInfo}
            notes={notes}
            canShowDrawer={canShowDrawer}
            userInfo={userInfo}
          />
          {editorInstance && <Catalog editorInstance={editorInstance} />}
        </div>
      </div>
    );
  }
}