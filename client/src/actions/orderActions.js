import axios from 'axios';
import {
  SET_CURRENT_ORDER,
  SET_LEAVE_FOR_LOGIN,
  PAYING,
  PAY_OK,
  PAY_FAIL,
  MAKING_ORDER,
  MAKE_ORDER_OK,
  MAKE_ORDER_FAIL,
  ADD_TO_SHOPPING_CART,
  CLEAR_SHOPPING_CART,
  SHOPPING_CART_TO_ORDER,
  REMOVE_FROM_SHOPPING_CART,
} from './actionTypes';
import { LEAVE_FOR_LOGIN, SHOPPING_CART } from '../constants/orders';

export const setCurrentOrder = ({items, payment, receiverName, receiverAddress, naviFrom}) => {
  console.log("setCurrentOrder: ", items);

  return {
    type: SET_CURRENT_ORDER,
    payload: {items, payment, receiverName, receiverAddress, naviFrom}
  };
}

export const setLeaveForLogin = (path) => {
  console.log("setLeaveForLogin: ", path);

  if (path){
    localStorage.setItem(LEAVE_FOR_LOGIN, path);
  } else {
    localStorage.removeItem(LEAVE_FOR_LOGIN);
  }

  return {
    type: SET_LEAVE_FOR_LOGIN,
    payload: path
  };
}

export const addToShoppingCart = (item) => {
  let items;

  try{
    items = JSON.parse(localStorage.getItem(SHOPPING_CART));
  } catch(err) {
    localStorage.removeItem(SHOPPING_CART);
    items = [];
  }

  console.log("addToShoppingCart: item=", item);
  if(!items || !Array.isArray(items)) {
    items = [item];
  } else {
    if (!items.find(n=> item._id == n._id)){
      items.push(item);
    }
  }
  localStorage.setItem(SHOPPING_CART, JSON.stringify(items));

  return {
    type: ADD_TO_SHOPPING_CART,
    payload: items
  };
}

export const removeFromShoppingCart = (ids) => {
  let items;

  try{
    items = JSON.parse(localStorage.getItem(SHOPPING_CART));
  } catch(err) {
    localStorage.removeItem(SHOPPING_CART);
    items = [];
  }

  let newItems = items;
  console.log("removeFromShoppingCart: ids=", ids);
  if(items && ids && Array.isArray(items) && Array.isArray(ids) ) {
    newItems = items.filter(item => {
      return ids.find(id => item._id === id)? false: true;
    })
  }
  localStorage.setItem(SHOPPING_CART, JSON.stringify(newItems));

  return {
    type: REMOVE_FROM_SHOPPING_CART,
    payload: newItems
  };
}

export const clearShoppingCart = () => {
  console.log("clearShoppingCart: ");

  localStorage.setItem(SHOPPING_CART, []);

  return {
    type: CLEAR_SHOPPING_CART,
    payload: null
  };
}

export const shoppingCartToOrder = (selected, naviFrom) => {
  console.log("shoppingCartToOrder: ");

  let items;

  try{
    items = JSON.parse(localStorage.getItem(SHOPPING_CART));
  } catch(err) {
    localStorage.removeItem(SHOPPING_CART);
    items = [];
  }

  const normalizedItems = items.map(item => {
      return {
        quantity: "1",
        item: item
      };
    }).filter( item => {
      return selected.find(id => id === item.item._id);
    });

  return {
    type: SHOPPING_CART_TO_ORDER,
    payload: {
      items: normalizedItems,
      payment:null,
      receiverName:null,
      receiverAddress:null,
      naviFrom: naviFrom
    }
  };
}

export const handlePayment = ({_id}, token) =>
  async (dispatch) => {
    console.log("handlePayment: _id=", _id, ", token=", token);

    dispatch({
      type: PAYING,
      payload: _id
    });

    const jwtToken = localStorage.getItem('jwtToken');

    await axios.post(`/api/order/${_id}/payment`, token, {
        headers: { Authorization: `JWT ${jwtToken}` }
      })
      .then((res)=>{
        dispatch({
          type: PAY_OK,
          payload: {
            content: {
              _id: _id
            },
            error: null
          }
        });
      })
      .catch(e=>{
        console.log("handlePayment: failed");
        dispatch({
          type: PAY_FAIL,
          payload: {
            content: {
              _id: _id
            },
            error: e
          }
        });
      });
  };

  export const makeOrder = (order) =>
    async (dispatch) => {
      console.log("makeOrder: order=", order);

      dispatch({
        type: MAKING_ORDER,
        payload: null
      });

      const jwtToken = localStorage.getItem('jwtToken');

      await axios.post(`/api/order`, order, {
          headers: { Authorization: `JWT ${jwtToken}` }
        })
        .then((res)=>{
          dispatch({
            type: MAKE_ORDER_OK,
            payload: {
              content: res.data,
              error: null
            }
          });
        })
        .catch(e=>{
          console.log("makeOrder: failed");
          dispatch({
            type: MAKE_ORDER_FAIL,
            payload: {
              content: null,
              error: e
            }
          });
        });
    };
