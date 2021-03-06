import { gql } from 'apollo-boost';

export const FIND_MOVIE = gql`
  query findMovie($query: String!) {
    FindMovie(query: $query) @client {
      id
      title
      poster_path
      genre_ids
      release_date
    }
  }
`;
