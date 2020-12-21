import axios from "axios";



export const buyCourse = async (courseSlugName)
{
    try {
        const res = await axios({
            method: "POST",
            url: "localhost:8000/checkout",
            data:{
                courseSlugName: courseSlugName
            }
        })
    } catch (error) {
        alert(err.message);
    }
}