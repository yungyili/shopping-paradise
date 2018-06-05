import axios from 'axios';
import {
  FETCHING_CATEGORY,
  FETCH_CATEGORY_OK,
  FETCH_CATEGORY_FAIL
} from './actionTypes';

  export const fetchCategory = (categoryId) =>
    async (dispatch) => {
      dispatch({
        type: FETCHING_CATEGORY,
        payload: null
      });

      const url = `/api/category/${categoryId? categoryId:'root'}`;
      console.log('fetchCategory: ', url);

      await axios
        .get(url)
        .then(res => {
          dispatch({
            type: FETCH_CATEGORY_OK,
            payload: {
              content: res.data,
              error: null
            }
          });
        })
        .catch(err => {
          dispatch({
            type: FETCH_CATEGORY_FAIL,
            payload: {
              content: null,
              error: err
            }
          });
        });
      };
