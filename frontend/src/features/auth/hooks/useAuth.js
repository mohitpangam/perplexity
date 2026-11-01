import { useDispatch } from "react-redux";
import { register, login, getMe, resendEmail, logout } from "../services/auth.api.js";
import { setUser, setLoading, setError } from "../auth.slice.js";

export const useAuth = () => {
    const dispatch = useDispatch();

    const handleRegister = async ({username, email, password}) => {
        try {
            dispatch(setLoading(true));
            const data = await register({username, email, password});
        } catch (error) {
            dispatch(setError(error.response?.data?.message) || "Something went wrong");
        }finally{
            dispatch(setLoading(false));
        }
    }

    const handleLogin = async ({email, password}) => {
        try {
            dispatch(setLoading(true));
            const data = await login({email, password});
            dispatch(setUser(data.user));
        } catch (error) {
            dispatch(setError(error.response?.data?.message) || "Something went wrong");
        }finally{
            dispatch(setLoading(false));
        }
    }

    const handleGetMe = async () => {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
        } catch (error) {
            dispatch(setError(error.response?.data?.message) || "Something went wrong");
        }finally{
            dispatch(setLoading(false));
        }
    }

    const handleResendEmail = async ({email}) => {
        try{
            dispatch(setLoading(true));
            const data = await resendEmail({email})
        }catch(error){
            dispatch(setError(error.response?.data?.message) || "Something went wrong");
        }finally{
            dispatch(setLoading(false));
        }
    }

    const handleLogout = async () => {
        try{
            dispatch(setLoading(true));
            const data = await logout()
            dispatch(setUser(null))
        }catch(error){
            dispatch(setError(error.response?.data?.message) || "Something went wrong");
        }finally{
            dispatch(setLoading(false));
        }
    }

    return { handleRegister, handleLogin, handleGetMe, handleResendEmail, handleLogout };
}