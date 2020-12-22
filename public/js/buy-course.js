import axios from "axios";



export const buyCourse = async (courseSlugName) =>
{
    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:8000/api/checkout",
            data:{
                courseSlugName: courseSlugName
            }
        })
        if (res.data.status === 'success')
        {
            alert("Successfully");
        }
    } catch (error) {
        let res = error.response.data;
        alert(res.message)
    }
}