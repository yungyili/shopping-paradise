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
  CREATING_ITEM,
  CREATE_ITEM_OK,
  CREATE_ITEM_FAIL,
  UPDATING_ITEM,
  UPDATE_ITEM_OK,
  UPDATE_ITEM_FAIL,
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

export const createItem = ({title, description, price, storage, pictureUrl, _category, _user, isBuyable}) =>
  async (dispatch) => {
    const item = {title, description, price, storage, pictureUrl, _category, _user, isBuyable};

    console.log("createItem: item=", item);

    dispatch({
      type: CREATING_ITEM,
      payload: null
    });

    const jwtToken = localStorage.getItem('jwtToken');

    await axios.post(`/api/item`, item, {
        headers: { Authorization: `JWT ${jwtToken}` }
      })
      .then((res)=>{
        dispatch({
          type: CREATE_ITEM_OK,
          payload: {
            content: res.payload,
            error: null
          }
        });
      })
      .catch(e=>{
        console.log("createItem: failed");
        dispatch({
          type: CREATE_ITEM_FAIL,
          payload: {
            content: null,
            error: e
          }
        });
      });
  }

export const updateItem = ({_id, title, description, price, storage, pictureUrl, _category, _user, isBuyable}) =>
  async (dispatch) => {
    const item = {_id, title, description, price, storage, pictureUrl, _category, _user, isBuyable};

    console.log("updateItem: item=", item);

    dispatch({
      type: UPDATING_ITEM,
      payload: null
    });

    const jwtToken = localStorage.getItem('jwtToken');

    await axios.put(`/api/item`, item, {
        headers: { Authorization: `JWT ${jwtToken}` }
      })
      .then((res)=>{
        dispatch({
          type: UPDATE_ITEM_OK,
          payload: {
            content: res.payload,
            error: null
          }
        });
      })
      .catch(e=>{
        console.log("createItem: failed");
        dispatch({
          type: UPDATE_ITEM_FAIL,
          payload: {
            content: null,
            error: e
          }
        });
      });
  }

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
