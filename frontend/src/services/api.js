import axios from "axios"

export const BASE_URL = "http://127.0.0.1:5000/"
export const endpoints = {
    "login":"/auth/login",
    "register":"/auth/register"
}
// export const authApis = (token) => {
//     return axios.create({
//         baseURL: BASE_URL,
//         headers: {
//             "Authorization": `Bearer ${token}`
//         }
//     })
// }




export default axios.create({
    baseURL: BASE_URL,
});