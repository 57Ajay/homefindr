import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

const OAuth = () => {
    const dispatch = useDispatch();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            console.log(result);
            const res = await fetch("/api/auth/google", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                }),
            });
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();
            dispatch(signInSuccess(data));
        } catch (error) {
            console.log("Could not Sign in with google", error);
        }
    };
    
    
  return (
    <button onClick={handleGoogleClick} type='button' className="bg-red-700 text-white p-2 rounded-md uppercase hover:opacity-95 mt-2 justify-center flex mx-auto w-full">Continue with google</button>
  )
};

export default OAuth;