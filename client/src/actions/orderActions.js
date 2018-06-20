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
} from './actionTypes';
import { LEAVE_FOR_LOGIN } from '../constants/orders';

export const setCurrentOrder = ({items, payment, receiverName, receiverAddress}) => {
  console.log("setCurrentOrder: ", items);

  return {
    type: SET_CURRENT_ORDER,
    payload: {items, payment, receiverName, receiverAddress}
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
