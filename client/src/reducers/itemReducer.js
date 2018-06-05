import {
  FETCHING_ITEM,
  FETCH_ITEM_OK,
  FETCH_ITEM_FAIL
} from '../actions/actionTypes';


export default function itemReducer(state={content:{}, error:null}, action) {
  var newState = undefined;
  switch(action.type){
  case FETCHING_ITEM:
    return state;
  case FETCH_ITEM_OK:
    return {
      content: action.payload.content,
      error: null
    };

  case FETCH_ITEM_FAIL:
    return {
      content: state.content,
      error: action.payload.error
    }
  default:
    return state;
  }
}
