import {
  SET_CURRENT_ORDER
} from './actionTypes';

export const setCurrentOrder = ({items, payment, receiverName, receiverAddress}) => {
  console.log("setCurrentOrder: ", items);

  return {
    type: SET_CURRENT_ORDER,
    payload: {items, payment, receiverName, receiverAddress}
  };
}
