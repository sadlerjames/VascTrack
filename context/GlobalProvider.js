import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/authentication";
import { signOut } from "firebase/auth";
import { auth } from "../config/FirebaseConfig";
import { Link, router } from 'expo-router';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) {
                setisLoggedIn(true);
                setUser(user);
            } else {
                setisLoggedIn(false);
                setUser(null);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setisLoading(false);
        })
    }, []);

    // Clears the users session and redirect to login
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setisLoggedIn(false);
            router.replace("/sign-in"); 
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setisLoggedIn,
                user,
                setUser,
                isLoading,
                logout
            }}
        >
            { children }
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;