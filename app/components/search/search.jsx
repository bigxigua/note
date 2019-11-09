import React, { Component } from 'react';
import Icon from '../icon/icon.jsx';

import './search.css';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

  render() {
    return (
      <div className="Search">
        <Icon type="search" />
        <input type="text"
          placeholder="搜索试试"
          autoComplete="off"
          spellCheck="true"
          className="Search_input" />
      </div>
    );
  }
}