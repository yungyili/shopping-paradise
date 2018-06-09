import {
  LOGGING_IN,
  LOGIN_OK,
  LOGIN_FAIL,
  LOGGING_OUT,
  LOGOUT_OK,
  LOGOUT_FAIL,
  FETCHING_CURRENT_USER,
  FETCH_CURRENT_USER_OK,
  FETCH_CURRENT_USER_FAIL
} from '../actions/actionTypes';

export default function authReducer(state={content:null, error:null, ongoing:false}, action) {

  switch(action.type){
  case LOGGING_IN:
    return {
      content: null,
      error: null,
      ongoing: true
    }
  case LOGIN_OK:
    return {
      content: action.payload.content,
      error: null,
      ongoing: false
    };

  case LOGIN_FAIL:
    return {
      content: null,
      error: action.payload.error,
      ongoing: false
    }
  case FETCHING_CURRENT_USER:
    return {
      content: null,
      error: null,
      ongoing: true
    }
  case FETCH_CURRENT_USER_OK:
    return {
      content: action.payload.content,
      error: null,
      ongoing: false
    };

  case FETCH_CURRENT_USER_FAIL:
    return {
      content: null,
      error: action.payload.error,
      ongoing: false
    }

  case LOGGING_OUT:
    return {
      content: null,
      error: null,
      ongoing: true
    }
  case LOGOUT_OK:
    return {
      content: null,
      error: null,
      ongoing: false
    }
  case LOGOUT_FAIL:
    return {
      content: null,
      error: action.payload.error,
      ongoing: false
    }

  default:
    return state;
  }
}
