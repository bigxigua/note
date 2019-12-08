import React from 'react';
import Icon from '@common/icon';
import { useHistory } from 'react-router-dom';
import { formatTimeStamp } from '@util/util';
import './index.css';

export default function RecentContent(props) {
  const { type, doc = {}, space = {}, user = {} } = props;
  console.log(props);
  const history = useHistory();
  const onJumpToArticle = (type) => {
    history.push(`/${type}/${doc.doc_id}/?spaceId=${space.space_id}`);
  };
  const typeMap = {
    Edit: {
      img: '/images/documentation.png',
      text: '编辑了文档',
      key: 'doc'
    },
    CreateEdit: {
      img: '/images/create_edit.png',
      text: '创建了文档',
      key: 'doc'
    },
    UpdateEdit: {
      img: '',
      text: '更新了文档',
      key: 'doc'
    },
    DeleteEdit: {
      img: '',
      text: '删除了文档',
      key: 'doc'
    },
    CreateSpace: {
      img: 'images/create_folder.png',
      text: '创建了空间',
      key: 'space'
    },
    UpdateSpace: {
      img: '',
      text: '更新了空间啦',
      key: 'space'
    },
    DeleteSpace: {
      img: '',
      text: '删除了空间',
      key: 'space'
    },
    Share: {
      img: '',
      text: '分享了文档',
      key: 'doc'
    }
  };
  const info = typeMap[type] || {};
  const weightStyle = {
    fontWeight: 600,
    padding: '0 4px'
  };
  console.log(info);
  return (
    <div className="Recent_Content"
      onClick={() => { onJumpToArticle('article'); }}>
      <div className="Recent_Content_Left">
        <img src={info.img} />
        <div className="Recent_Content_Left_Info">
          <p>{props[info.key][info.key === 'space' ? 'name' : 'title']}</p>
          {info.key === 'doc' && <span>所属空间:《{`${space.name}`}》</span>}
          <span>
            <span style={weightStyle}>{user.name}</span>
            在{formatTimeStamp(props[info.key].updated_at)} {info.text}</span>
        </div>
      </div>
      <div className="Recent_Content_Right">
        <Icon
          onClick={(e) => { onJumpToArticle('editor'); e.stopPropagation(); }}
          className="Recent_Content_Item"
          type="edit" />
        <Icon
          className="Recent_Content_Item Recent_Content_Item_More"
          type="ellipsis" />
      </div>
    </div>
  );
};