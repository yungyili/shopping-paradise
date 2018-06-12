import {
  SET_CURRENT_ORDER
} from '../actions/actionTypes';

export default function currentOrderReducer(state={items:[]}, action) {
  switch(action.type){
  case SET_CURRENT_ORDER:
    return action.payload;
  default:
    return state;
  }
}
