import {
  FETCHING_ITEM,
  FETCH_ITEM_OK,
  FETCH_ITEM_FAIL,
  FETCHING_CATEGORY_ITEM,
  FETCH_CATEGORY_ITEM_OK,
  FETCH_CATEGORY_ITEM_FAIL,
  CREATING_ITEM,
  CREATE_ITEM_OK,
  CREATE_ITEM_FAIL,
  DELETING_ITEM,
  DELETE_ITEM_OK,
  DELETE_ITEM_FAIL,
  UPDATING_ITEM,
  UPDATE_ITEM_OK,
  UPDATE_ITEM_FAIL,
} from '../actions/actionTypes';


const createEmptyItem = () => {
  return {
    content: [],
    error: null
  };
}

export default function itemReducer(state=createEmptyItem(), action) {

  switch(action.type){
  case FETCHING_CATEGORY_ITEM:
  {
    const newItem = createEmptyItem();
    newItem.onging = true;
    return newItem;
  }
  case FETCH_CATEGORY_ITEM_OK:
  {
    const newItem = createEmptyItem();
    newItem.content = action.payload.content;
    return newItem;
  }

  case FETCH_CATEGORY_ITEM_FAIL:
  {
    const newItem = createEmptyItem();
    newItem.error = action.payload.error;
    return newItem;
  }

  case FETCHING_ITEM:
  {
    const newItem = createEmptyItem();
    newItem.onging = true;
    return newItem;
  }

  case FETCH_ITEM_OK:
  {
    const newItem = createEmptyItem();
    newItem.content = action.payload.content;
    return newItem;
  }

  case FETCH_ITEM_FAIL:
  {
    const newItem = createEmptyItem();
    newItem.error = action.payload.error;
    return newItem;
  }

  case CREATING_ITEM:
  {
    const newItem = createEmptyItem();
    newItem.onging = true;
    return newItem;
  }

  case CREATE_ITEM_OK:
  {
    const newItem = createEmptyItem();
    newItem.content = action.payload.content;
    return newItem;
  }

  case CREATE_ITEM_FAIL:
  {
    const newItem = createEmptyItem();
    newItem.error = action.payload.error;
    return newItem;
  }

  case DELETING_ITEM:
  {
    const newItem = createEmptyItem();
    newItem.onging = true;
    return newItem;
  }

  case DELETE_ITEM_OK:
  {
    const newItem = createEmptyItem();
    newItem.content = action.payload.content;
    return newItem;
  }

  case DELETE_ITEM_FAIL:
  {
    const newItem = createEmptyItem();
    newItem.error = action.payload.error;
    return newItem;
  }

  case UPDATING_ITEM:
  {
    const newItem = createEmptyItem();
    newItem.onging = true;
    return newItem;
  }

  case UPDATE_ITEM_OK:
  {
    const newItem = createEmptyItem();
    newItem.content = action.payload.content;
    return newItem;
  }

  case UPDATE_ITEM_FAIL:
  {
    const newItem = createEmptyItem();
    newItem.error = action.payload.error;
    return newItem;
  }
  
  default:
    return state;
  }
}
