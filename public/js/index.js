// Processing all the events
import '@babel/polyfill';
import { login, signup, logout } from './login';
import {buyCourse, checkOutCart } from './checkout';

const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".logout");
const checkOutBtn = document.getElementById('check-out-btn');
const courseSort = document.getElementsByClassName('course-sort');
const buyBtn = document.getElementById('buy-btn');
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("id_email").value;
    const password = document.getElementById("id_password").value;
    login(email, password);
  });
}


if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("id_fullname").value;
    const email = document.getElementById("id_email").value;
    const password = document.getElementById("id_password").value;
    const passwordConfirm = document.getElementById("id_password_confirm").value;
    signup(name, email, password, passwordConfirm);
  });
}


if (logOutBtn) logOutBtn.addEventListener('click', logout);

if(checkOutBtn)
{
  checkOutBtn.addEventListener('click',checkOutCart);
}


if (courseSort) {
  for (let index = 0; index < courseSort.length; index++) {
    courseSort[index].addEventListener('click', function () {
      let sortAttribute = courseSort[index].getAttribute('data-sort-type');
      var queryParams = new URLSearchParams(window.location.search);

      queryParams.delete('sort');
      queryParams.append('sort', sortAttribute);
      window.location.search = queryParams.toString();
    });

  }
}

if (buyBtn) {
  buyBtn.addEventListener('click', function () {
    let slugName = window.location.pathname.replace("/course/", "");
    buyCourse(slugName);
  });
}

