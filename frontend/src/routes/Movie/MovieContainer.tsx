import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Query, Mutation, MutationFn } from 'react-apollo';
import {
  getMovieDetail,
  setMovieRating,
  setMovieRatingVariables
} from 'src/types/api';
import MoviePresenter from './MoviePresenter';
import { GET_MOVIE_DETAIL, SET_MOVIE_RATING } from './MovieQueries';
import Loading from 'src/components/Loading';

interface IState {
  rating: number;
}

interface IProps extends RouteComponentProps<any> {
  setMovieRating?: MutationFn | null;
}

class MovieDetailQueries extends Query<getMovieDetail> {}

class MovieRatingMutation extends Mutation<
  setMovieRating,
  setMovieRatingVariables
> {}

export class MovieContainer extends Component<IProps, IState> {
  private setMovieRatingFn: MutationFn;

  constructor(props: IProps) {
    super(props);
  }

  public handleClickMovieRating = (rating: number) => {
    const {
      match: {
        params: { movieId }
      }
    } = this.props;
    this.setMovieRatingFn({
      variables: { movieId, rating },
      optimisticResponse: {
        SetMovieRating: {
          __typename: 'SetMovieRatingResponse',
          ok: rating ? true : false,
          type: null,
          error: null,
          movieRating: {
            __typename: 'MovieRating',
            id: null,
            rating,
            userId: null,
            movieId,
            createdAt: new Date().toString()
          }
        }
      },
      update: (store, { data: { SetMovieRating } }) => {
        const data = store.readQuery({
          query: GET_MOVIE_DETAIL,
          variables: { movieId }
        });
        const newData = {
          ...data,
          GetMovieRating: SetMovieRating
        };
        store.writeQuery({ query: GET_MOVIE_DETAIL, data: newData });
      },
      refetchQueries: () => ['getMovieDetail']
    });
  };

  public render() {
    const {
      match: {
        params: { movieId }
      }
    } = this.props;
    return (
      <MovieDetailQueries query={GET_MOVIE_DETAIL} variables={{ movieId }}>
        {({ data, loading }) =>
          loading ? (
            <Loading />
          ) : (
            <MovieRatingMutation mutation={SET_MOVIE_RATING}>
              {setMovieRatingFn => {
                this.setMovieRatingFn = setMovieRatingFn;
                return (
                  <MoviePresenter
                    data={data}
                    handleClickMovieRating={this.handleClickMovieRating}
                  />
                );
              }}
            </MovieRatingMutation>
          )
        }
      </MovieDetailQueries>
    );
  }
}

export default MovieContainer;
