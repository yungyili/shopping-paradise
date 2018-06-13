import {
  SET_CURRENT_ORDER,
  SET_LEAVE_FOR_LOGIN
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
