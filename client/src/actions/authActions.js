import axios from 'axios';
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
} from './actionTypes';


export const jwtLogin = (loginInfo, history) =>
  async (dispatch) => {
    console.log("jwtLogin: loginInfo=", loginInfo);

    dispatch({
      type: LOGGING_IN,
      payload: null
    });

    await axios.post('/api/auth/jwt', loginInfo)
      .then((res)=>{
        const token = res.data.token;
        console.log('jwtLogin: set jwtToken: ', token);
        localStorage.setItem('jwtToken', token);
        history.push('/');
        dispatch({
          type: LOGIN_OK,
          payload: {
            content: {
              email: loginInfo.email,
              token: token
            },
            error: null
          }
        });
      })
      .catch(e=>{
        console.log("jwtLogin: failed");
        localStorage.removeItem('jwtToken');

        dispatch({
          type: LOGIN_FAIL,
          payload: {
            content: null,
            error: e
          }
        });
      });
  };

export const fetchCurrentUser = () =>
  async (dispatch) => {

    dispatch({
      type: FETCHING_CURRENT_USER,
      payload: null
    });

    const token = localStorage.getItem('jwtToken');

    await axios.get('/api/auth/current_user', {
        headers: { Authorization: `JWT ${token}` }
      })
      .then((res)=>{
        dispatch({
          type: FETCH_CURRENT_USER_OK,
          payload: {
            content: res.data,
            error: null
          }
        });
      })
      .catch(e=>{
        dispatch({
          type: FETCH_CURRENT_USER_FAIL,
          payload: {
            content: null,
            error: e
          }
        });
      });
  };

  export const logout = () =>
    async (dispatch) => {

      dispatch({
        type: LOGGING_OUT,
        payload: null
      });

      const token = localStorage.getItem('jwtToken');
      localStorage.removeItem('jwtToken');

      await axios.get('/api/auth/logout', {
          headers: { Authorization: `JWT ${token}` }
        })
        .then((res)=>{
          dispatch({
            type: LOGOUT_OK,
            payload: {
              content: null,
              error: null
            }
          });
        })
        .catch(e=>{
          dispatch({
            type: LOGOUT_FAIL,
            payload: {
              content: null,
              error: e
            }
          });
        });
    };

export const signUp = (signUpInfo, history) =>
  async (dispatch) => {

    console.log("signUp: ", signUpInfo)

    dispatch({
      type: SIGNING_UP,
      payload: null
    });

    await axios.post('/api/auth/sign-up', signUpInfo)
      .then((res)=>{
        const token = res.data.token;
        console.log('signUp: set jwtToken: ', token);
        localStorage.setItem('jwtToken', token);
        history.push('/');

        dispatch({
          type: SIGNUP_OK,
          payload: {
            content: res.data,
            error: null
          }
        });
      })
      .catch(e=>{
        console.log("signUp: failed");
        localStorage.removeItem('jwtToken');

        dispatch({
          type: SIGNUP_FAIL,
          payload: {
            content: null,
            error: e
          }
        });
      });
  };
