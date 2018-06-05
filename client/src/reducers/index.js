import {combineReducers} from 'redux';
import categoryReducer from './categoryReducer';
import itemReducer from './itemReducer';

export default combineReducers({
  category: categoryReducer,
  item: itemReducer
});
