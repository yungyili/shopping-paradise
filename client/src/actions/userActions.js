import axios from 'axios';
import {
  FETCHING_USER_ITEMS,
  FETCH_USER_ITEMS_OK,
  FETCH_USER_ITEMS_FAIL,
} from './actionTypes';

export const fetchUserItems = () =>
  async (dispatch) => {

    dispatch({
      type: FETCHING_USER_ITEMS,
      payload: null
    });

    const token = localStorage.getItem('jwtToken');

    await axios.get('/api/user/item', {
        headers: { Authorization: `JWT ${token}` }
      })
      .then((res)=>{
        dispatch({
          type: FETCH_USER_ITEMS_OK,
          payload: {
            content: res.data,
            error: null
          }
        });
      })
      .catch(e=>{
        dispatch({
          type: FETCH_USER_ITEMS_FAIL,
          payload: {
            content: null,
            error: e
          }
        });
      });
  };
