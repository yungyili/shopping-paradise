import axios from 'axios';
import {
  FETCHING_USER_ITEMS,
  FETCH_USER_ITEMS_OK,
  FETCH_USER_ITEMS_FAIL,
  FETCHING_USER_ORDERS,
  FETCH_USER_ORDERS_OK,
  FETCH_USER_ORDERS_FAIL,
  CANCELING_USER_ORDERS,
  CANCEL_USER_ORDERS_OK,
  CANCEL_USER_ORDERS_FAIL,
  CREATING_ITEM,
  CREATE_ITEM_OK,
  CREATE_ITEM_FAIL,
  UPDATING_ITEM,
  UPDATE_ITEM_OK,
  UPDATE_ITEM_FAIL,
  DELETING_ITEM,
  DELETE_ITEM_OK,
  DELETE_ITEM_FAIL,
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
              content: res.data,
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
      const item = {title, description, price, storage, pictureUrl, _category, _user, isBuyable};

      dispatch({
        type: UPDATING_ITEM,
        payload: null
      });

      const jwtToken = localStorage.getItem('jwtToken');
      console.log("updateItem: item=", item, "token=", jwtToken);

      await axios.put(`/api/item/${_id}`, item, {
          headers: { Authorization: `JWT ${jwtToken}` }
        })
        .then((res)=>{
          dispatch({
            type: UPDATE_ITEM_OK,
            payload: {
              content: res.data,
              error: null
            }
          });
        })
        .catch(e=>{
          console.log("updateItem: failed");
          dispatch({
            type: UPDATE_ITEM_FAIL,
            payload: {
              content: null,
              error: e
            }
          });
        });
    }

  export const deleteItem = (itemId) =>
    async (dispatch) => {
      dispatch({
        type: DELETING_ITEM,
        payload: null
      });

      const jwtToken = localStorage.getItem('jwtToken');
      console.log("deleteItem: itemId=", itemId, " ,jwtToken=", jwtToken);

      await axios.delete(`/api/item/${itemId}`, {
          headers: { Authorization: `JWT ${jwtToken}` }
        })
        .then((res)=>{
          dispatch({
            type: DELETE_ITEM_OK,
            payload: {
              content: res.data,
              error: null
            }
          });
        })
        .catch(e=>{
          console.log("deleteItem: failed");
          dispatch({
            type: DELETE_ITEM_FAIL,
            payload: {
              content: [],
              error: e
            }
          });
        });
    }

export const fetchUserSellOrders = () =>
  async (dispatch) => {

    dispatch({
      type: FETCHING_USER_ORDERS,
      payload: null
    });

    const token = localStorage.getItem('jwtToken');

    await axios.get('/api/user/sell/order', {
        headers: { Authorization: `JWT ${token}` }
      })
      .then((res)=>{
        dispatch({
          type: FETCH_USER_ORDERS_OK,
          payload: {
            content: res.data,
            error: null
          }
        });
      })
      .catch(e=>{
        dispatch({
          type: FETCH_USER_ORDERS_FAIL,
          payload: {
            content: null,
            error: e
          }
        });
      });
  };

  export const sellerCancelOrder = (orderId) =>
    async (dispatch) => {
      dispatch({
        type: CANCELING_USER_ORDERS,
        payload: null
      });

      const token = localStorage.getItem('jwtToken');
      console.log("sellerCancelOrder: orderId=", orderId, " ,token=", token);

      await axios.put(`/api/user/sell/order/${orderId}`, {isCanceled: true}, {
          headers: { Authorization: `JWT ${token}` }
        })
        .then((res)=>{
          dispatch({
            type: CANCEL_USER_ORDERS_OK,
            payload: {
              content: res.data,
              error: null
            }
          });
        })
        .catch(e=>{
          dispatch({
            type: CANCEL_USER_ORDERS_FAIL,
            payload: {
              content: null,
              error: e
            }
          });
        });
    };
