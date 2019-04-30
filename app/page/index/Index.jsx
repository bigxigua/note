import React, { Component } from 'react';
import './Index.css';
import Nav from '../../components/nav/Nav.jsx';
import Editor from '../../components/editor/Editor.jsx';

export default class Index extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    render() {
        return (
            <div className="page_container">
                <Nav />
                <Editor />
            </div>
        )
    }
}