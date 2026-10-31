import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function register({username, email, password}){
    const response = await api.post("/api/auth/register", {username, email, password})

    return response.data
}


export async function login({email, password}){
    const response = await api.post("/api/auth/login", {email, password})

    return response.data
}

export async function getMe(){
    const response = await api.get("/api/auth/get-me")

    return response.data
}

export async function resendEmail({email}){
    const response = await api.post("/api/auth/resend-email", {email})

    return response
}

export async function verifyEmail({token}){
    const response = await api.get(`/verify-email?token=${token}`)

    return response
}
