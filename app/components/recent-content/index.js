import React from 'react';
import Icon from '@common/icon';
import { useHistory } from 'react-router-dom';
import { formatTimeStamp, getIn } from '@util/util';
import Button from '@common/button';
import Tag from '@common/tag';
import './index.css';

const typeMap = {
  Edit: {
    img: '/images/documentation.png',
    text: '编辑了文档',
    action: ['edit'],
    key: 'doc'
  },
  CreateEdit: {
    img: '/images/create_edit.png',
    text: '创建了文档',
    action: ['edit'],
    key: 'doc'
  },
  UpdateEdit: {
    img: '/images/update.png',
    text: '更新了文档',
    action: ['edit'],
    key: 'doc'
  },
  DeleteEdit: {
    img: '/images/delete.png',
    text: '删除了文档',
    action: ['restore-doc', 'delete'],
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
  // DeleteSpace: {
  //   img: '',
  //   text: '删除了空间',
  //   action: ['restore-space'],
  //   key: 'space'
  // },
  Share: {
    img: '',
    text: '分享了文档',
    key: 'doc'
  }
};

function onRestore(e) {
  // TODO 恢复文档
  e.stopPropagation();
}

// 点击每一项的跳转行为
function handleClick(info, props, history) {
  const spaceId = getIn(props, ['space', 'space_id'], '');
  const docId = getIn(props, ['doc', 'doc_id'], '');
  if (info.key === 'space') {
    history.push(`/spacedetail?spaceId=${spaceId}`);
  } else if (info.key === 'doc') {
    history.push(`/article/${docId}/?spaceId=${spaceId}`);
  } else if (info.key === 'editor') {
    history.push(`/editor/${docId}/?spaceId=${spaceId}`);
  }
}
// 渲染右侧可操作项
function renderAction({ action = [], key }, props, history) {
  return action.map(n => {
    if (n === 'edit') {
      return <Icon
        key={key}
        onClick={(e) => { handleClick({ key: 'editor' }, props, history); e.stopPropagation(); }}
        className="Recent_Content_Item"
        type="edit" />;
    } else if (n === 'restore-doc') {
      return <Tag content="恢复"
        key={key}
        onClick={(e) => { onRestore(e); }}
        color="#25b864" />;
    } else if (n === 'delete') {
      return <Tag content="彻底删除"
        key={key}
        onClick={(e) => { onRestore(e); }}
        color="#25b864" />;
    }
  });
};

export default function RecentContent(props) {
  const { type, doc = {}, space = {}, user = {} } = props;
  const history = useHistory();
  const info = typeMap[type] || {};
  const weightStyle = {
    fontWeight: 600,
    padding: '0 4px'
  };
  return (
    <div className="Recent_Content"
      onClick={() => { handleClick(info, props, history); }}>
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
        {renderAction(info, props, history)}
      </div>
    </div>
  );
};