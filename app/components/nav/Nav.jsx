// TODO
// 1. 自动保存，loading(编辑)->check(停止编辑) 动画
import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Button } from 'antd';
import LoginComponent from '../login/Login.js';
import './Nav.css';
const menuJsons = [{
    title: '返回首页',
    href: '',
    subItems: [{
        href: '',
        content: '111'
    }]
}, {
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
export default class Nav extends Component {
    constructor(props) {
        super(props);
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
                    { dropdownLists }
                    { saveIconMapStatus[saveStatus] }
                    { !account &&  (
                       <Button className="right_munu_btn" onClick={this.doLogin}>登陆</Button>
                    )}
                </div>
            </div>
        )
    }
}