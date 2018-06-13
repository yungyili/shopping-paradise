import {
  SET_CURRENT_ORDER,
  SET_LEAVE_FOR_LOGIN,
  MAKING_ORDER,
  MAKE_ORDER_OK,
  MAKE_ORDER_FAIL,
} from '../actions/actionTypes';
import { LEAVE_FOR_LOGIN } from '../constants/orders';

const makeEmptyOrder = () => {
  return {content:{items:[]}, ongoing:false, error:null};
}

export default function currentOrderReducer(state=makeEmptyOrder(), action) {
  switch(action.type){
  case SET_CURRENT_ORDER:
    if (action.payload === null) {
      return makeEmptyOrder();
    }
    else {
      return {
        content: action.payload,
        error: null,
        ongoing: false
      }
    }
  case SET_LEAVE_FOR_LOGIN:
  {
    let newState = state;
    newState[LEAVE_FOR_LOGIN] = action.payload;
    return {
      content: newState,
      error: null,
      ongoing: false
    };
  }
  case MAKING_ORDER:
    console.log("currentOrderReducer: making order, state=", state);
    return {
      content: state.content,
      error: null,
      ongoing: true
    };
  case MAKE_ORDER_OK:
  {
    let newContent = state.content;
    newContent['_id'] = action.payload.content;
    return {
      content: newContent,
      error: null,
      ongoing: false
    };
  }
  case MAKE_ORDER_FAIL:
    return {
      content: state.content,
      error: action.payload.error,
      ongoing: false
    };
  default:
    return state;
  }
}
