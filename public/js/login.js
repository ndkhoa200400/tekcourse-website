import axios from "axios";
import {showAlert} from './alert';


export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:8000/user/login",
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
      url: "http://localhost:8000/user/signup",
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
      url: "http://localhost:8000/user/logout",
    });

  } catch (err) {
    let res = err.response.data;
		alert(res.message);
  }
};

export const changePassword = async (passwordCurrent, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://localhost:8000/user/updatePassword",
      data: {
        passwordCurrent: passwordCurrent,
        password: password,
        passwordConfirm: passwordConfirm
      }
    });
    if (res.data.status === 'success') {
      alert("Changed password successfully");
      window.setTimeout(() => {
        window.location = '/student-profile/edit'; // back to home page
      }, 1000);
    } else {
   
      console.log(res.data);
    }
  } catch (error) {
    let res = error.response.data;
    alert(res.message)
  }
}