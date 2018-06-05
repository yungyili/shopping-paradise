import {
  FETCHING_CATEGORY,
  FETCH_CATEGORY_OK,
  FETCH_CATEGORY_FAIL
} from '../actions/actionTypes';

export default function categoryReducer(state={content:{}, error:null}, action) {
  console.log("categoryReducer: ", action);
  switch(action.type){
  case FETCHING_CATEGORY:
    return state;
  case FETCH_CATEGORY_OK:
    return {
      content: action.payload.content,
      error: null
    };

  case FETCH_CATEGORY_FAIL:
    return {
      content: state.content,
      error: action.payload.error
    }
  default:
    return state;
  }
}
