import React, { Component } from 'react';
import {
  getIn,
  debunce,
  isEmptyObject,
  findCurrentNoteBookAndSubNoteFromNotes
} from '../../util/util.js';
import axiosInstance from '../../util/axiosInstance.js';
import LoginComponent from '../login/Login.js';
import { Modal, message, notification, Icon } from 'antd';
import './Editor.css';
import { OFFLINE_NOTEBOOK_INFO, OFFLINENOTE_STORAGE_KEY } from '../../config/index';

const loginComponent = LoginComponent.getInstance();

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false, // 是否展示Modal
      editor: null, // 编辑器实例
      confirmOfflined: false, // 是否确认使用免登陆模式or编辑临时文档模式
      minWidth: 1430
    };
  }

  componentDidMount() {
    loginComponent.checkAuthorization();
    loginComponent.listen('login:change', async (info) => {
      if (info) {
        this.props.setUserInfoToStore(info);
        !info.isAutoLogin && this.initializeEditorContent();
      } else {
        // this.disposeOfflineMarkdownInfo();
      }
    });
    this.initializeEditor();
    // window.addEventListener('resize', () => {
    //   console.log(1);
    //   if ($(window).width() < 1430 && this.state.minWidth === 1430) {

    //   }
    // }, false);
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

  initializeEditor() {
    const { $, editormd } = window;
    const debunceAutoSaveHandle = debunce(function () {
      this.autoSaveHandle.apply(this, arguments);
    }).bind(this);
    $(() => {
      const editor = editormd('editormd', {
        path: '/editor/lib/', // Autoload modules mode, codemirror, marked... dependents libs path
        disabledKeyMaps: ['Ctrl-S', 'F11', 'F10'],
        placeholder: '开始吧！！',
        searchReplace: true,
        codeFold: true,
        theme: 'default',
        previewTheme: 'default',
        // toolbarIcons: [], // 自定义工具栏
        // readOnly: true, // 只读模式
        markdown: 'FUCK ME',
        editorTheme: 'default',
        // htmlDecode : "style,script,iframe|on*",            // 开启 HTML 标签解析，为了安全性，默认不开启
        emoji: true,
        tex: true, // 开启科学公式TeX语言支持，默认关闭
        // sequenceDiagram: true,       // 开启时序/序列图支持，默认关闭,
        // flowChart: true,             // 开启流程图支持，默认关闭
        tocm: true, // Using [TOCM]
        watch: false
      });
      // 后续使用editor.settings.onload时，不覆盖之前设置的。
      editor.settings.LOAD_HANDLE_QUEUE = [];
      // TODO 这里需要优化
      Object.defineProperty(editor.settings, 'onload', {
        get: function() {
          editor.settings.LOAD_HANDLE_QUEUE.map(f => f());
          return function () {};
        },
        set: function(fn) {
          if (typeof fn === 'function') {
            editor.settings.LOAD_HANDLE_QUEUE.push(fn);
          }
        }
      });
      editor.settings.onload = function () {
        this.initializeEditorContent();
        this.addToolTipForEditorIcon();
        // watch=false时无法使用editor.onchange
        editor.cm.on('change', () => {
          this.props.setSaveStatusToStore('pendding');
          debunceAutoSaveHandle(editor);
        });
      }.bind(this);
      this.setState({ editor });
      this.props.setEditorToStore(editor);
    });
  }

  /**
   *  初始化编辑器
   *  @returns {object} null
   */

  /**
   *  处理离线模式下localstorage里的笔记信息，并显示在编辑器内
   *  @returns {object} null
   */
  disposeOfflineMarkdownInfo = () => {
    let offlineNoteBookInfo = JSON.parse(window.localStorage.getItem(OFFLINENOTE_STORAGE_KEY) || '[]');
    const { editor } = this.state;
    if (isEmptyObject(offlineNoteBookInfo[0])) {
      console.log('[离线模式] 往localStorage里设置默认编辑内容');
      window.localStorage.setItem(OFFLINENOTE_STORAGE_KEY, JSON.stringify(OFFLINE_NOTEBOOK_INFO));
      offlineNoteBookInfo = [OFFLINE_NOTEBOOK_INFO];
    }
    console.log('[离线模式] 获取localStorage内缓存离线笔记已显示', offlineNoteBookInfo);
    const offlineSubNote = getIn(offlineNoteBookInfo, [0, 'subNotes', 0], {});
    editor.setMarkdown(offlineSubNote.sub_note_markdown);
    this.props.setCurrentEditSubnoteInfoToStore(offlineSubNote);
    this.props.setNotesInfoToStore(offlineNoteBookInfo);
  }

  /**
   *  鼠标hover编辑器上的图标，给予文字提示
   *  @returns {object} null
   */
  addToolTipForEditorIcon = () => {
    const oEditormdMenus = document.querySelectorAll('.editormd-menu>li>a');
    if (oEditormdMenus.length > 0) {
      oEditormdMenus.forEach(oMenu => {
        const tips = $(oMenu).attr('title');
        $(oMenu).attr('title', '');
        const toolTip = `<div class="editormd-custom-toolTip">${tips}</div>`;
        $(oMenu).append(toolTip);
        oMenu.addEventListener('mouseover', (e) => {
          e.currentTarget.children[1].style.display = 'block';
        });
        oMenu.addEventListener('mouseout', (e) => {
          e.currentTarget.children[1].style.display = 'none';
        });
      });
    }
  }

  /**
   *  初始化编辑器内容
   *  未登陆时显示用户上次离线编辑的笔记，登陆后显示用户上次最近编辑的笔记
   *  @returns {object} null
   */
  initializeEditorContent = async () => {
    const { userInfo: { account, isRegisterUser } } = this.props;
    const { editor } = this.state;
    if (!account) {
      // 离线状态下，如果用户有离线笔记，则显示用户编辑后的，若没有则显示默认文案
      this.disposeOfflineMarkdownInfo();
    } else {
      // 登陆状态下，查找用户上次编辑的子笔记信息并显示
      // 新注册的用户没有任何笔记，不需要调用该接口
      if (isRegisterUser) {
        return;
      }
      const [error, data] = await axiosInstance.get('getRecentEditorSubnote');
      if (!error && data) {
        editor.setMarkdown(data.sub_note_markdown || '');
        this.props.setCurrentEditSubnoteInfoToStore(data);
      } else {
        this.props.setCurrentEditSubnoteInfoToStore(OFFLINE_NOTEBOOK_INFO.subNotes[0]);
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
    const {
      userInfo: {
        account
      }
    } = this.props;
    const { confirmOfflined } = this.state;
    const markdown = editor.getMarkdown();
    const html = editor.previewContainer.html();
    const { sub_note_id: subNoteId, sub_note_markdown: subNoteMarkdown, notebook_id } = this.props.markdownInfo;
    const now = Date.now();
    if (!account) {
      if (!confirmOfflined && markdown !== subNoteMarkdown) {
        // TODO 这里应该用户确认后保存一次用户修改的结果到localStorage内;
        this.toggleShowModal(true);
        return;
      }
      if (markdown === subNoteMarkdown) {
        this.props.setSaveStatusToStore('success');
        return;
      }
      // 如果是离线编辑
      if (subNoteId === OFFLINE_NOTEBOOK_INFO.subNotes[0].sub_note_id) {
        this.props.setSaveStatusToStore('success');
        const notes = [{
          ...OFFLINE_NOTEBOOK_INFO,
          subNotes: [{
            ...OFFLINE_NOTEBOOK_INFO.subNotes[0],
            sub_note_created_time: now,
            sub_note_last_update: now,
            sub_note_html: html,
            sub_note_markdown: markdown
          }]
        }];
        localStorage.setItem(OFFLINENOTE_STORAGE_KEY, JSON.stringify(notes));
        this.props.setNotesInfoToStore(notes);
        return;
      }
      this.props.setSaveStatusToStore('success');
      return;
    }
    // @非离线模式下不允许编辑离线笔记
    if (notebook_id === OFFLINE_NOTEBOOK_INFO.notebook_id) {
      Modal.info({
        content: '你还未选择笔记本进行编辑哦,请先选择一个子笔记',
        okText: '确认',
        onOk: () => { this.props.setDrawerVisibleToStore(true); }
      });
      return;
    }
    // TODO 如何未找到所在笔记，保存前先让用户去创建一个笔记本
    const [error, data] = await axiosInstance.post('updateDraft', {
      html,
      markdown,
      subNoteId
    });
    if (!error && data) {
      this.props.setSaveStatusToStore('success');
      const { notes } = this.props;
      const [{ curNoteIndex }, { curSubNoteIndex }] = findCurrentNoteBookAndSubNoteFromNotes(notes, notebook_id, subNoteId);
      if (curNoteIndex !== -1 && curSubNoteIndex !== -1) {
        notes[curNoteIndex].subNotes[curSubNoteIndex].sub_note_markdown = markdown;
        notes[curNoteIndex].subNotes[curSubNoteIndex].sub_note_html = html;
        notes[curNoteIndex].subNotes[curSubNoteIndex].sub_note_last_update = Date.now();
        this.props.setNotesInfoToStore(notes);
      }
    } else {
      if (error.code === 50001) {
        Modal.confirm({
          content: '你还未创建过子笔记哟，快去创建后编辑,或退出登陆，使用离线模式',
          okText: '去创建',
          cancelText: '离线模式',
          onOk: () => {
            this.props.setDrawerVisibleToStore(true);
          },
          onCancel: () => {
            // loginComponent.quitLoginHandle();
          }
        });
      } else {
        message.error(error.message);
      }
      this.props.setSaveStatusToStore('failed');
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
  toggleShowModal = (showModal = false, goToLogin = false) => {
    this.setState({
      showModal
    });
    this.props.setSaveStatusToStore('');
    goToLogin && this.doLogin();
  }

  render() {
    return (
      <div className="editor_container"
        id="editormd">
        <Modal
          title="登陆后可以永久保存哟"
          okText="免登陆模式"
          cancelText="去登陆"
          visible={this.state.showModal}
          onOk={this.setPatternToExemption}
          onCancel={() => { this.toggleShowModal(false, true); }}
        >
          <p>1.登陆后可以永久保存编辑内容</p>
          <p>2.免登陆模式让你快速编辑文档，刷新不丢的哟</p>
          <p>&nbsp;&nbsp;&nbsp;更多特性,敬请期待...</p>
        </Modal>
      </div>
    );
  }
}