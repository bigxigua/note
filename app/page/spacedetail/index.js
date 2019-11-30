import React, { Fragment, useState, useEffect, useContext } from 'react';
import Header from '@components/header/header';
import Chapter from '@components/chapter';
import axiosInstance from '@util/axiosInstance';
import userContext from '@context/user/userContext';
import { parseUrlQuery, getIn } from '@util/util';
import './index.css';

export default function SpaceDetail() {
  const [spaceInfo, setSpaceInfo] = useState({ docs: [], space: {} });
  const { userInfo } = useContext(userContext);
  const { spaceId = '' } = parseUrlQuery();
  async function fetchSpaceInfo() {
    const [, data] = await axiosInstance.get(`space/docs?space_id=${spaceId}`);
    setSpaceInfo({
      docs: getIn(data, ['docs'], []),
      space: getIn(data, ['space'], {})
    });
  }
  useEffect(() => {
    fetchSpaceInfo();
  }, []);
  return (<Fragment>
    <Header />
    <div className="SpaceDetail">
      <h1>{spaceInfo.space.name}</h1>
      <h4>{spaceInfo.space.description}</h4>
      <img src={userInfo.avatar}
        alt="头像" />
      <Chapter spaceInfo={spaceInfo} />
    </div>
  </Fragment>);
}