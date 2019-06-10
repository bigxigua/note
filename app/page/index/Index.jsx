import React, { Component } from 'react';
import './Index.css';
import Nav from '../../components/nav/Nav.jsx';
import Editor from '../../components/editor/Editor.jsx';
export default class Index extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    render() {
        const {
            autoSaveMarkdown, // action 保存文本
            updateUserInfo, // 更新用户信息
            setInitMarkdownContent, // 更新正在编辑的markdown文本
            updateUserNotes, // 更新用户笔记本信息
            saveStatus, // 保存文本的当前状态
            setEditorToStore, // 将editor对象保存到store
            userInfo, // 用户信息
            markdownInfo, // 正在被编辑的markdown
            editorInstance, // 编辑器对象
        } = this.props;
        return (
            <div className="page_container">
                <Nav 
                    saveStatus={saveStatus} 
                    userInfo={userInfo}
                    editorInstance={editorInstance}
                    setInitMarkdownContent={setInitMarkdownContent}
                    updateUserNotes={updateUserNotes}
                    updateUserInfo ={updateUserInfo} />
                <Editor 
                    updateUserInfo={updateUserInfo} 
                    markdownInfo={markdownInfo}
                    setInitMarkdownContent={setInitMarkdownContent}
                    autoSaveMarkdown={autoSaveMarkdown} 
                    updateUserNotes={updateUserNotes}
                    setEditorToStore={setEditorToStore}
                    userInfo={userInfo} />
            </div>
        )
    }
}