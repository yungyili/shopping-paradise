import {
  SET_CURRENT_ORDER,
  SET_LEAVE_FOR_LOGIN,
  MAKING_ORDER,
  MAKE_ORDER_OK,
  MAKE_ORDER_FAIL,
  PAYING,
  PAY_OK,
  PAY_FAIL,
  ADD_TO_SHOPPING_CART,
  CLEAR_SHOPPING_CART,
  SHOPPING_CART_TO_ORDER,
  REMOVE_FROM_SHOPPING_CART,
} from '../actions/actionTypes';
import { LEAVE_FOR_LOGIN } from '../constants/orders';

const makeEmptyOrder = () => {
  return {content:{items:[], LEAVE_FOR_LOGIN:null}, ongoing:false, error:null};
}

export default function currentOrderReducer(state=makeEmptyOrder(), action) {
  switch(action.type){
  case SET_CURRENT_ORDER:
  case SHOPPING_CART_TO_ORDER:
  {
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
  }
  case SET_LEAVE_FOR_LOGIN:
  {
    let newState = {...state};
    newState.content[LEAVE_FOR_LOGIN] = action.payload;
    return newState;
  }
  case ADD_TO_SHOPPING_CART:
  case CLEAR_SHOPPING_CART:
  case REMOVE_FROM_SHOPPING_CART:
  {
    const newState = {...state};
    return newState;
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
/* Stipe Checkout code will crash
  case PAYING:
    return {
      content: null,
      error: null,
      ongoing: true
    }

  case PAY_OK:
    return {
      content: state.content,
      error: null,
      ongoing: false
    }

  case PAY_FAIL:
    return {
      content: state.content,
      error: action.payload.error,
      ongoing: false
    }
*/
  default:
    return state;
  }
}
