import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';


const SignOut = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/sign-out', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                dispatch(signOutSuccess());
                navigate('/sign-in');
            } else {
                console.error('Failed to sign out');
                alert('Failed to sign out. Please try again.');
            }
        } catch (error) {
            console.error('Error during sign out:', error);
            alert('An error occurred while signing out. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    Are you sure you want to sign out?
                </h2>
                <button 
                    onClick={handleSignOut} 
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-md text-white font-semibold 
                        ${isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                        } transition duration-200 ease-in-out`}
                >
                    {isLoading ? 'Signing Out...' : 'Sign Out'}
                </button>
            </div>
        </div>
    );
};

export default SignOut;