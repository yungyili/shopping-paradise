import axios from 'axios';
import {
  LOGGING_IN,
  LOGIN_OK,
  LOGIN_FAIL,
  FETCHING_CURRENT_USER,
  FETCH_CURRENT_USER_OK,
  FETCH_CURRENT_USER_FAIL
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
        history.push('/');
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
