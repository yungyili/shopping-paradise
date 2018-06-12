import {
  SET_CURRENT_ORDER
} from './actionTypes';

export const setCurrentOrder = (items) => {
  console.log("setCurrentOrder: ", items);

  return {
    type: SET_CURRENT_ORDER,
    payload: {
      items: items
    }
  };
}
