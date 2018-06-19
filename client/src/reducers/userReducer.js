import {
  FETCHING_USER_ITEMS,
  FETCH_USER_ITEMS_OK,
  FETCH_USER_ITEMS_FAIL,
  FETCHING_USER_ORDERS,
  FETCH_USER_ORDERS_OK,
  FETCH_USER_ORDERS_FAIL,
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
      items: [],
      orders: []
    },
    error: {
      items: null,
      orders: null
    },
    ongoings: {
      items: false,
      orders: false
    },
    ongoing: false
  };
}

const combineOngoingStatus = (ongoings) => {
  return Object.values(ongoings).reduce((acc, cur) => acc || cur);
}

const handleDoing = (name, state, action) => {
  const newState = {...state};
  newState.content[name] = [];
  newState.ongoings[name] = true;
  newState.ongoing = combineOngoingStatus(newState.ongoings);
  return newState;
}

const handleOK = (name, state, action) => {
  const newState = {...state};
  newState.content[name] = action.payload.content;
  newState.ongoings[name] = false;
  newState.ongoing = combineOngoingStatus(newState.ongoings);
  return newState;
}

const handleFail = (name, state, action) => {
  const newState = {...state};
  newState.error[name] = action.payload.error;
  newState.ongoing[name] = false;
  newState.ongoing = combineOngoingStatus(newState.ongoings);
  return newState;
}

export default function userReducer(state=makeEmptyUser(), action) {

  switch(action.type){
  case FETCHING_USER_ITEMS:
  case CREATING_ITEM:
  case DELETING_ITEM:
  case UPDATING_ITEM:
  {
    return handleDoing('items', state, action);
  }

  case FETCH_USER_ITEMS_OK:
  case CREATE_ITEM_OK:
  case DELETE_ITEM_OK:
  case UPDATE_ITEM_OK:
  {
    return handleOK('items', state, action);
  }

  case FETCH_USER_ITEMS_FAIL:
  case CREATE_ITEM_FAIL:
  case DELETE_ITEM_FAIL:
  case UPDATE_ITEM_FAIL:
  {
    return handleFail('items', state, action);
  }

  case FETCHING_USER_ORDERS:
  {
    return handleDoing('orders', state, action);
  }

  case FETCH_USER_ORDERS_OK:
  {
    return handleOK('orders', state, action);
  }

  case FETCH_USER_ORDERS_FAIL:
  {
    return handleFail('orders', state, action);
  }

  default:
    return state;
  }
}
