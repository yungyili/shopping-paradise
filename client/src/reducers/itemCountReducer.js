import {
  FETCHING_ITEM_COUNT,
  FETCH_ITEM_COUNT_OK,
  FETCH_ITEM_COUNT_FAIL
} from '../actions/actionTypes';


export default function itemReducer(state={content:null, error:null, ongoing:true}, action) {

  switch(action.type){
  case FETCHING_ITEM_COUNT:
    return {
      content: state.content,
      error: null,
      ongoing: true
    }
  case FETCH_ITEM_COUNT_OK:
    return {
      content: action.payload.content,
      error: null,
      ongoing: false
    };

  case FETCH_ITEM_COUNT_FAIL:
    return {
      content: state.content,
      error: action.payload.error,
      ongoing: false
    }
  default:
    return state;
  }
}
