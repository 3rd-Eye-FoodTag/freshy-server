import axios from 'axios';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from 'firebase/auth';
import {auth} from './firebase/config'

const JQ = 'AIzaSyBYyGwCHKviq3olXksJWi4c7xSR_GVGoMg';
const WEB_API_KEY = JQ;
  
type AuthenProps = {
    email: string;
    password: string;
    refreshToken?: string;
};
  
export const authenticate = async (
    mode: string,
    email: string | undefined,
    password: string | undefined,
) => {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${WEB_API_KEY}`;
    const response = await axios.post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });
  
    return {...response.data, status: response.status};
};
  
export const handleLogin = ({email, password}: AuthenProps) => {
    return authenticate('signInWithPassword', email, password);
};

export const registerAccount = async ({email, password}: AuthenProps) => {
    return authenticate('signUp', email, password);
};