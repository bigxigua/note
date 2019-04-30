import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
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
        console.log(dropdownLists);
        return (
            <div className="nav_container">
                <div className="left_munu">土川</div>
                <div className="right_munu">
                    {dropdownLists}
                </div>
            </div>
        )
    }
}