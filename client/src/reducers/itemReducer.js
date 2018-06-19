import {
  FETCHING_ITEM,
  FETCH_ITEM_OK,
  FETCH_ITEM_FAIL,
  FETCHING_CATEGORY_ITEM,
  FETCH_CATEGORY_ITEM_OK,
  FETCH_CATEGORY_ITEM_FAIL,
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
    newItem.ongoing = true;
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
    newItem.ongoing = true;
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


  default:
    return state;
  }
}
