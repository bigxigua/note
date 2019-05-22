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
            editor: null, // 编辑器实例
            confirmOfflined: false, // 是否使用免登陆模式or编辑临时文档模式
        }
    }
    componentDidMount() {
        // TODO 根据文章id获取正在编辑的内容，如果是编辑已存在的文档的话
        const { $, editormd } = window;
        const debunceAutoSaveHandle = debunce(function () {
            this.autoSaveHandle.apply(this, arguments);
        }).bind(this);
        LoginComponent.checkAuthorization();
        LoginComponent.listen('login:change', (info) => {
            if (info) {
                this.props.updateUserInfo(info);
            }
        });
        $(() => {
            const editor = editormd('editormd', {
                path: '/editor/lib/', // Autoload modules mode, codemirror, marked... dependents libs path
                disabledKeyMaps: ['Ctrl-B', 'F11', 'F10'],
                placeholder: '开始吧！！',
                onload: () => {
                    let defaultMarkdown = localStorage.getItem('offlineMarkdown');
                    if (this.props.userInfo.account) {
                        // TODO 获取用户上次编辑的笔记
                        const lastEditMarkdown = '';
                        // eslint-disable-next-line
                        lastEditMarkdown ? (defaultMarkdown = lastEditMarkdown) : {};
                    }
                    defaultMarkdown && editor.setMarkdown(defaultMarkdown);
                }
            });
            this.setState({
                editor
            });
            editor.settings.onchange = (function () {
                this.props.autoSaveMarkdown('pendding');
                debunceAutoSaveHandle(editor);
            }).bind(this);
        });
    }
    // 当markdown更新时
    componentWillReceiveProps({ markdownInfo }) {
        const prevMarkdown = this.props.markdownInfo.sub_note_markdown;
        const curMarkdown = markdownInfo.sub_note_markdown;
        if (curMarkdown && curMarkdown !== prevMarkdown) {
            this.state.editor.setMarkdown(curMarkdown);
        }
    }
    // 编辑结束自动保存
    autoSaveHandle = async (editor) => {
        // TODO 免登陆模式
        const { userInfo: {
            account
        } } = this.props;
        const { confirmOfflined } = this.state;
        if (!account && !confirmOfflined) {
            this.toggleShowModal(true);
            return;
        }
        const markdown = editor.getMarkdown();
        // testEditor.getHTML(); 
        // testEditor.getPreviewedHTML();
        const html = editor.previewContainer.html();
        const subNoteId = this.props.markdownInfo.sub_note_id;
        if (!subNoteId) {
            this.props.autoSaveMarkdown('success');
            if (confirmOfflined) {
                localStorage.setItem('offlineMarkdown', markdown);
                return;
            }
            Modal.confirm({
                content: '您当前还未选择笔记本，确认是否选择离线编辑？',
                cancelText: '取消',
                okText: '确认离线',
                onOk: () => {
                    localStorage.setItem('offlineMarkdown', markdown);
                    this.setState({ confirmOfflined: true });
                }
            });
            return;
        }
        // TODO 如何未找到所在笔记，保存前先让用户去创建一个笔记本
        try {
            const [error, data] = await axiosInstance.post('updateDraft', {
                html,
                markdown,
                subNoteId,
            });
            if (!error) {
                this.props.autoSaveMarkdown('success');
            } else {
                message.error(data.message);
                this.props.autoSaveMarkdown('failed');
            }
        } catch (err) {
            message.error(err.message);
            this.props.autoSaveMarkdown('failed');
        }
    }
    setPatternToExemption = () => {
        this.setState({ confirmOfflined: true });
        this.toggleShowModal(false);
    }
    doLogin = () => {
        this.toggleShowModal(false);
        LoginComponent.createInstance();
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