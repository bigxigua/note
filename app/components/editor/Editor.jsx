import React, { Component } from 'react';
import {
    debunce,
    isEmptyObject
} from '../../util/util.js';
import axiosInstance from '../../util/axiosInstance.js';
import LoginComponent from '../login/Login.js';
import { Modal, message } from 'antd';
import './Editor.css';
import { INTRODUCE_MARKDOWN } from '../../config/index';

const loginComponent = LoginComponent.getInstance();
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
        const { $, editormd } = window;
        const debunceAutoSaveHandle = debunce(function () {
            this.autoSaveHandle.apply(this, arguments);
        }).bind(this);
        loginComponent.checkAuthorization();
        loginComponent.listen('login:change', async (info) => {
            if (info) {
                await this.props.updateUserInfo(info);
            }
        });
        $(() => {
            const editor = editormd('editormd', {
                path: '/editor/lib/', // Autoload modules mode, codemirror, marked... dependents libs path
                disabledKeyMaps: ['Ctrl-B', 'F11', 'F10'],
                placeholder: '开始吧！！',
                onload: () => {
                    this.initializeEditorContent();
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
    // 初始化编辑器内容
    initializeEditorContent = async () => {
        const { userInfo: { account } } = this.props;
        const { editor } = this.state;
        if (!account) {
            // 离线状态下，如果用户有离线笔记，则显示用户编辑后的，若没有则显示默认文案
            let offlineNoteBookInfo = JSON.parse(window.localStorage.getItem('offlineNoteBook') || '{}');
            if (!isEmptyObject(offlineNoteBookInfo)) {
                const offlineSubNote = offlineNoteBookInfo.subNotes[0];
                editor.setMarkdown(offlineSubNote.sub_note_markdown);
            } else {
                editor.setMarkdown(INTRODUCE_MARKDOWN);
            }
        } else {
            // 登陆状态下，查找用户上次编辑的子笔记信息并显示
            const [error, data] = await axiosInstance.get('getRecentEditorSubnote');
            if (!error && data) {
                editor.setMarkdown(data.sub_note_markdown || '');
                this.props.setInitMarkdownContent(data);
            } else {
                message.error((error || {}).message || '获取最近编辑笔记本信息失败，请稍后再试');
            }
        }
    }
    // 编辑结束自动保存
    autoSaveHandle = async (editor) => {
        const { userInfo: {
            account
        } } = this.props;
        const { confirmOfflined } = this.state;
        if (!account && !confirmOfflined) {
            this.toggleShowModal(true);
            return;
        }
        const markdown = editor.getMarkdown();
        const html = editor.previewContainer.html();
        const { sub_note_id: subNoteId, sub_note_markdown: subNoteMarkdown } = this.props.markdownInfo;
        if (markdown === subNoteMarkdown) {
            this.props.autoSaveMarkdown('success');
            return;
        }
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
        const [error, data] = await axiosInstance.post('updateDraft', {
            html,
            markdown,
            subNoteId,
        });
        if (!error && data) {
            this.props.autoSaveMarkdown('success');
        } else {
            message.error((error || {}).message || '系统繁忙，请稍后再试');
            this.props.autoSaveMarkdown('failed');
        }
    }
    setPatternToExemption = () => {
        this.setState({ confirmOfflined: true });
        this.toggleShowModal(false);
    }
    doLogin = () => {
        this.toggleShowModal(false);
        loginComponent.show();
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