import axios from "axios";

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
      window.setTimeout(() => {
        location.assign("/"); // back to home page
      }, 1000);
    }
    else{
        // show alert page here
    }
  } catch (err) {
    // show alert page here
  }
};

export const signup = async(name, email, password, passwordConfirm)=>{
    try {
        
      const res = await axios({
        method: "POST",
        url: "http://localhost:8000/api/user/signup",
        data: {
          name,
          email,
          password,
          passwordConfirm
        },
      });
      console.log(res);
      if (res.data.status === "success") {
        window.setTimeout(() => {
          location.assign("/"); // back to home page
        }, 1000);
      }
      else{
          // show alert page here
      }
     
    } catch (err) {
      // show alert page here
    }
}