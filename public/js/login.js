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
      
      showAlert ('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign("/"); // back to home page
      }, 1500);
    }
  } catch (err) {
    let res = err.response.data;
		alert(res.message);
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
    
  } catch (err) {
    let res = err.response.data;
		alert(res.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:8000/api/user/logout",
    });

  } catch (err) {
    let res = err.response.data;
		alert(res.message);
  }
};
