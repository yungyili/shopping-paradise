import axios from 'axios';
import {
  FETCHING_ITEM,
  FETCH_ITEM_OK,
  FETCH_ITEM_FAIL
} from './actionTypes';

  export const fetchItem = (categoryId) =>
    async (dispatch) => {
      dispatch({
        type: FETCHING_ITEM,
        payload: null
      });

      const url = `/api/category/${categoryId? categoryId:'root'}/item`;
      console.log('fetchItem: ', url);

      await axios
        .get(url)
        .then(res => {
          dispatch({
            type: FETCH_ITEM_OK,
            payload: {
              content: res.data,
              error: null
            }
          });
        })
        .catch(err => {
          dispatch({
            type: FETCH_ITEM_FAIL,
            payload: {
              content: null,
              error: err
            }
          });
        });
      };
