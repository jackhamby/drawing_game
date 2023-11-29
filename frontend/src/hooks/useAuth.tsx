import { createContext, useContext, useState } from "react";
import { post, Response } from "../utils/apis";
import { LoginResponse } from "../utils/types";

export interface UserData {
  username: string;
  userId: number;
}

export interface UserSession {
  username: string;
  token: string;
  userId: number;
}

export interface AuthContext {
  userSession: UserSession | null;
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void;
  signup: (username: string, password: string) => Promise<Response<LoginResponse>>
}
  

const getSavedSession = (): UserSession | null => {
  const savedSessionString = localStorage.getItem("session");
  if (savedSessionString){
      const session: UserSession = JSON.parse(savedSessionString)
      return session;
  }
  return null;
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);

const useAuth = (): AuthContext => {
  const [userSession, setUserSession] = useState<UserSession | null>(getSavedSession());

  const signup = async (username: string, password: string): Promise<Response<LoginResponse>> => {
    const response = await post<LoginResponse>("/signup", {
        username,
        password
    });
    if (!response.error){
        console.log("Success bithc")
        decodeAndSetAccessToken(response.data.accessToken)
        console.warn("login success");
        return response;
    }

    return response
}


  const login = async (username: string, password: string): Promise<boolean> => {
    const response = await post<LoginResponse>("/login", {
      username,
      password
    });

    if (!response.error){
      decodeAndSetAccessToken(response.data.accessToken)
      console.warn("login success");
      return true;
    }

    return false
  }

  const decodeAndSetAccessToken = (accessToken: string) => {
    const userSession = decodeUserData(accessToken);
    setUserSession(userSession);
    localStorage.setItem("session", JSON.stringify(userSession));
  }

  const logout = () => {
    setUserSession(null);
    setTimeout(() => {
      localStorage.removeItem("session")
    }, 250);
  };

  const decodeUserData = (jwt: string): UserSession => {
    const userData: UserData = JSON.parse(atob(jwt.split('.')[1]));
    return {
      username: userData.username,
      userId: userData.userId,
      token: jwt,
    }
  }

  return {
    userSession,
    login,
    logout,
    signup
  }
}

export const AuthProvider = (props: {children: JSX.Element}) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {props.children}
    </AuthContext.Provider>
  );
}


const Consumer =  () => {
  return useContext(AuthContext);
}

export default Consumer;