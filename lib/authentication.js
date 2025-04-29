import { auth, db } from "../config/FirebaseConfig";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
  
export const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
        const result = await signInWithCredential(auth, googleCredential);
        const user = result.user;

        // Check Firestore for user profile
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        // If user doesn't exist in Firestore add them
        if (!userDoc.exists()) {
            const { givenName, familyName } = userInfo.user;
            await setDoc(userDocRef, {
                firstName: givenName,
                lastName: familyName,
                email: user.email,
                createdAt: new Date()
            });
        }

        const updatedDoc = await getDoc(userDocRef);
        return { uid: user.uid, email: user.email, ...updatedDoc.data() };

    } catch (error) {
        console.log("Google sign-in error", error);
        throw new Error("Google sign-in failed");
    }
};
  

export const createUser = async ( email, password, firstName, lastName ) => {
    try {
        // Create user via firebase authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!userCredential) throw Error;

        // Store additional details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            firstName: firstName,
            lastName: lastName,
            email: email,
            createdAt: new Date()
        });

        console.log("User signed up and data stored!");

        // Fetch the user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            return { uid: user.uid, email: user.email, ...userDoc.data() };
        } else {
            throw new Error("User data not found in Firestore");
        }

    } catch (error) {
        console.error("Error signing up:", error.message);
        throw new Error(error);
    }
};


export const signIn = async (email, password) => {
    try {
        const session = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        throw new Error(error);
    }
};

export const getCurrentUser = async () => {
    try {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                unsubscribe(); // Stop listening after getting user
                if (user) {
                    // Fetch additional user data from Firestore
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        resolve({ uid: user.uid, email: user.email, ...userDoc.data() });
                    } else {
                        resolve(user); // Return auth user if Firestore data doesn't exist
                    }
                } else {
                    resolve(null);
                }
            }, reject);
        });
    } catch (error) {
        console.log(error);
    }
};