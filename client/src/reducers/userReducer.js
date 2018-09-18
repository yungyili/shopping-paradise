import {
  FETCHING_USER_ITEMS,
  FETCH_USER_ITEMS_OK,
  FETCH_USER_ITEMS_FAIL,
  CREATING_ITEM,
  CREATE_ITEM_OK,
  CREATE_ITEM_FAIL,
  UPDATING_ITEM,
  UPDATE_ITEM_OK,
  UPDATE_ITEM_FAIL,
  DELETING_ITEM,
  DELETE_ITEM_OK,
  DELETE_ITEM_FAIL,
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

  case CREATING_ITEM:
  case DELETING_ITEM:
  case UPDATING_ITEM:
  {
    const newState = {...state};
    newState.onging = true;
    return newState;
  }

  case CREATE_ITEM_OK:
  case DELETE_ITEM_OK:
  case UPDATE_ITEM_OK:
  {
    const newState = {...state};
    newState.content.items = action.payload.content;
    return newState;
  }

  case CREATE_ITEM_FAIL:
  case DELETE_ITEM_FAIL:
  case UPDATE_ITEM_FAIL:
  {
    const newState = {...state};
    newState.error = action.payload.error;
    return newState;
  }

  default:
    return state;
  }
}
