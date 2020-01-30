import React, { Fragment, useState, useEffect, useCallback, useContext } from 'react';
import Header from '@components/header/header';
import Footer from '@components/footer';
import Loading from '@common/loading';
import ChapterWrapper from '@components/chapter';
import axiosInstance from '@util/axiosInstance';
import userContext from '@context/user/userContext';
import { parseUrlQuery, getIn, checkBrowser } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

export default function SpaceDetail() {
  const [spaceInfo, setSpaceInfo] = useState({ docs: [], space: {} });
  const [loading, setLoading] = useState(false);
  const { userInfo } = useContext(userContext);
  const { spaceId = '' } = parseUrlQuery();

  const fetchSpaceInfo = useCallback(async () => {
    setLoading(true);
    const [, data] = await axiosInstance.get(`space/docs?space_id=${spaceId}`);
    setLoading(false);
    setSpaceInfo({
      docs: getIn(data, ['docs'], []),
      space: getIn(data, ['space'], {})
    });
  }, []);

  useEffect(() => {
    fetchSpaceInfo();
  }, []);

  return (<Fragment>
    <Header className="space_detail_header" />
    <div className={`space-detail${isMobile ? ' space-detail_mobile' : ''}`}>
      <h1>{spaceInfo.space.name}</h1>
      <h4>{spaceInfo.space.description}</h4>
      <img src={userInfo.avatar}
        alt="头像" />
      <Loading show={loading}
        className="space-detail__loading" />
      <ChapterWrapper
        userInfo={userInfo}
        spaceInfo={spaceInfo} />
      {/* {loading
        ? <Loading show={loading}
          className="space-detail__loading" />
        : <ChapterWrapper
          userInfo={userInfo}
          spaceInfo={spaceInfo} />} */}
    </div>
    <Footer />
  </Fragment>);
}