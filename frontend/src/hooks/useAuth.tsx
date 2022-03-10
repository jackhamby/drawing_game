import { createContext, useContext, useEffect, useState } from "react";
import { post } from "../utils/apis";
import { LoginResponse } from "../utils/types";
import { axiosClient } from "..";

export interface UserData {
  username: string;
}

export interface UserSession {
  username?: string;
  token?: string;
}

export interface AuthContext {
  userSession: UserSession | null;
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void;
}
  

const getSavedSession = (): UserSession => {
  const savedSessionString = localStorage.getItem("session");
  if (savedSessionString){
      const session: UserSession = JSON.parse(savedSessionString)
      return session;
  }
  return {};
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);

const useAuth = (): AuthContext => {
  const [userSession, setUserSession] = useState<UserSession>(getSavedSession());
  
  const login = async (username: string, password: string): Promise<boolean> => {
    const response = await post<LoginResponse>("/login", {
      username,
      password
    });

    if (response.error?.message){
      console.warn("login failed");
      return false;
    }
    else if (response.data.accessToken){
      const userSession = decodeUserData(response.data.accessToken);
      setUserSession(userSession);
      localStorage.setItem("session", JSON.stringify(userSession));
      return true;
    }
    return false;
  }

  const logout = () => {
    setUserSession({});
  };

  const decodeUserData = (jwt: string): UserSession => {
    const userData: UserData = JSON.parse(atob(jwt.split('.')[1]));
    return {
      username: userData.username,
      token: jwt,
    }
  }

  return {
    userSession,
    login,
    logout,
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