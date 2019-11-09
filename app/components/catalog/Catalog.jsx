import React, { Component } from 'react';
import './Catalog.css';
import {
  debunce
} from '../../util/util.js';

export default class Catalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      catalogs: []
    };
  }

  componentDidMount() {
    const { editorInstance = {} } = this.props;
    const debunceQueryAllTitleElements = debunce(function () {
      this.queryAllTitleElements.apply(this, arguments);
    }).bind(this);
    editorInstance.settings.onload = function() {
      this.queryAllTitleElements(editorInstance);
      editorInstance.cm.on('change', () => {
        debunceQueryAllTitleElements(editorInstance);
      });
    }.bind(this);
  }

  queryAllTitleElements(editor) {
    const d = Date.now();
    const $html = $(editor.getHtmlFromMarkDown());
    const catalogs = [];
    Array.from($html).forEach((dom, index) => {
      const tagName = dom.tagName;
      if (['H1', 'H2', 'H3', 'H4'].includes(tagName)) {
        console.log();
        catalogs.push({
          index,
          text: $(dom).children('a').attr('name'),
          type: tagName.toLowerCase()
        });
      }
    });
    this.setState({ catalogs });
    console.log('[初始化右侧目录] ', catalogs);
    console.log('[更新右侧目录耗时] ', `${Date.now() - d}ms`);
    return catalogs;
  }

  render() {
    const { catalogs = [] } = this.state;
    const catalogsJsx = catalogs.map(p => {
      return (
        <div
          className="Catalog_item"
          key={p.index}>
          <span className={'Catalog_item_' + p.type}>{p.text}</span>
        </div>
      );
    });
    return (
      <div className="Catalog_container">
        <div className="Catalog_title">文章目录</div>
        <div className="Catalog_box">{catalogsJsx}</div>
      </div>
    );
  }
}