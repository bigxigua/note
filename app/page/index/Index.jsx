import React, { Component } from 'react';
import Header from '../../components/header/header.jsx';
import './Index.css';
export default class Index extends Component {
  componentDidMount() {
    // 隐藏骨架屏
    const skeletonDom = document.querySelector('.skeleton');
    document.body.removeChild(skeletonDom);
  }

  render() {
    // const {
    // } = this.props;
    return (
      <div className="page_container">
        <Header />
      </div>
    );
  }
}