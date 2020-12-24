// Processing all the events
import '@babel/polyfill';
import { login, signup, logout } from './login';
import { buyCourse } from './buy-course';
import { createCourse } from './newcourse';

const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".logout");
const addToCartBtn = document.getElementById('add-cart-btn');
const buyBtn = document.getElementById('buy-btn');
const createCourseBtn = document.getElementById('submit-course-btn');
const courseSort = document.getElementsByClassName('course-sort');


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

if (addToCartBtn) {

  addToCartBtn.addEventListener('click', function () {
    console.log(document.cookie);
    if (window.sessionStorage.getItem("cart"))
      {window.sessionStorage.cart}
    else{
      window.sessionStorage.setItem('cart', [window.location.pathname]);
    }
  })
}

if (buyBtn) {
  buyBtn.addEventListener('click', function () {
    let slugName = window.location.pathname.replace("/course/", "");
    buyCourse(slugName);
  });
}

if (createCourseBtn) {
  createCourseBtn.addEventListener('click', function () {
    const data = {};
    data["name"] = document.getElementById("main[title]").value;
    data["description"] = document.getElementById("id_course_description").value;
    data["category"] = document.getElementById("category-selection").value;
    data["price"] = document.getElementById("course-price").value;
    data["subcategory"] = document.getElementById("subcategory-selection").value;
    data["avatar"] = document.getElementById("img-link").value;
    data["promotionalVideo"] = document.getElementById("promotional-video-link").value;
    createCourse(data);
  })
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