// import { PostsList } from '../components';
import { APIUrls } from '../helpers/urls';
import {
  AUTHENTICATE_USER,
  CLEAR_AUTH_STATE,
  EDIT_USER_FAILED,
  EDIT_USER_SUCCESSFUL,
  LOGIN_FAILED,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOG_OUT,
  SIGNUP_FAILED,
  SIGNUP_START,
  SIGNUP_SUCCESS,
} from './actionTypes';
import { getAuthTokenFromLocalStorage, getFormBody } from '../helpers/utils';

export function startLogin() {
  return {
    type: LOGIN_START,
  };
}
export function loginFailed(errorMessage) {
  return {
    type: LOGIN_FAILED,
    error: errorMessage,
  };
}
export function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
}

export function login(email, password) {
  return (dispatch) => {
    dispatch(startLogin());
    const url = APIUrls.login();
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-ww-form-urlencoded',
      },
      body: getFormBody({ email, password }),
    })
      .then((response) => {
        response.json();
      })
      .then((data) => {
        console.log('data login', data);
        if (data.success) {
          localStorage.setItem('token', data.data.token);
          //dispatch action to save user
          dispatch(loginSuccess(data.data.user));
          return;
        }
        dispatch(loginFailed(data.message));
      });
  };
}

export function authenticateUser(user) {
  return {
    type: AUTHENTICATE_USER,
    user,
  };
}

export function logoutUser() {
  return {
    type: LOG_OUT,
  };
}

export function signup(Name, email, password, confirmPassword) {
  return (dispatch) => {
    const url = APIUrls.signup();
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-ww-form-urlencoded',
      },
      body: getFormBody({
        Name,
        email,
        password,
        confirmPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('signData', data);
        if (data.success) {
          localStorage.setItem('token', data.data.token);
          dispatch(signupSuccessful(data.data.user));
          return;
        }
        dispatch(signupFailed(data.message));
      });
  };
}

export function signupStart() {
  return {
    type: SIGNUP_START,
  };
}

export function signupSuccessful(user) {
  return {
    type: SIGNUP_SUCCESS,
    user,
  };
}
export function signupFailed(error) {
  return {
    type: SIGNUP_FAILED,
    error,
  };
}

export function clearAuthState() {
  return {
    type: CLEAR_AUTH_STATE,
  };
}
export function editUserSuccessful(user) {
  return {
    type: EDIT_USER_SUCCESSFUL,
    user,
  };
}
export function editUserFailed(error) {
  return {
    type: EDIT_USER_FAILED,
    error,
  };
}
export function editUser(name, password, confirmPassword, userId) {
  return (dispatch) => {
    const url = APIUrls.editProfile();
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-ww-form-urlencoded',
        Authorization: `Bearer ${getAuthTokenFromLocalStorage()} `,
      },
      body: getFormBody({
        name,
        id: userId,
        password,
        confirm_password: confirmPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        if (data.success) {
          dispatch(editUserSuccessful(data.data.user));
          if (data.data.token) {
            localStorage.setItem('token', data.data.token);
          }
          return;
        } else {
          dispatch(editUserFailed(data.message));
        }
      });
  };
}