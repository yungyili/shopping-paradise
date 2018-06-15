import {
  FETCHING_CATEGORY,
  FETCH_CATEGORY_OK,
  FETCH_CATEGORY_FAIL
} from '../actions/actionTypes';

const makeEmptyCategory = () => {
  return {
    content: [],
    error: null,
    ongoing: false
  };
}

export default function categoryReducer(state=makeEmptyCategory(), action) {
  console.log("categoryReducer: ", action);
  switch(action.type){
  case FETCHING_CATEGORY:
  {
    const newState = makeEmptyCategory();
    newState.ongoing = true;
    return newState;
  }
  case FETCH_CATEGORY_OK:
  {
    const newState = makeEmptyCategory();
    newState.content = action.payload.content;
    return newState;
  }

  case FETCH_CATEGORY_FAIL:
  {
    const newState = makeEmptyCategory();
    newState.error = action.payload.error;
    return newState;
  }
  default:
    return state;
  }
}
