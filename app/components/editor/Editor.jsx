import React, { Component } from 'react';
import {
    debunce
} from '../../util/util.js';
import axiosInstance from '../../util/axiosInstance.js';
import LoginComponent from '../login/Login.js';
import { Modal, message } from 'antd';
import './Editor.css';

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false, // 是否展示Modal
        }
    }
    componentDidMount() {
        // TODO 根据文章id获取正在编辑的内容，如果是编辑已存在的文档的话
        const { $, editormd } = window;
        const debunceAutoSaveHandle = debunce(function () {
            this.autoSaveHandle.apply(this, arguments);
        }).bind(this);
        $(() => {
            const editor = editormd('editormd', {
                path: '/editor/lib/', // Autoload modules mode, codemirror, marked... dependents libs path
                disabledKeyMaps: ['Ctrl-B', 'F11', 'F10'],
                placeholder: '开始吧！！',
                onload: function () {
                }
            });
            editor.settings.onchange = (function () {
                this.props.autoSaveMarkdown('pendding');
                debunceAutoSaveHandle(editor);
            }).bind(this);
        });
    }
    autoSaveHandle = (editor) => {
        // TODO 免登陆模式
        const { userInfo: {
            account
        } } = this.props;
        const markdown = editor.getMarkdown();
        const html = editor.previewContainer.html();
        if (!account) {
            this.toggleShowModal(true);
            return;
        }
        axiosInstance.post('updateDraft', {
            html,
            account,
            markdown
        }).then((response) => {
            // TODO 保存到localStorage里
            if (response.data && !response.data.isError) {
                window.localStorage.setItem(account, markdown);
                this.props.autoSaveMarkdown('success');
            } else {
                this.props.autoSaveMarkdown('failed');
                message.error(response.data.message);
            }
        }).catch(error => {
            this.props.autoSaveMarkdown('failed');
            message.error('系统繁忙');
        });
    }
    // 设置为免登陆模式
    setPatternToExemption = () => {
        this.toggleShowModal(false);
    }
    doLogin = () => {
        this.toggleShowModal(false);
        const instance = LoginComponent.createInstance();
        LoginComponent.listen('login:change', (info) => {
            if (info) {
                instance.hide();
                this.props.updateUserInfo(info);
            }
        });
    }
    toggleShowModal = (showModal) => {
        this.setState({
            showModal
        });
        this.props.autoSaveMarkdown('');
    }
    render() {
        return (
            <div className="editor_container" id="editormd">
                <Modal
                    title="登陆后可以永久保存哟"
                    okText="免登陆模式"
                    cancelText="去登陆"
                    visible={this.state.showModal}
                    onOk={this.setPatternToExemption}
                    onCancel={this.doLogin}
                >
                    <p>1.登陆后可以永久保存编辑内容</p>
                    <p>2.免登陆模式让你快速编辑文档，刷新不丢的哟</p>
                    <p>&nbsp;&nbsp;&nbsp;更多特性,敬请期待...</p>
                </Modal>
            </div>
        )
    }
}