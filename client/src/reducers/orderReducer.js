import {
  SET_CURRENT_ORDER,
  SET_LEAVE_FOR_LOGIN
} from '../actions/actionTypes';
import { LEAVE_FOR_LOGIN } from '../constants/orders';

export default function currentOrderReducer(state={items:[]}, action) {
  switch(action.type){
  case SET_CURRENT_ORDER:
    return action.payload;
  case SET_LEAVE_FOR_LOGIN:
  {
    let newState = state;
    newState[LEAVE_FOR_LOGIN] = action.payload;
    return newState;
  }
  default:
    return state;
  }
}
