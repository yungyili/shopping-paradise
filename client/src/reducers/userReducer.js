import {
  FETCHING_USER_ITEMS,
  FETCH_USER_ITEMS_OK,
  FETCH_USER_ITEMS_FAIL,
} from '../actions/actionTypes';

const makeEmptyUser = () => {
  return {
    content: {
      items: []
    },
    error: null,
    ongoing: false
  };
}

export default function userReducer(state=makeEmptyUser(), action) {

  switch(action.type){
  case FETCHING_USER_ITEMS:
  {
    const newState = makeEmptyUser();
    newState.ongoing = true;
    return newState;
  }

  case FETCH_USER_ITEMS_OK:
  {
    const newState = {...state};
    newState.content.items = action.payload.content;
    newState.ongoing = false;
    return newState;
  }

  case FETCH_USER_ITEMS_FAIL:
  {
    const newState = makeEmptyUser();
    newState.error = action.payload.error;
    newState.ongoing = false;
    return newState;
  }

  default:
    return state;
  }
}
