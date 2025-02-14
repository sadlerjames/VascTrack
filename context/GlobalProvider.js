import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/authentication";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setisLoading] = useState(true); // loading the user in

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
    

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setisLoggedIn,
                user,
                setUser,
                isLoading
            }}
        >
            { children }
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;