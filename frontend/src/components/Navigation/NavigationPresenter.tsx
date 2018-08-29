import React from 'react';
import { Input, Avatar } from 'antd';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const HeaderSearch = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const SearchField = styled(Input.Search)`
  width: 640px;
  margin: 8px 8px 8px 8px;
`;

const NavigationPresenter: React.SFC = () => (
  <React.Fragment>
    <HeaderContainer>
      <div>Movie.log</div>
      <div>
        <Avatar size={32} icon="user" />
      </div>
    </HeaderContainer>
    <HeaderSearch>
      <SearchField placeholder="영화 제목을 검색해보세요." />
    </HeaderSearch>
  </React.Fragment>
);

export default NavigationPresenter;
