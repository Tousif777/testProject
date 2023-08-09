import { createContext, useContext, useEffect, useState } from "react";
import { auth } from '../FirebaseInit';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth'
import { toast } from "react-toastify";

const userContext = createContext();

export const useUserContext = () => {
    return useContext(userContext);
}

const UserProvider = (props) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const saveUserToLocalStorage = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    };

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('user');
    };

    const signUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const logIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = async () =>{
        try {
            await signOut(auth);
            setUser(null);
            removeUserFromLocalStorage();
        } catch (error) {
            toast.error(error.message);
        }
    }

    const googleLogIn = () => {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currUser) => {
            setUser(currUser);
            if (currUser) {
                saveUserToLocalStorage(currUser);
            } else {
                removeUserFromLocalStorage();
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <userContext.Provider value={{
            user,
            signUp,
            logIn,
            logOut,
            googleLogIn
        }}>
            {props.children}
        </userContext.Provider>
    )
}

export default UserProvider;
