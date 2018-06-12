import {combineReducers} from 'redux';
import categoryReducer from './categoryReducer';
import itemReducer from './itemReducer';
import itemCountReducer from './itemCountReducer';
import authReducer from './authReducer';
import orderReducer from './orderReducer';

export default combineReducers({
  category: categoryReducer,
  item: itemReducer,
  itemCount: itemCountReducer,
  auth: authReducer,
  order: orderReducer
});
