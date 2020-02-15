import React, { Fragment, useState, useEffect, useCallback, useContext, useRef } from 'react';
import Header from '@components/header/header';
import Footer from '@components/footer';
import Loading from '@common/loading';
import Modal from '@common/modal';
import Input from '@common/input';
import Icon from '@common/icon';
import ChapterWrapper from '@components/chapter';
import axiosInstance from '@util/axiosInstance';
import userContext from '@context/user/userContext';
import useMessage from '@hooks/use-message';
import { parseUrlQuery, getIn, checkBrowser } from '@util/util';
import './index.css';

const inputStyle = {
  width: '100%',
  height: '36px',
  marginBottom: '10px'
};

const message = useMessage();

export default function SpaceDetail() {
  const [spaceInfo, setSpaceInfo] = useState({ docs: [], space: {} });
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [spaceDesc, setspaceDesc] = useState('');
  const { userInfo } = useContext(userContext);
  const { spaceId = '' } = parseUrlQuery();
  const { isMobile } = checkBrowser();

  const fetchSpaceInfo = useCallback(async () => {
    setLoading(true);
    const [, data] = await axiosInstance.get(`space/docs?space_id=${spaceId}`);
    setLoading(false);
    setSpaceInfo({
      docs: getIn(data, ['docs'], []),
      space: getIn(data, ['space'], {})
    });
    setSpaceName(getIn(data, ['space', 'name'], ''));
    setspaceDesc(getIn(data, ['space', 'description'], ''));
  }, []);

  const onUpdateSpaceInfo = useCallback(async () => {
    if (!spaceName) {
      message.error({ content: '空间名称不可为空' });
      return;
    }
    const [error, data] = await axiosInstance.post('spaces/update', {
      space_id: spaceId,
      name: spaceName,
      description: spaceDesc
    });
    if (!error && getIn(data, ['STATUS']) === 'OK') {
      message.success({ content: '更新成功' });
      setVisible(false);
      setSpaceInfo({
        ...spaceInfo,
        space: {
          ...spaceInfo.space,
          name: spaceName,
          description: spaceDesc
        }
      });
    } else {
      message.error({ content: getIn(error, ['message'], '系统繁忙，请稍后再试') });
    }
    console.log(error, data);
  }, [spaceName, spaceDesc, spaceInfo]);

  useEffect(() => {
    fetchSpaceInfo();
  }, []);

  return (<Fragment>
    <Header className="space-detail__header" />
    <div className={`space-detail${isMobile ? ' space-detail_mobile' : ''}`}>
      <div className="space-detail__title">
        <span>{spaceInfo.space.name}</span>
        <div onClick={(() => { setVisible(true); })}>
          <Icon type="edit" />
          编辑
        </div>
      </div>
      <h4>{spaceInfo.space.description}</h4>
      <img src={userInfo.avatar}
        alt="头像" />
      <Loading show={loading}
        className="space-detail__loading" />
      <ChapterWrapper
        userInfo={userInfo}
        spaceInfo={spaceInfo} />
    </div>
    <Modal
      title="修改空间信息"
      onCancel={() => { setVisible(false); }}
      onConfirm={onUpdateSpaceInfo}
      visible={visible} >
      <Input
        addonBefore="空间名称"
        defaultValue={spaceInfo.space.name}
        onChange={(e) => { setSpaceName(e.currentTarget.value); }}
        style={inputStyle} />
      <Input
        addonBefore="空间描述"
        defaultValue={spaceInfo.space.description}
        onChange={(e) => { setspaceDesc(e.currentTarget.value); }}
        style={inputStyle} />
    </Modal>
    <Footer />
  </Fragment>);
}