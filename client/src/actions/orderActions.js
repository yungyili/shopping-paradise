import axios from 'axios';
import {
  SET_CURRENT_ORDER,
  SET_LEAVE_FOR_LOGIN,
  PAYING,
  PAY_OK,
  PAY_FAIL
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
  console.log("setCurrentOrder: ", path);

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

export const handlePayment = ({orderId}, token) =>
  async (dispatch) => {
    console.log("handlePayment: orderId=", orderId, ", token=", token);

    dispatch({
      type: PAYING,
      payload: null
    });

    await axios.post(`/api/order/${orderId}/payment`, token)
      .then((res)=>{
        dispatch({
          type: PAY_OK,
          payload: {
            content: {
              orderId: orderId
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
              orderId: orderId
            },
            error: e
          }
        });
      });
  };
