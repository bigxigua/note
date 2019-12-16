import React from 'react';
import Icon from '@common/icon';
import List from '@common/list';
import Tag from '@common/tag';
import Popover from '@components/popover';
import { useHistory, Link } from 'react-router-dom';
import { formatTimeStamp, getIn } from '@util/util';
import axiosInstance from '@util/axiosInstance';
import useMessage from '@hooks/use-message';
import './index.css';

const message = useMessage();

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
  PhysicalDeleteEdit: {
    img: '/images/delete.png',
    text: '彻底删除了文档',
    key: 'doc'
  },
  LogicalDeleteEdit: {
    img: '/images/delete.png',
    text: '移除了文档',
    action: ['restore-doc', 'delete'],
    key: 'doc'
  },
  CreateSpace: {
    img: 'images/create_folder.png',
    text: '创建了空间',
    action: ['management'],
    key: 'space'
  },
  UpdateSpace: {
    img: '',
    text: '更新了空间啦',
    action: ['management'],
    key: 'space'
  },
  Share: {
    img: '',
    text: '分享了文档',
    key: 'doc'
  }
};

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

// popver下拉项点击
async function onPopoverItemClick({ props = {}, key = '' }, e, onRecentAction) {
  e.stopPropagation();
  if (key === 'remove') {
    const [, data] = await axiosInstance.post('delete/recent', { id: props.id });
    if (getIn(data, ['STATUS']) === 'OK') {
      onRecentAction('remove', props);
    } else {
      message.error({ content: '系统开小差啦，请稍后再试' });
    }
  }
}

// 渲染右侧可操作项
function renderAction({ action = [] }, props, history, onRecentAction) {
  return action.concat(['more']).map(n => {
    if (n === 'edit') {
      return <Icon
        key={n}
        onClick={(e) => { handleClick({ key: 'editor' }, props, history); e.stopPropagation(); }}
        className="Recent_Content_Item"
        type="edit" />;
    } else if (n === 'restore-doc') {
      return <Tag content="可恢复"
        key={n}
        onClick={(e) => e.stopPropagation()}
        color="#25b864" />;
    } else if (n === 'delete') {
      return <Tag content="已删除"
        key={n}
        onClick={(e) => e.stopPropagation()}
        style={{ marginLeft: '10px' }}
        color="rgb(255, 85, 0)" />;
    } else if (n === 'management') {
      return <Link
        key={n}
        style={{ color: 'rgb(16, 142, 233)' }}
        to={`/spacedetail?spaceId=${props.space_id}`}>
        管理
      </Link>;
    } else if (n === 'more') {
      return <Popover
        content={
          <List
            style={{ boxShadow: 'none', padding: 0 }}
            onTap={(info, inex, event) => { onPopoverItemClick(info, event, onRecentAction); }}
            list={[{
              text: '移除记录',
              key: 'remove',
              icon: 'delete',
              props
            }
            ]} />
        }
        key={'more'}><Icon type="ellipsis"
          className="Space_Operation_Icon" /></Popover>;
    }
  });
};

export default function RecentContent(props) {
  const { type, space = {}, user = {}, created_at, onRecentAction } = props;
  const history = useHistory();
  const info = typeMap[type] || {};
  const weightStyle = {
    fontWeight: 600
  };
  const title = getIn(props[info.key], [info.key === 'space' ? 'name' : 'title'], '');
  return (
    <div className="Recent_Content"
      onClick={() => { handleClick(info, props, history); }}>
      <div className="Recent_Content_Left">
        <img src={info.img} />
        <div className="Recent_Content_Left_Info">
          <p className="ellipsis">{title}</p>
          {info.key === 'doc' && <span className="ellipsis">所属空间:《{`${space.name}`}》</span>}
          <span>
            <span style={weightStyle}>{user.name}</span>
            在{formatTimeStamp(+created_at)} {info.text}</span>
        </div>
      </div>
      <div className="Recent_Content_Right">
        {renderAction(info, props, history, onRecentAction)}
      </div>
    </div>
  );
};