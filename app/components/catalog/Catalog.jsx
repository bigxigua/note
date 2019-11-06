import React, { Component } from 'react';
import './Catalog.css';

export default class Catalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      catalogs: []
    };
  }

  componentDidMount() {
    const { editorInstance = {} } = this.props;
    editorInstance.settings.onload = function() {
      // TODO 优化 计算量大放worker
      const h1 = this.queryAllTitleElements('.cm-header-1', 'h1', /^#/);
      const h2 = this.queryAllTitleElements('.cm-header-2', 'h2', /^##/);
      const h3 = this.queryAllTitleElements('.cm-header-3', 'h3', /^###/);
      const h4 = this.queryAllTitleElements('.cm-header-4', 'h4', /^####/);
      const catalogs = [].concat(h1, h2, h3, h4).sort((a, b) => { return a.index - b.index; });
      this.setState({ catalogs });
      console.log(catalogs);
    }.bind(this);
  }

  queryAllTitleElements(selector, type, pattern) {
    return Array.from($(selector)).map(h => {
      try {
        const text = h.innerText.replace(pattern, '').trim();
        const index = $(h.parentElement.parentElement.parentElement).index();
        return { index, text, type };
      } catch (error) {
        console.log('[初始化右侧目录] 失败');
      }
    });
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
        <div className="Catalog_title">大纲</div>
        {catalogsJsx}
      </div>
    );
  }
}