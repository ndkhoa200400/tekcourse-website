import axios from "axios";



export const buyCourse = async (courseSlugName) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:8000/api/checkout",
            data: {
                courseSlugName: courseSlugName
            }
        })
        if (res.data.status === 'success') {
            window.location.href = "/check-out";
        }
    } catch (error) {
        let res = error.response.data;
        console.log(res);
        //alert(res.message)
    }
}