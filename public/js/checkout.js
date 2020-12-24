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
            window.location.replace('/check-out');
        }
    } catch (error) {
        let res = error.response.data;
        alert(res.message)
    }
}

export const checkOutCart = async () => {
    try {


        const response = await axios({
            method: "POST",
            url: "http://localhost:8000/api/checkout/many",

        })

        if (response.data.status === "success") {
            alert("Purchased successfully");
            window.location.replace('/check-out');
        }






    } catch (error) {
        console.log(error.message);
    }
}