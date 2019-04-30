import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import './Editor.css';

export default class Editor extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const { $, editormd } = window;
        $(function() {
            var editor = editormd("editormd", {
                path : "/editor/lib/" // Autoload modules mode, codemirror, marked... dependents libs path
            });
        });
    }
    render() {
        return (
            <div className="editor_container" id="editormd">
            </div>
        )
    }
}