import React from 'react';
import { Icon, List } from 'xigua-components/dist/js';
import Popover from '@components/popover';
import { useHistory, Link } from 'react-router-dom';
import { getIn, isEmptyObject, checkBrowser } from '@util/util';
import { fromNow } from '@util/fromNow';
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
    img: '/images/add_file.png',
    text: '创建了文档',
    action: ['edit'],
    iconStyle: { width: '26px' },
    key: 'doc'
  },
  UpdateEdit: {
    img: '/images/update.png',
    text: '更新了文档',
    action: ['edit'],
    iconStyle: { width: '24px' },
    key: 'doc'
  },
  PhysicalDeleteEdit: {
    img: '/images/file_delete.svg',
    text: '彻底删除了文档',
    iconStyle: { width: '30px' },
    key: 'doc'
  },
  LogicalDeleteEdit: {
    img: '/images/file_delete.svg',
    text: '移除了文档',
    key: 'doc'
  },
  CreateSpace: {
    img: '/images/folder_create.svg',
    text: '创建了空间',
    action: ['management'],
    key: 'space'
  },
  DeleteSpace: {
    img: '/images/delete_folder.svg',
    text: '删除了空间',
    iconStyle: {
      width: '26px'
    },
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
  const { type, space_id: spaceId } = props;
  const docId = getIn(props, ['doc', 'doc_id'], props.doc_id || '');
  if (info.key === 'space') {
    if (type !== 'DeleteSpace') {
      history.push(`/spacedetail?spaceId=${spaceId}`);
    }
  } else if (info.key === 'doc' && !['LogicalDeleteEdit', 'PhysicalDeleteEdit'].includes(props.type)) {
    history.push(`/article/${docId}/?spaceId=${spaceId}`);
  } else if (info.key === 'editor') {
    history.push(`/simditor/${docId}/?spaceId=${spaceId}`);
  }
}

// popver下拉项点击
async function onPopoverItemClick({ props = {}, key = '' }, e, onRecentAction) {
  e.stopPropagation();
  if (key === 'remove') {
    const [error, data] = await axiosInstance.post('delete/recent', { id: props.id });
    if (getIn(data, ['STATUS']) === 'OK') {
      onRecentAction('remove', props);
    } else {
      message.error({ content: getIn(error, ['message'], '系统繁忙') });
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
        className="recent-content__item"
        type="edit" />;
    } else if (n === 'management') {
      return <Link
        key={n}
        style={{ color: '#25b864' }}
        to={`/spacedetail?spaceId=${props.space_id}`}>
        管理
      </Link>;
    } else if (n === 'more') {
      return <Popover
        content={
          <List
            style={{ boxShadow: 'none', padding: 0 }}
            onTap={(info, index, event) => { onPopoverItemClick(info, event, onRecentAction); }}
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
  const {
    type,
    space = {},
    doc = {},
    user = {},
    update_at,
    onRecentAction,
    doc_title,
    space_name
  } = props;
  const { isMobile } = checkBrowser();
  const history = useHistory();
  const info = typeMap[type] || {};
  const weightStyle = { fontWeight: 600 };
  const title = getIn(props[info.key], [info.key === 'space' ? 'name' : 'title'], doc_title);
  const isDeleteAction = ['LogicalDeleteEdit', 'PhysicalDeleteEdit'].includes(type);
  const spaceUrl = `spacedetail?spaceId=${space.space_id}`;
  let classes = 'recent-content ';
  classes += `${isDeleteAction ? 'recent-content__deleted' : ''} `;
  classes += `${isMobile ? 'recent-content__mobile' : ''}`;
  // 如果当前文档已被删除，则不展示之前的操作记录
  if (!isDeleteAction && info.key === 'doc' && isEmptyObject(doc)) {
    return null;
  }
  const iconWidth = getIn(info, ['iconStyle', 'width'], '29px');
  const key = info.key;
  return (
    <div className={$.trim(classes)}
      onClick={(e) => { handleClick(info, props, history, e); }}>
      <div className="recent-content__left">
        <img src={info.img}
          style={{ width: iconWidth }} />
        <div className="recent-content__left-info">
          {key !== 'space' && <p className="ellipsis">{title}</p>}
          {key === 'doc' &&
            <div className="ellipsis"
              onClick={(e) => { e.stopPropagation(); }}>
              所属空间:<Link to={spaceUrl}>《{`${space.name || space_name}`}》</Link>
            </div>
          }
          <span>
            <span style={weightStyle}>{user.name}</span>
            <span>
              · {fromNow(update_at)} {info.text}
              {info.key === 'space' && <span style={{ fontWeight: 'bold', cursor: 'pointer' }}
                className={`${space.id ? '' : 'recent-content__normal'}`}
              >《{space_name || getIn(space, ['name'])}》</span>}
            </span>
          </span>
        </div>
      </div>
      <div className="recent-content__right">
        {renderAction(info, props, history, onRecentAction)}
      </div>
    </div>
  );
};