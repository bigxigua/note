import React, { Component } from 'react';
import {
    debunce,
    isEmptyObject
} from '../../util/util.js';
import axiosInstance from '../../util/axiosInstance.js';
import LoginComponent from '../login/Login.js';
import { Modal, message } from 'antd';
import './Editor.css';
import { INTRODUCE_MARKDOWN, OFFLINE_NOTEBOOK_INFO, OFFLINENOTE_STORAGE_KEY } from '../../config/index';

const loginComponent = LoginComponent.getInstance();

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false, // 是否展示Modal
            editor: null, // 编辑器实例
            confirmOfflined: false, // 是否确认使用免登陆模式or编辑临时文档模式
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
                this.props.updateUserInfo(info);
            } else {
                let offlineNoteBookInfo = JSON.parse(window.localStorage.getItem(OFFLINENOTE_STORAGE_KEY) || '{}');
                if (isEmptyObject(offlineNoteBookInfo)) {
                    window.localStorage.setItem(OFFLINENOTE_STORAGE_KEY, JSON.stringify(OFFLINE_NOTEBOOK_INFO));
                    offlineNoteBookInfo = OFFLINE_NOTEBOOK_INFO;
                }
                this.props.updateUserNotes(offlineNoteBookInfo);
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
    /**
     *  点击侧边栏的子笔记进行编辑时，在编辑器上显示正在编辑的内容
     *  @markdownInfo {string} 子笔记信息
     *  @returns {object} null
     */
    componentWillReceiveProps({ markdownInfo }) {
        const prevMarkdown = this.props.markdownInfo.sub_note_markdown;
        const curMarkdown = markdownInfo.sub_note_markdown;
        if (curMarkdown && curMarkdown !== prevMarkdown) {
            this.state.editor.setMarkdown(curMarkdown);
        }
    }
    /**
     *  初始化编辑器内容
     *  未登陆时显示用户上次离线编辑的笔记，登陆后显示用户上次最近编辑的笔记
     *  @returns {object} null
     */
    initializeEditorContent = async () => {
        const { userInfo: { account } } = this.props;
        const { editor } = this.state;
        if (!account) {
            // 离线状态下，如果用户有离线笔记，则显示用户编辑后的，若没有则显示默认文案
            let offlineNoteBookInfo = JSON.parse(window.localStorage.getItem(OFFLINENOTE_STORAGE_KEY) || '{}');
            if (!isEmptyObject(offlineNoteBookInfo)) {
                const offlineSubNote = offlineNoteBookInfo.subNotes[0];
                editor.setMarkdown(offlineSubNote.sub_note_markdown);
                this.props.setInitMarkdownContent(offlineSubNote);
            } else {
                editor.setMarkdown(INTRODUCE_MARKDOWN);
                this.props.setInitMarkdownContent(OFFLINE_NOTEBOOK_INFO);
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
    /**
     *  编辑结束自动保存
     *  停止输入后3s保存当前笔记，未登陆时为离线保存
     *  @editor {object} 编辑器对象
     *  @returns {object} null
     */
    autoSaveHandle = async (editor) => {
        const { userInfo: {
            account
        } } = this.props;
        const { confirmOfflined } = this.state;
        const markdown = editor.getMarkdown();
        const html = editor.previewContainer.html();
        const { sub_note_id: subNoteId, sub_note_markdown: subNoteMarkdown } = this.props.markdownInfo;
        const now = Date.now();
        if (!account) {
            if (!confirmOfflined && markdown !== subNoteMarkdown) {
                // TODO 这里应该用户确认后保存一次用户修改的结果到localStorage内;
                this.toggleShowModal(true);
                return;
            }
            if (markdown === subNoteMarkdown) {
                this.props.autoSaveMarkdown('success');
                return;
            }
            // 如果是离线编辑
            if (subNoteId === OFFLINE_NOTEBOOK_INFO.subNotes[0].sub_note_id) {
                this.props.autoSaveMarkdown('success');
                localStorage.setItem(OFFLINENOTE_STORAGE_KEY, JSON.stringify({
                    ...OFFLINE_NOTEBOOK_INFO,
                    subNotes: [{
                        ...OFFLINE_NOTEBOOK_INFO.subNotes[0],
                        sub_note_created_time: now,
                        sub_note_last_update: now,
                        sub_note_html: html,
                        sub_note_markdown: markdown,
                    }]
                }));
                return;
            }
            this.props.autoSaveMarkdown('success');
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
    /**
     *  设置为免登陆模式(session有效)
     *  登陆后失效，免登陆模式下用户也可编辑保存子笔记
     *  @returns {object} null
     */
    setPatternToExemption = () => {
        this.setState({ confirmOfflined: true });
        this.toggleShowModal(false);
    }
    /**
     *  用户登陆，显示登陆弹框
     *  @returns {object} null
     */
    doLogin = () => {
        this.toggleShowModal(false);
        loginComponent.show();
    }
    /**
     *  隐藏或关闭登陆弹框
     *  @returns {object} null
     */
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
                    onCancel={() => {this.toggleShowModal(false)}}
                >
                    <p>1.登陆后可以永久保存编辑内容</p>
                    <p>2.免登陆模式让你快速编辑文档，刷新不丢的哟</p>
                    <p>&nbsp;&nbsp;&nbsp;更多特性,敬请期待...</p>
                </Modal>
            </div>
        )
    }
}