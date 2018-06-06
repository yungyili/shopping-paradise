import {combineReducers} from 'redux';
import categoryReducer from './categoryReducer';
import itemReducer from './itemReducer';
import itemCountReducer from './itemCountReducer';

export default combineReducers({
  category: categoryReducer,
  item: itemReducer,
  itemCount: itemCountReducer
});
