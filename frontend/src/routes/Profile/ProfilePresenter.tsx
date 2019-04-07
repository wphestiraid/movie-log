import React, { FunctionComponent } from 'react';
import Helmet from 'react-helmet';
import { ApolloQueryResult } from 'apollo-boost';
import styled from 'styled-components';
import { Alert, Divider, BackTop } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { getProfileData, getRatedMovies } from 'src/types/api';
import { getMovieList, MovieItem } from 'src/types/local';
import ProfileSection from 'src/components/ProfileSection';
import MovieCardList from 'src/components/MovieCardList';
import Loading from 'src/components/Loading';

const MovieListTitle = styled.h1`
  font-size: 20px;
  margin-bottom: 14px;
`;

const DividerWrapper = styled.div`
  margin-bottom: 30px;
`;

interface IProps {
  profileData: getProfileData | undefined;
  ratedMovieData: getRatedMovies | undefined;
  ratedMoviesLoading: boolean;
  movieListData: getMovieList | undefined;
  movieListLoading: boolean;
  onLoadMore: () => Promise<ApolloQueryResult<getRatedMovies>>;
}

const ProfilePresenter: FunctionComponent<IProps> = ({
  profileData,
  ratedMoviesLoading,
  movieListData,
  movieListLoading,
  onLoadMore
}) => {
  if (profileData) {
    const {
      GetUserProfile: { ok: profileOk, user },
      GetUserInfo: { countInfo }
    } = profileData;
    let movieList: MovieItem[] = new Array<MovieItem>();
    if (
      movieListData &&
      movieListData.GetMovieList &&
      movieListData.GetMovieList.movieList
    ) {
      movieList = movieListData.GetMovieList.movieList;
    }
    if (profileOk && user) {
      return (
        <QueueAnim>
          <Helmet>
            <title>'{user.name}'님의 프로필 | Movie-log</title>
          </Helmet>
          <BackTop />
          <div key="profileSection">
            <ProfileSection userData={user} countData={countInfo} />
          </div>
          <MovieCardList
            key="movieCardList"
            loading={ratedMoviesLoading || movieListLoading}
            title={<MovieListTitle>시청한 영화</MovieListTitle>}
            movieList={movieList}
          />
          {countInfo && countInfo.movieRatingCount > movieList.length && (
            <DividerWrapper key="divider">
              <Divider>
                <a onClick={onLoadMore}>더 불러오기</a>
              </Divider>
            </DividerWrapper>
          )}
        </QueueAnim>
      );
    }
    // 프로필이 존재하지 않을 때
    return (
      <>
        <Helmet>
          <title>정보가 존재하지 않습니다. | Movie-log</title>
        </Helmet>
        <QueueAnim>
          <Alert
            key="alert"
            message="Error"
            description="해당 유저의 프로필을 가져올 수 없습니다."
            type="error"
            showIcon={true}
          />
        </QueueAnim>
      </>
    );
  }
  return <Loading />;
};

export default ProfilePresenter;
