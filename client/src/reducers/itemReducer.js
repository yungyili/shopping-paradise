import {
  FETCHING_ITEM,
  FETCH_ITEM_OK,
  FETCH_ITEM_FAIL
} from '../actions/actionTypes';


export default function itemReducer(state={content:{}, error:null}, action) {

  switch(action.type){
  case FETCHING_ITEM:
    return {
      content: state.content,
      error: null,
      ongoing: true
    }
  case FETCH_ITEM_OK:
    return {
      content: action.payload.content,
      error: null,
      ongoing: false
    };

  case FETCH_ITEM_FAIL:
    return {
      content: state.content,
      error: action.payload.error,
      ongoing: false
    }
  default:
    return state;
  }
}
