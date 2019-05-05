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
            saveStatus, // 保存文本的当前状态
            userInfo // 用户信息
        } = this.props;
        return (
            <div className="page_container">
                <Nav saveStatus={saveStatus} userInfo={userInfo} updateUserInfo ={updateUserInfo} />
                <Editor updateUserInfo ={updateUserInfo} autoSaveMarkdown={autoSaveMarkdown} userInfo={userInfo} />
            </div>
        )
    }
}