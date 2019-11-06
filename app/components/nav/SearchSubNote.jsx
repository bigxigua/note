import React, { Component } from 'react';
import { Input, Icon, AutoComplete } from 'antd';
import axiosInstance from '../../util/axiosInstance.js';
import {
  debunce,
  formatTimeStamp
} from '../../util/util.js';

const { Option, OptGroup } = AutoComplete;
function renderTitle(title) {
  return (
    <span>
      {title}
      <span style={{ float: 'right' }}>更多</span>
    </span>
  );
}
export default class SearchSubNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchContent: '', // 搜索关键字
      isSearching: false, // 正在搜索
      searchResults: [{
        title: '笔记本',
        children: []
      }, {
        title: '子笔记',
        children: []
      }, {
        title: '废纸篓',
        children: []
      }] // 搜索结果展示内容
    };
    this.debunceSearchHandle = debunce(() => {
      this.onSearchSubNotes.apply(this);
    }, 500).bind(this);
  }

  componentDidMount() {
  }

  /**
   *  调用搜索接口，获取搜索结果
   *  @returns {object} null
   */
  onSearchSubNotes = async () => {
    const { searchContent, searchResults } = this.state;
    if (!searchContent) return;
    const [error, data] = await axiosInstance.get(`searchSubNote?subNoteName=${searchContent}`);
    this.setState({ isSearching: false });
    if (!error && Array.isArray(data)) {
      searchResults[1].children = data;
    }
    this.setState({ searchResults });
  }

  /**
   *  Search Input输入时，保存搜索条件
   *  @e {object}
   *  @returns {object} null
   */
  onSearchContentChangeHandle = (value) => {
    this.setState({ searchContent: value, isSearching: true });
    if (!value) {
      const { searchResults } = this.state;
      searchResults[1].children = [];
      this.setState({ isSearching: false, searchResults });
    }
    this.debunceSearchHandle();
  }

  /**
  *  搜索结果被选中时触发
  *  @value {string} 选中项的value值
  *  @option {object} 选中项的value值
  *  @returns {object} null
  */
  onSearchContentSelectHandle = (_value, option) => {
    const { subnote } = option.props;
    this.props.onEditSubNoteBookHandle(subnote);
  }

  render() {
    const { searchResults, isSearching, searchContent } = this.state;
    const options = searchResults
      .map(group => (
        <OptGroup key={group.title}
          label={renderTitle(group.title)}
        >
          {group.children.map(opt => (
            <Option key={opt.sub_note_id}
              value={searchContent}
              subnote={opt}
              data={opt.sub_note_id}
            >
              <div className="search-notebook-result">
                <span>{opt.sub_note_name}</span>
                <span className="search-result-lastupdate">上次更新：{formatTimeStamp(opt.sub_note_last_update)}</span>
              </div>
            </Option>
          ))}
        </OptGroup>
      ))
      .concat([
        <Option disabled
          key="all"
          className="show-all"
        >
          <div className="search-result-loading">
            {isSearching ? (<div>正在搜索:<Icon type="loading" /></div>) : '土川记'}
          </div>
        </Option>
      ]);
    return (
      <AutoComplete
        className="certain-category-search"
        dropdownClassName="certain-category-search-dropdown"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 300 }}
        size="large"
        disabled={!this.props.userInfo.account}
        style={{ width: '100%' }}
        onSearch={this.onSearchContentChangeHandle}
        onSelect={this.onSearchContentSelectHandle}
        dataSource={options}
        optionLabelProp="value"
      >
        <Input
          placeholder="查找笔记本"
          prefix={<Icon type="alert"
            style={{ color: 'rgba(0,0,0,.25)' }}
          />}
          suffix={<Icon type="file-search" />}
          allowClear={true}
        />
      </AutoComplete>
    );
  }
};