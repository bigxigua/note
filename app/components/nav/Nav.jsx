// TODO
// 1. 自动保存，loading(编辑)->check(停止编辑) 动画
import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Button, Drawer, Modal, Input } from 'antd';
import LoginComponent from '../login/Login.js';
import axiosInstance from '../../util/axiosInstance.js';
import './Nav.css';
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
            noteBookName: ''
        }
    }
    componentDidMount() {
        console.log(this.props);
    }
    doLogin = () => {
        const instance = LoginComponent.createInstance();
        LoginComponent.listen('login:change', (info) => {
            if (info) {
                instance.hide();
                this.props.updateUserInfo(info);
            }
        });
    }
    onDrawerOpenHandle = () => {
        this.setState({ drawerVisibled: true });
    }
    onDrawerCloseHandle = () => {
        this.setState({ drawerVisibled: false });
    }
    onInputValueChange = (e) => {
        const value = e.currentTarget.value.trim();
        this.setState({ noteBookName: value });
    }
    onCreateNewNotebook = async () => {
        const { noteBookName } = this.state;
        const [error, data] = await axiosInstance.post('updateDraft', {
            noteBookName
        });
    }
    onHideModalHandle = () => {
        this.setState({ modalVisibled: false });
    }
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
        const saveIconMapStatus = {
            initial: '',
            pendding: <Icon type="loading" className="right_munu_icon right_munu_loading" />,
            success: <Icon type="check" className="right_munu_icon right_munu_success" />,
            failed: <Icon type="close" className="right_munu_icon right_munu_failed" />
        };
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
                    <Menu
                        onClick={this.handleClick}
                        style={{ width: 256 }}
                        defaultOpenKeys={['sub1']}
                        selectedKeys={[this.state.current]}
                        mode="inline"
                    >
                        <Menu.Item key="editor" className="drawer_munu_item">
                            <div>
                                <Icon type="mail" />
                                笔记本({'0'})
                            </div>
                            <Icon type="plus-circle" onClick={this.onShowModalHandle} />
                        </Menu.Item>
                        {/* <SubMenu key="sub4" title={<span><Icon type="delete" /><span>废纸篓</span></span>}>
                            <Menu.Item key="9">Option 9</Menu.Item>
                            <Menu.Item key="10">Option 10</Menu.Item>
                            <Menu.Item key="11">Option 11</Menu.Item>
                            <Menu.Item key="12">Option 12</Menu.Item>
                        </SubMenu> */}
                        <Menu.Item key="basket">
                            <Icon type="delete" />
                            废纸篓({'0'})
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