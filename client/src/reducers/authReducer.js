import {
  LOGGING_IN,
  LOGIN_OK,
  LOGIN_FAIL,
  LOGGING_OUT,
  LOGOUT_OK,
  LOGOUT_FAIL,
  FETCHING_CURRENT_USER,
  FETCH_CURRENT_USER_OK,
  FETCH_CURRENT_USER_FAIL,
  SIGNING_UP,
  SIGNUP_OK,
  SIGNUP_FAIL,
} from '../actions/actionTypes';


const handleDoing = (action) => {
  return {
    content: null,
    error: null,
    ongoing: true
  };
}

const handleOK = (action) => {
  return {
    content: action.payload.content,
    error: null,
    ongoing: false
  };
}

const handleFail = (action) => {
  return {
    content: null,
    error: action.payload.error,
    ongoing: false
  };
}

const makeEmptyAuth = () => {
  return {
    content: null,
    error: null,
    ongoing: false
  }
};

export default function authReducer(state=makeEmptyAuth(), action) {

  switch(action.type){
  case LOGGING_IN:
  case FETCHING_CURRENT_USER:
  case SIGNING_UP:
  {
    return handleDoing(action);
  }

  case LOGIN_OK:
  case FETCH_CURRENT_USER_OK:
  case SIGNUP_OK:
  {
    return handleOK(action);
  }

  case LOGIN_FAIL:
  case FETCH_CURRENT_USER_FAIL:
  case SIGNUP_FAIL:
  {
    return handleFail(action);
  }

  case LOGGING_OUT:
    return {
      content: state.content,
      error: null,
      ongoing: true
    };

  case LOGOUT_OK:
    return makeEmptyAuth();

  case LOGOUT_FAIL:
  return {
    content: state.content,
    error: action.payload.error,
    ongoing: false
  };


  default:
    return state;
  }
}
