import axios from "axios";
import {showAlert} from './alert';


export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:8000/api/user/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      console.log('ok');
      showAlert ('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign("/"); // back to home page
      }, 1500);
    } else {
      showAlert('error', "Incorrect password or email");
    }
  } catch (err) {
    // show alert page here
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:8000/api/user/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      showAlert('success', 'Signed up successfully');
      window.setTimeout(() => {
        location.assign("/"); // back to home page
      }, 1000);
    } 
    else{
      showAlert('error', "Email has already been taken!");
    }
  } catch (err) {
    // show alert page here
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:8000/api/user/logout",
    });

  } catch (err) {
    // show alert page here
  }
};
