import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Button, Drawer, Modal, Input, message, Popover, Spin, Card, Avatar, Switch } from 'antd';
import SearchSubNote from './SearchSubNote.jsx';
import ImageUploader from './ImageUploader.jsx';
import LoginComponent from '../login/Login.js';
import axiosInstance from '../../util/axiosInstance.js';
import { OFFLINE_NOTEBOOK_INFO, OFFLINENOTE_STORAGE_KEY } from '../../config/index';
import { isEmptyObject, formatTimeStamp } from '../../util/util';
import './Nav.css';

const loginComponent = LoginComponent.getInstance();
const SubMenu = Menu.SubMenu;
const { Meta } = Card;

function createSubNoteSettings(props, ctx, isWastepaperBaskets) {
  props.isWastepaperBaskets = isWastepaperBaskets;
  const { account } = ctx.props.userInfo;
  const { canShowRecoveryLoading } = ctx.state;
  return (
    <div className="sub_note_settings">
      <Button disabled={!account}
        type="danger"
        data-note={props}
        icon="delete"
        onClick={ctx.onDeleteSubNoteHandle.bind(ctx, props)}>删除</Button>
      {!isWastepaperBaskets && <Button type="primary"
        icon="file-markdown"
        onClick={ctx.onEditSubNoteBookHandle.bind(ctx, props)}>编辑</Button>}
      {isWastepaperBaskets && (<Button type="primary"
        icon="reload"
        onClick={ctx.onRecoverySubNoteHandle.bind(ctx, props)}
        loading={canShowRecoveryLoading}>恢复</Button>)}
    </div>
  );
}
function createSubNoteIntroduce(props, ctx) {
  let deleteIconClassName = 'nav-delete-icon';
  (props.isBeingEdit || !ctx.props.userInfo.account) && (deleteIconClassName += ' nav-delete-icon-disabled');
  return (
    <div className="sub_note_introduce">
      <Card
        style={{ width: 300 }}
        actions={[
          // eslint-disable-next-line react/jsx-key
          <Icon type="delete"
            onClick={ctx.onDeleteSubNoteHandle.bind(ctx, props)}
            className={deleteIconClassName} />,
          // eslint-disable-next-line react/jsx-key
          <Icon type="edit"
            onClick={ctx.onEditSubNoteBookHandle.bind(ctx, props)} />,
          // eslint-disable-next-line react/jsx-key
          <Icon type="ellipsis" />
        ]}
      >
        <Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={props.sub_note_name}
          description={props.sub_note_markdown.substr(0, 100)}
        />
      </Card>
    </div>
  );
}
export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisibled: false, // 展示弹框
      noteBookName: '', // 新建的笔记本名称
      subNoteName: '', // 当前需要新增的子笔记名称
      notes: [], // 用户的所有笔记
      canShowLoadingForGetNotes: false, // 是否显示点击查看我的笔记本按钮上的loadig
      canShowLoadingForCreateNotes: false, // 是否显示创建新笔记本按钮上的loadig
      canShowOutLoginSpin: false, // 点击退出登陆时的loading
      canShowRecoveryLoading: false, // 点击恢复废纸篓内子笔记本的loading
      wastepaperBaskets: [], // 用户的废纸篓，这里离线模式也可显示
      canShowImageUploader: false // 是否显示土川图床组件
    };
  }

  componentDidMount() {
    loginComponent.listen('login:change', (info) => {
      if (info) {
        this.props.setUserInfoToStore(info);
      }
    });
  }

    /**
     *  登陆，显示登陆弹框
     *  @returns {object} 笔记数据
     */
    doLogin = () => {
      loginComponent.show();
    }

    /**
     *  打开侧边栏，并获取用户笔记本信息
     *  @returns {object} 笔记数据
     */
    onDrawerOpenHandle = () => {
      this.onGetUserNotes();
    }

    /**
     *  获取用户登陆或离线状态下的所有笔记本(包括废纸篓）
     *  @isRefresh {boolean} 是否强制刷新
     *  @returns {object} 笔记数据
     */
    onGetUserNotes = async (isRefresh = false) => {
      const { account } = this.props.userInfo;
      const { notes } = this.state;
      if (!isRefresh && notes.length > 0 && notes[0].notebook_id !== OFFLINE_NOTEBOOK_INFO.notebook_id && account) {
        this._resetNoteAndWastepaperBasketsd(this.props.notes);
        this.props.setDrawerVisibleToStore(true);
        return;
      }
      this._resetNoteAndWastepaperBasketsd([], []);
      if (!account) {
        // 如果用户未登陆，则默认创建一个离线的笔记本
        let offlineNoteBookInfo = JSON.parse(window.localStorage.getItem(OFFLINENOTE_STORAGE_KEY) || '{}');
        if (isEmptyObject(offlineNoteBookInfo)) {
          window.localStorage.setItem(OFFLINENOTE_STORAGE_KEY, JSON.stringify(OFFLINE_NOTEBOOK_INFO));
          offlineNoteBookInfo = OFFLINE_NOTEBOOK_INFO;
        }
        this._resetNoteAndWastepaperBasketsd([offlineNoteBookInfo]);
        this.props.setDrawerVisibleToStore(true);
        return;
      }
      this.setState({ canShowLoadingForGetNotes: true });
      const [error, data] = await axiosInstance.get('getUserNotes');
      this.setState({ canShowLoadingForGetNotes: false });
      if (!error && Array.isArray(data)) {
        this.props.setDrawerVisibleToStore(true);
        this._resetNoteAndWastepaperBasketsd(data);
      } else {
        message.error((error || {}).message || '获取笔记信息失败，请稍后再试');
      }
    }

    /**
     *  工具函数
     *  重新计算笔记本和废纸篓
     *  @notes {array} notes 笔记本
     *  @wastepaperBaskets {array} 废纸篓
     *  @returns {object} null
     */
    _resetNoteAndWastepaperBasketsd = (notes, wastepaperBaskets) => {
      wastepaperBaskets = wastepaperBaskets || this.state.wastepaperBaskets;
      notes = notes || this.state.notes;
      const { markdownInfo } = this.props;
      // @标记正在编辑的笔记和子笔记
      notes = notes.map(notebook => {
        notebook.isBeingEdit = (notebook.notebook_id === markdownInfo.notebook_id);
        notebook.subNotes = (notebook.subNotes || []).map(subnote => {
          if (subnote.sub_note_exist === 0) {
            wastepaperBaskets.push(subnote);
          }
          subnote.isBeingEdit = (subnote.sub_note_id === markdownInfo.sub_note_id);
          return subnote;
        });
        return notebook;
      });
      // TODO 排序
      notes = notes.sort((a, b) => a.notebook_last_update >= b.notebook_last_update);
      this.props.setNotesInfoToStore(notes);
      // TODO 更新全局的废纸篓笔记信息
      this.setState({ notes, wastepaperBaskets });
    }

    /**
     *  笔记本子笔记标题被点击，显示编辑器，关闭侧边栏
     *  @note {object} 子笔记详情
     *  @returns {object} null
     */
    onEditSubNoteBookHandle = (note) => {
      this.props.setCurrentEditSubnoteInfoToStore(note);
      this.onDrawerCloseHandle();
      this.onClosePopoverHandle();
    }

    /**
     *  点击设置选项时关闭popover
     *  @returns {object} null
     */
    onClosePopoverHandle = () => {
      const oPopover = document.querySelectorAll('.ant-popover');
      if (oPopover && oPopover.length > 0) {
        oPopover.forEach(n => n.classList.add('ant-popover-hidden'));
      }
    }

    /**
     *  关闭侧边栏
     *  @returns {object} null
     */
    onDrawerCloseHandle = () => {
      this.props.setDrawerVisibleToStore(false);
    }

    /**
     *  Input输入发生改变时，设置笔记本或子笔记的名称
     *  @e {object}
     *  @returns {object} null
     */
    onInputValueChange = (e) => {
      const value = e.currentTarget.value.trim();
      const stateName = e.currentTarget.getAttribute('state');
      this.setState({ [`${stateName}`]: value });
    }

    /**
     *  创建新的笔记本
     *  @returns {object} null
     */
    onCreateNewNotebook = async () => {
      const { noteBookName, notes } = this.state;
      this.setState({ canShowLoadingForCreateNotes: true });
      const [error, data] = await axiosInstance.post('createNotebook', {
        noteBookName
      });
      this.setState({ canShowLoadingForCreateNotes: false });
      if (!error && data) {
        this.onToggleShowCreateNoteModal(false);
        notes.push(data);
        message.success('创建笔记本成功，现在可以记笔记啦');
        this._resetNoteAndWastepaperBasketsd(notes);
      } else {
        message.error((error || {}).message || '系统繁忙，请稍后再试');
      }
    }

    /**
     *  删除笔记本下的子笔记
     *  @sub_note_id {string} notes 子笔记id
     *  @notebook_id {string}  子笔记所属的笔记本id
     *  @isWastepaperBaskets {string}  是否是废纸篓里的子笔记
     *  @returns {object} null
     */
    onDeleteSubNoteHandle = async ({ sub_note_id, notebook_id, isWastepaperBaskets, isBeingEdit }) => {
      if (isBeingEdit) {
        return;
      }
      this.onClosePopoverHandle();
      Modal.confirm({
        content: (
          <div>
            <div>{isWastepaperBaskets ? '此操作直接删除，不可恢复，确定吗？' : '您确定要将该笔记移到废纸篓吗？'}</div>
            <div className="nav-delete-tips">{isWastepaperBaskets ? '' : 'tips: 您可以在废纸篓恢复此文档'}</div>
          </div>
        ),
        okText: '确认',
        onOk: async () => {
          const [error] = await axiosInstance.post('deleteSubNote', {
            type: isWastepaperBaskets ? 0 : 1,
            subNoteId: sub_note_id
          });
          if (!error) {
            const { notes, wastepaperBaskets } = this.state;
            const curNoteBookIndex = notes.findIndex(n => n.notebook_id === notebook_id);
            // 移动到废纸篓
            if (curNoteBookIndex !== -1 && !isWastepaperBaskets) {
              const curSubNoteIndex = notes[curNoteBookIndex].subNotes.findIndex(n => n.sub_note_id === sub_note_id);
              if (curSubNoteIndex !== -1) {
                notes[curNoteBookIndex].subNotes[curSubNoteIndex].sub_note_exist = 0;
                this._resetNoteAndWastepaperBasketsd(notes);
              }
            }
            // 删除废纸篓内子笔记
            const curBasketsIndex = wastepaperBaskets.findIndex(n => n.sub_note_id === sub_note_id);
            if (isWastepaperBaskets && curBasketsIndex !== -1) {
              wastepaperBaskets.splice(curBasketsIndex, 1);
              this._resetNoteAndWastepaperBasketsd(null, wastepaperBaskets);
            }
          } else {
            message.error((error || {}).message || '系统繁忙，请稍后再试');
          }
        },
        cancelText: '我在想想'
      });
    }

    /**
     *  从废纸篓内恢复子笔记
     *  @returns {object} null
     */
    onRecoverySubNoteHandle = async ({ sub_note_id, notebook_id }) => {
      this.setState({ canShowRecoveryLoading: true });
      const [error, data] = await axiosInstance.post('updateSubnoteInfo', {
        subNoteId: sub_note_id,
        subNoteExist: 1
      });
      this.onClosePopoverHandle();
      this.setState({ canShowRecoveryLoading: false });
      if (!error && data) {
        const { notes, wastepaperBaskets } = this.state;
        const curBasketsIndex = wastepaperBaskets.findIndex(n => n.sub_note_id === sub_note_id);
        const curNoteBooksIndex = notes.findIndex(n => n.notebook_id === notebook_id);
        if (curBasketsIndex !== -1) {
          wastepaperBaskets.splice(curBasketsIndex, 1);
        }
        if (curNoteBooksIndex !== -1) {
          notes[curNoteBooksIndex].subNotes.push(data);
        }
        this._resetNoteAndWastepaperBasketsd(notes, wastepaperBaskets);
        message.success('已恢复到对应笔记本下');
      } else {
        message.error((error || {}).message || '系统繁忙，请稍后再试');
      }
    }

    /**
     *  新增笔记本下的子笔记
     *  @notebook_name {string} 新增子笔记所在的笔记本名称
     *  @notebook_id {string}  新增子笔记所在的笔记本id
     *  @returns {object} null
     */
    onCreateNewSubNoteHandle = async ({ notebook_id, notebook_name }) => {
      // 如果用户未登陆，则提示去登陆
      const { account } = this.props.userInfo;
      if (!account) {
        Modal.confirm({
          cancelText: '先用用看',
          okText: '登陆',
          content: '你还未登陆，登陆后可享永久保存',
          onOk: () => {
            this.onDrawerCloseHandle();
            loginComponent.show();
          }
        });
        return;
      }
      this.setState({ subNoteName: '' });
      Modal.confirm({
        title: `正在【${notebook_name}】笔记本下新增子笔记`,
        content: <Input state="subNoteName"
          className="nav-create-subnote-input"
          onChange={this.onInputValueChange}
          size="large"
          placeholder="请输入笔记名称" />,
        cancelText: '取消',
        destroyOnClose: true,
        okText: '创建',
        onOk: async () => {
          const { subNoteName } = this.state;
          if (!subNoteName) {
            message.error('子笔记名不可以为空');
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('子笔记名不可以为空');
          }
          const [error, data] = await axiosInstance.post('createSubNotebook', {
            notebookId: notebook_id,
            subNoteName
          });
          if (!error && data.notebook_id) {
            message.success('笔记创建成功', 1);
            const { notes } = this.state;
            const curIndex = notes.findIndex(n => n.notebook_id === data.notebook_id);
            if (curIndex !== -1) {
              notes[curIndex].subNotes.push(data);
            }
            this.setState({ notes });
          } else {
            message.error((error || {}).message || '系统开小差啦，稍等试试吧', 2);
          }
        }
      });
    }

    /**
     *  删除某个笔记本
     *  @notebook_id {string}  笔记本id
     *  @returns {object} null
     */
    onDeleteNoteBookHandle = async ({ notebook_id, notebook_name, subNotes }) => {
      const hasSubNotes = subNotes.length > 0;
      const content = hasSubNotes ? `该笔记本下还有${subNotes.length}个子笔记哟` : '';
      const okText = hasSubNotes ? '全部删除' : '确认删除';
      Modal.confirm({
        cancelText: '我再想想',
        okText,
        content: `你确定删除${notebook_name}吗？${content}`,
        onOk: async () => {
          const [error, data] = await axiosInstance.post('deleteNotebook', {
            noteBookId: notebook_id,
            hasSubNotes
          });
          if (!error && data) {
            const { notes } = this.state;
            const curNoteIndex = notes.findIndex(n => n.notebook_id === notebook_id);
            curNoteIndex !== -1 && notes.splice(curNoteIndex, 1);
            this._resetNoteAndWastepaperBasketsd(notes);
            message.success('删除成功！');
          } else {
            message.error(error.message || '系统繁忙，请稍后再试');
          }
        }
      });
    }

    /**
     *  退出登陆
     *  @returns {object} null
     */
    onQuitLoginHandle = async () => {
      this.setState({ canShowOutLoginSpin: true });
      const [error, data] = await loginComponent.quitLoginHandle();
      this.setState({ canShowOutLoginSpin: false });
      if (!error && data) {
        this.props.setUserInfoToStore({ account: '' });
      }
    }

    /**
     *  关闭或展示创建笔记本时显示的modal弹框
     *  @returns {object} null
     */
    onToggleShowCreateNoteModal = (modalVisibled) => {
      this.setState({ modalVisibled });
    }

    /**
     *  显示土川图床
     *  @visible {boolean} 是否显示
     *  @returns {object} null
     */
    onToggleShowImageUploader = (visible) => {
      this.setState({ canShowImageUploader: visible });
    }

    /**
     *  改变编辑模式
     *  @type {string} 是否显示 both一边显示一边编辑，fullPreview，fullEditor
     *  @returns {object} null
     */
    changeEditor = (type) => {
      const { editorInstance } = this.props;
      if (type === 'fullEditor') {
        editorInstance.unwatch();
      }
      if (type === 'fullPreview') {
        // editorInstance.previewing();
      }
      if (type === 'both') {
        editorInstance.watch();
      }
      if (type === 'fullScreen') {
        editorInstance.fullscreen();
      }
      if (type === 'hideToolbae') {
        editorInstance.hideToolbar();
      }
      if (type === 'showToolbae') {
        editorInstance.showToolbar();
      }
      if (type === 'tocDropdown') {
        editorInstance.config({
          tocDropdown: true,
          tocTitle: '目录 Table of Contents'
        });
      }
      if (type === 'tocDefault') {
        editorInstance.config('tocDropdown', false);
      }
    }

    /**
     *  改变页面主题
     *  @type {string} 是否显示 both一边显示一边编辑，fullPreview，fullEditor
     *  @returns {object} null
     */
    onChangeTheme = (checked) => {
      const { editorInstance } = this.props;
      if (!checked) {
        editorInstance.setTheme('dark');
        editorInstance.setEditorTheme('ambiance');
        editorInstance.setPreviewTheme('dark');
      } else {
        editorInstance.setTheme('default');
        editorInstance.setEditorTheme('default');
        editorInstance.setPreviewTheme('3024-day');
      }
    }

    render() {
      const {
        saveStatus, userInfo: {
          account
        }, markdownInfo
      } = this.props;
      const {
        notes, wastepaperBaskets, canShowOutLoginSpin,
        canShowImageUploader, canShowLoadingForGetNotes,
        canShowLoadingForCreateNotes, noteBookName
      } = this.state;
      const menus = (
        <Menu>
          <Menu.Item key="outLogin">
            <div className="nav_outLogin"
              onClick={this.onQuitLoginHandle}>
                        退出登陆
              {canShowOutLoginSpin ? <Spin /> : null}
            </div>
          </Menu.Item>
        </Menu>
      );
      const dropdownLists = (
        <Dropdown overlay={menus}>
          <div className="nav_dropdown_menu">菜单<Icon type="down" /></div>
        </Dropdown>
      );
      const saveIconMapStatus = {
        initial: '',
        pendding: <Icon type="loading"
          className="right_munu_icon right_munu_loading" />,
        success: <Icon type="check"
          className="right_munu_icon right_munu_success" />,
        failed: <Icon type="close"
          className="right_munu_icon right_munu_failed" />
      };
      const noteSubMenus = notes.filter(i => i.note_exist === 1).map(item => {
        item.subNotes = (item.subNotes || []).filter(i => i.sub_note_exist === 1);
        const subNotesJsx = item.subNotes.map(note => {
          return (
            <Menu.Item className="sub_note_item"
              item={note}
              key={note.sub_note_id}>
              {note.sub_note_name}
              <div className="nav-popover-items">
                <Popover placement="right"
                  title={`上次更新：${formatTimeStamp(note.sub_note_last_update)}`}
                  content={createSubNoteIntroduce(note, this)}>
                  <Icon type="info-circle"
                    theme="twoTone" />
                </Popover>
              </div>
            </Menu.Item>
          );
        });
        const createSubNotesButtonJsx = (
          <Menu.Item className="sub_note_item"
            key="create_new_subnote">
            <Button onClick={() => { this.onCreateNewSubNoteHandle(item); }}
              type="dashed"
              block><Icon type="file-add" />创建笔记</Button>
          </Menu.Item>
        );
        const deleteNotesButtonJsx = (
          <Menu.Item className="nav_delete-note"
            key="delete_new_subnote">
            <Button disabled={item.isBeingEdit}
              onClick={() => { this.onDeleteNoteBookHandle(item); }}
              type="danger"
              block><Icon type="delete" />删除笔记</Button>
          </Menu.Item>
        );
        return (
          <SubMenu
            key={item.notebook_id}
            title={<span><Icon type="book" /><span>{item.notebook_name}({item.subNotes.length})</span></span>}>
            {subNotesJsx}
            {createSubNotesButtonJsx}
            {deleteNotesButtonJsx}
          </SubMenu>
        );
      });
      const wastepaperBasketsMenus = (
        <SubMenu
          key="wastepaperBaskets"
          className="wastepaper_basketsMenus"
          title={<span><Icon type="delete" /><span>废纸篓({wastepaperBaskets.length || 0})</span></span>}>
          {
            wastepaperBaskets.map(note => {
              return (
                <Menu.Item className="sub_note_item"
                  item={note}
                  key={note.sub_note_id}>
                  {note.sub_note_name}
                  <Popover placement="right"
                    title="设置"
                    content={createSubNoteSettings(note, this, true)}>
                    <Icon type="setting" />
                  </Popover>
                </Menu.Item>
              );
            })
          }
        </SubMenu>
      );
      const quickSettingJsx = (
        <div className="nav-quick-setting-buttons">
          <Button type="primary"
            onClick={() => { this.changeEditor('fullPreview'); }}>关闭预览</Button>
          <Button type="primary"
            onClick={() => { this.changeEditor('fullEditor'); }}>关闭编辑</Button>
          <Button type="primary"
            onClick={() => { this.changeEditor('both'); }}>恢复默认编辑+预览</Button>
          <Button type="primary"
            onClick={() => { this.changeEditor('fullScreen'); }}>全屏/非全屏</Button>
          <Button type="primary"
            onClick={() => { this.changeEditor('hideToolbae'); }}>关闭工具栏</Button>
          <Button type="primary"
            onClick={() => { this.changeEditor('showToolbae'); }}>显示工具栏</Button>
          <Button type="primary"
            onClick={() => { this.changeEditor('tocDropdown'); }}>收起部分</Button>
          <Button type="primary"
            onClick={() => { this.changeEditor('tocDefault'); }}>全部展开</Button>
        </div>
      );
      return (
        <div className="nav_container">
          <div className="left_munu">土川记</div>
          <div className="right_munu">
            <Switch onChange={this.onChangeTheme}
              className="right_munu-switch-theme"
              checkedChildren="dark"
              unCheckedChildren="light"
              defaultChecked />
            {
              account ? (
                <div className="nav_top_buttons">
                  <Button className="nav_top_button-uploader"
                    type="dashed"
                    onClick={() => { this.onToggleShowImageUploader(true); }}>土川图床</Button>
                  <Button type="primary"
                    loading={canShowLoadingForGetNotes}
                    onClick={this.onDrawerOpenHandle}>我的笔记本</Button>
                </div>
              )
                : (<Button type="primary"
                  onClick={this.onDrawerOpenHandle}>离线笔记本</Button>)
            }
            {/* 菜单 */}
            {account && dropdownLists}
            {/* <div className="nav-theme">
                        <Icon type="heat-map" />
                        主题
                    </div> */}
            {/* 保存笔记状态的icon */}
            {saveIconMapStatus[saveStatus]}
            {/* 登陆按钮 */}
            {!account && (
              <Button className="right_munu_btn"
                onClick={this.doLogin}>登陆</Button>
            )}
          </div>
          <Drawer
            title="土川记"
            placement="left"
            closable={false}
            className="nav-drawer-container"
            onClose={this.onDrawerCloseHandle}
            visible={this.props.canShowDrawer}
          >
            <div className="nav_search">
              <SearchSubNote userInfo={this.props.userInfo}
                onEditSubNoteBookHandle={this.onEditSubNoteBookHandle} />
            </div>
            <Menu
              onClick={this.handleClick}
              style={{ width: 256 }}
              defaultOpenKeys={[]}
              className="nav-notes-container"
              selectedKeys={[this.state.current]}
              mode="inline"
            >
              <Menu.Item key="editor"
                className="drawer_munu_note">
                <div>
                  <Icon type="mail" />
                                笔记本
                </div>
                {account && <Icon type="plus-circle"
                  onClick={() => { this.onToggleShowCreateNoteModal(true); }} />}
              </Menu.Item>
              {noteSubMenus}
              {wastepaperBasketsMenus}
            </Menu>
            {/* TODO 这里加几个好看的页脚 */}
          </Drawer>
          {/* 创建笔记本弹框 */}
          <Modal
            title="新建笔记本"
            okText="确认"
            cancelText="取消"
            destroyOnClose
            visible={this.state.modalVisibled}
            onOk={this.onCreateNewNotebook}
            okButtonProps={({ disabled: !noteBookName, loading: canShowLoadingForCreateNotes })}
            onCancel={() => { this.onToggleShowCreateNoteModal(false); }}
          >
            <Input state="noteBookName"
              onChange={this.onInputValueChange}
              size="large"
              placeholder="请输入笔记名称" />
            <p className="nav_create_note_tip">更多特性,敬请期待...</p>
          </Modal>
          {/* 土川图床 */}
          <ImageUploader
            markdownInfo={markdownInfo}
            canShowModal={canShowImageUploader}
            onToggleShowImageUploader={this.onToggleShowImageUploader} />
          {/* 右下角快捷设置按钮 */}
          <div className="nav-quick-setting">
            <Popover
              placement="left"
              content={quickSettingJsx}
              title="快捷设置"
            >
              <div className="nav-quick-setting-icon">
                <p className="nav-quick-setting-wave"></p>
                <span className="nav-quick-setting-wave"></span>
                <Icon theme="twoTone"
                  className="nav-quick-alert"
                  type="alert" />
              </div>
            </Popover>
          </div>
        </div>
      );
    }
}