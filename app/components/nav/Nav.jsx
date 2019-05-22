// TODO
// 1. 自动保存，loading(编辑)->check(停止编辑) 动画
import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Button, Drawer, Modal, Input, message, Popover } from 'antd';
import LoginComponent from '../login/Login.js';
import axiosInstance from '../../util/axiosInstance.js';
import './Nav.css';
const Search = Input.Search;
const menuJsons = [{
    title: '菜单',
    href: '',
    subItems: [{
        href: '',
        content: '222'
    }]
}];
function createSubMenu(menu) {
    const menuItems = menu.map(i => {
        return (
            <Menu.Item key={i.content}>
                <a target="_blank" rel="noopener noreferrer" href={i.href}>{i.content}</a>
            </Menu.Item>
        );
    });
    return (
        <Menu>
            {menuItems}
        </Menu>
    )
};
const SubMenu = Menu.SubMenu;
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
            this.setState({ notes: data });
        } else {
            message.error((error || {}).message || '获取笔记信息失败，请稍后再试');
        }
        console.log(error, data);
    }
    // 笔记本子笔记标题被点击
    onSubNoteTitleClick = (e) => {
        this.props.setInitMarkdownContent(e.item.props.item);
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
        console.log(error, data);
    }
    // 删除笔记本下的子笔记
    onDeleteSubNoteHandle = async () => {
    }
    // 新增笔记本下的子笔记
    onCreateNewSubNoteHandle = async () => {
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
        const dropdownLists = menuJsons.map(i => {
            return (
                <Dropdown overlay={createSubMenu(i.subItems)} key={i.title}>
                    <a className="right_munu-dropdown-link" href="#">
                        {i.title}<Icon type="down" />
                    </a>
                </Dropdown>
            )
        });
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
        const subNoteSettings = (
            <div class="sub_note_settings">
                <Button type="danger" icon="delete" onClick={this.onDeleteSubNoteHandle}>删除</Button>
                <Button type="primary" icon="file-add" onClick={this.onCreateNewSubNoteHandle}>新增</Button>
                <Button type="primary" icon="file-markdown" onClick={this.onCreateNewSubNoteHandle}>编辑</Button>
            </div>
        );
        const noteSubMenus = notes.map(item => {
            return (
                <SubMenu
                    key={item.notebook_id}
                    title={<span><Icon type="book" /><span>{item.notebook_name}</span></span>}>
                    {
                        (item.subNotes || []).map(note => {
                            return (
                                <Menu.Item onClick={this.onSubNoteTitleClick} className="sub_note_item" item={note} key={note.sub_note_id}>
                                    {note.sub_note_title}
                                    <Popover placement="right" title="设置" content={subNoteSettings}>
                                        <Icon type="setting" />
                                    </Popover>
                                </Menu.Item>
                            )
                        })
                    }
                </SubMenu>
            );
        });
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
                        <Menu.Item key="basket" className="drawer_munu_basket">
                            <Icon type="delete" />
                            废纸篓({wastepaperBaskets.length || 0})
                        </Menu.Item>
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