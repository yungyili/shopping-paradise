import axios from 'axios';
import {
  FETCHING_ITEM,
  FETCH_ITEM_OK,
  FETCH_ITEM_FAIL,
  FETCHING_CATEGORY_ITEM,
  FETCH_CATEGORY_ITEM_OK,
  FETCH_CATEGORY_ITEM_FAIL,
  FETCHING_ITEM_COUNT,
  FETCH_ITEM_COUNT_OK,
  FETCH_ITEM_COUNT_FAIL,
} from './actionTypes';

export const fetchCategoryItem = (categoryId, pageNum, perPage) =>
  async (dispatch) => {
    console.log("fetchCategoryItem: categoryId:", categoryId, ", pageNum:", pageNum, "perPage:", perPage);

    dispatch({
      type: FETCHING_CATEGORY_ITEM,
      payload: null
    });

    const url = `/api/category/${categoryId? categoryId:'root'}/item?pageNum=${pageNum}&perPage=${perPage}`;
    console.log('fetchCategoryItem: ', url);

    await axios
      .get(url)
      .then(res => {
        dispatch({
          type: FETCH_CATEGORY_ITEM_OK,
          payload: {
            content: res.data,
            error: null
          }
        });
      })
      .catch(err => {
        dispatch({
          type: FETCH_CATEGORY_ITEM_FAIL,
          payload: {
            content: null,
            error: err
          }
        });
      });
    };

export const fetchItemCount = (categoryId) =>
  async (dispatch) => {
    dispatch({
      type: FETCHING_ITEM_COUNT,
      payload: null
    });

    const url = `/api/category/${categoryId? categoryId:'root'}/item/count`;
    console.log('fetchItemCount: ', url);

    await axios
      .get(url)
      .then(res => {
        dispatch({
          type: FETCH_ITEM_COUNT_OK,
          payload: {
            content: res.data,
            error: null
          }
        });
      })
      .catch(err => {
        dispatch({
          type: FETCH_ITEM_COUNT_FAIL,
          payload: {
            content: null,
            error: err
          }
        });
      });
    };

export const fetchItem = (itemId) =>
  async (dispatch) => {
    console.log("fetchItem: itemId=", itemId);

    dispatch({
      type: FETCHING_ITEM,
      payload: null
    });

    const url = `/api/item/${itemId}`;
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
