import axios from "axios";
import {showAlert} from './alert';


export const createCourse = async(data) =>{
    let res;
    try {
        res = await axios({
            method: "POST",
            url: "http://localhost:8000/api/course/",
            data: data,
        });
     
        if (res.data.status==="success")
        {
            alert("Successfully")
        }else{
            alert("ERROR")
        }

    } catch (error) {
      
        res = error.response.data;
        alert(error.response.data.message)
    }     
}