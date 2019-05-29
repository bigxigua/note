// TODO
// 1. 自动保存，loading(编辑)->check(停止编辑) 动画
import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Button, Drawer, Modal, Input, message, Popover } from 'antd';
import LoginComponent from '../login/Login.js';
import axiosInstance from '../../util/axiosInstance.js';
import './Nav.css';
const Search = Input.Search;
const menuJsons = [{
    content: '退出登陆'
}];
const SubMenu = Menu.SubMenu;

function createSubNoteSettings(props, ctx, isWastepaperBaskets) {
    props.isWastepaperBaskets = isWastepaperBaskets;
    return (
        <div className="sub_note_settings">
            <Button type="danger" data-note={props} icon="delete" onClick={ctx.onDeleteSubNoteHandle.bind(ctx, props)}>删除</Button>
            <Button type="primary" icon="file-markdown" onClick={ctx.onEditSubNoteBookHandle.bind(ctx, props)}>编辑</Button>
        </div>
    )
}
export default class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerVisibled: false, // 展示抽屉
            modalVisibled: false, // 展示弹框
            noteBookName: '', // 新建的笔记本名称
            notes: [], // 用户的所有笔记
            wastepaperBaskets: [], // 用户的废纸篓，这里离线模式也可显示
        }
    }
    componentDidMount() {
    }
    // 登陆状态监听
    doLogin = () => {
        const instance = LoginComponent.createInstance();
        LoginComponent.listen('login:change', (info) => {
            if (info) {
                instance.hide();
                this.props.updateUserInfo(info);
            }
        });
    }
    // 打开抽屉
    onDrawerOpenHandle = () => {
        this.setState({ drawerVisibled: true });
        this.onGetUserNotes();
    }
    // 获取用户的所有笔记本(包括废纸篓）
    onGetUserNotes = async () => {
        const [error, data] = await axiosInstance.get('getUserNotes');
        if (!error && Array.isArray(data)) {
            this._resetNoteAndWastepaperBasketsd(data);
        } else {
            message.error((error || {}).message || '获取笔记信息失败，请稍后再试');
        }
    }
    // 工具函数
    // 重新计算笔记本和废纸篓
    _resetNoteAndWastepaperBasketsd = (notes) => {
        let wastepaperBaskets = this.state.wastepaperBaskets;
        notes = notes || this.state.notes;
        notes.forEach(notebook => {
            (notebook.subNotes || []).map(note => {
                if (note.sub_note_exist === 0) {
                    wastepaperBaskets.push(note);
                }
            })
        });
        this.setState({ notes, wastepaperBaskets });
    }
    // end 工具函数
    // 笔记本子笔记标题被点击
    onEditSubNoteBookHandle = (note) => {
        this.props.setInitMarkdownContent(note);
        this.onDrawerCloseHandle();
    }
    // 关闭抽屉
    onDrawerCloseHandle = () => {
        this.setState({ drawerVisibled: false });
    }
    // 输入发生改变
    onInputValueChange = (e) => {
        const value = e.currentTarget.value.trim();
        this.setState({ noteBookName: value });
    }
    // 创建新的笔记本
    onCreateNewNotebook = async () => {
        const { noteBookName, notes } = this.state;
        const [error, data] = await axiosInstance.post('createNotebook', {
            noteBookName
        });
        if (!error && data) {
            this.onHideModalHandle();
            notes.push(data);
            message.success('创建笔记本成功，现在可以记笔记啦');
            this.setState({ notes });
        } else {
            message.error((error || {}).message || '系统繁忙，请稍后再试');
        }
    }
    // 删除笔记本下的子笔记
    onDeleteSubNoteHandle = async ({ sub_note_id, notebook_id }) => {
        Modal.confirm({
            content: (
                <div>
                    <div>您确定要将该笔记移到废纸篓吗？</div>
                    <div>tips: 您可以在废纸篓恢复此文档</div>
                </div>
            ),
            okText: '确认',
            onOk: async () => {
                const [error, data] = await axiosInstance.post('deleteSubNote', {
                    type: 1,
                    subNoteId: sub_note_id
                });
                if (!error) {
                    let { notes } = this.state;
                    const curNoteBookIndex = notes.findIndex(n => n.notebook_id === notebook_id);
                    if (curNoteBookIndex !== -1) {
                        const curSubNoteIndex = notes[curNoteBookIndex].subNotes.findIndex(n => n.sub_note_id === sub_note_id);
                        notes[curNoteBookIndex].subNotes[curSubNoteIndex].sub_note_exist = 0;
                        this._resetNoteAndWastepaperBasketsd(notes);
                    }
                }
                console.log(error, data);
            },
            cancelText: '我在想想'
        });
    }
    // 新增笔记本下的子笔记
    onCreateNewSubNoteHandle = async ({ notebook_id }) => {
        message.loading('正在为您创建笔记', 0);
        const [error, data] = await axiosInstance.post('createSubNotebook', {
            notebookId: notebook_id,
            subNoteTitle: 'TEST',
        });
        message.destroy();
        if (!error && data.notebook_id) {
            message.success('笔记创建成功', 1);
            let { notes } = this.state;
            const curIndex = notes.findIndex(n => n.notebook_id === data.notebook_id);
            if (curIndex !== -1) {
                notes[curIndex].subNotes.push(data);
            }
            this.setState({ notes });
        } else {
            message.error((error || {}).message || '系统开小差啦，稍等试试吧', 2);
        }
    }
    // 退出登陆
    onQuitLoginHandle = async () => {
        
    }
    // 关闭modal
    onHideModalHandle = () => {
        this.setState({ modalVisibled: false });
    }
    // 展示modal
    onShowModalHandle = async () => {
        this.setState({ modalVisibled: true });
    }
    render() {
        const menus = (
            <Menu>
                <Menu.Item key="outLogin">
                    <div className="nav_outLogin" onClick={this.onQuitLoginHandle}>退出登陆</div>
                </Menu.Item>
            </Menu>
        );
        const dropdownLists = (
            <Dropdown overlay={menus}>
                <div className="nav_dropdown_menu">菜单<Icon type="down" /></div>
            </Dropdown>
        );
        const { saveStatus, userInfo: {
            account
        } } = this.props;
        const { notes, wastepaperBaskets } = this.state;
        const saveIconMapStatus = {
            initial: '',
            pendding: <Icon type="loading" className="right_munu_icon right_munu_loading" />,
            success: <Icon type="check" className="right_munu_icon right_munu_success" />,
            failed: <Icon type="close" className="right_munu_icon right_munu_failed" />
        };
        const noteSubMenus = notes.filter(i => i.note_exist === 1).map(item => {
            item.subNotes = (item.subNotes || []).filter(i => i.sub_note_exist === 1);
            let subNotesJsx = item.subNotes.map(note => {
                return (
                    <Menu.Item className="sub_note_item" item={note} key={note.sub_note_id}>
                        {note.sub_note_title}
                        <Popover placement="right" title="设置" content={createSubNoteSettings(note, this)}>
                            <Icon type="setting" />
                        </Popover>
                    </Menu.Item>
                )
            });
            let createSubNotesJsx = (
                <Menu.Item className="sub_note_item" key="create_new_subnote">
                    <Button onClick={() => { this.onCreateNewSubNoteHandle(item) }} type="dashed" block><Icon type="file-add" />创建笔记</Button>
                </Menu.Item>
            );
            return (
                <SubMenu
                    key={item.notebook_id}
                    title={<span><Icon type="book" /><span>{item.notebook_name}</span></span>}>
                    {subNotesJsx}
                    {createSubNotesJsx}
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
                            <Menu.Item className="sub_note_item" item={note} key={note.sub_note_id}>
                                {note.sub_note_title}
                                <Popover placement="right" title="设置" content={createSubNoteSettings(note, this, true)}>
                                    <Icon type="setting" />
                                </Popover>
                            </Menu.Item>
                        )
                    })
                }
            </SubMenu>
        )
        return (
            <div className="nav_container">
                <div className="left_munu">土川记</div>
                <div className="right_munu">
                    {
                        account && <Button type="primary" onClick={this.onDrawerOpenHandle}>我的笔记本</Button>
                    }
                    {/* 菜单 */}
                    {dropdownLists}
                    {/* 保存笔记状态的icon */}
                    {saveIconMapStatus[saveStatus]}
                    {/* 登陆按钮 */}
                    {!account && (
                        <Button className="right_munu_btn" onClick={this.doLogin}>登陆</Button>
                    )}
                </div>
                <Drawer
                    title="土川记"
                    placement="left"
                    closable={false}
                    onClose={this.onDrawerCloseHandle}
                    visible={this.state.drawerVisibled}
                >
                    <div className="nav_search">
                        <Search
                            placeholder="查找笔记本"
                            onSearch={value => console.log(value)}
                            style={{ width: 241 }}
                        />
                    </div>
                    <Menu
                        onClick={this.handleClick}
                        style={{ width: 256 }}
                        defaultOpenKeys={['sub1']}
                        selectedKeys={[this.state.current]}
                        mode="inline"
                    >
                        <Menu.Item key="editor" className="drawer_munu_note">
                            <div>
                                <Icon type="mail" />
                                笔记本
                            </div>
                            <Icon type="plus-circle" onClick={this.onShowModalHandle} />
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
                    visible={this.state.modalVisibled}
                    onOk={this.onCreateNewNotebook}
                    onCancel={this.onHideModalHandle}
                >
                    <Input onChange={this.onInputValueChange} size="large" placeholder="请输入笔记名称" />
                    <p className="nav_create_note_tip">更多特性,敬请期待...</p>
                </Modal>
            </div>
        )
    }
}