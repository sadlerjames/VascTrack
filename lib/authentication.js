import { auth, db } from "../config/FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

        await signIn(email, password);

    } catch (error) {
        console.error("Error signing up:", error.message);
        throw new Error(error);
    }
}


export async function signIn(email, password) {
    try {
        const session = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        throw new Error(error);
    }
}