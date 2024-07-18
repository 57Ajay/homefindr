import { useState } from 'react';
import {Link,useNavigate} from "react-router-dom"


const SignUp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData((prev)=>{
            return{
                ...prev,
                [name]: value
            }
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Show loading indicator
        try {
          const res = await fetch("/api/auth/sign-up", {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) { // Handle errors
            throw new Error(data.message || 'Sign up failed');
          }
          // Success: Handle successful sign-up (e.g., redirect)
          console.log(data);
        } catch (err) {
          setError(err.message); // Display error
        } finally {
          navigate('/sign-in');
          setIsLoading(false); // Hide loading indicator
        }
      };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"> 
      <div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">Sign Up</h1>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} >
          {/* Username */}
          <input 
            type="text" 
            id="username" 
            name='username'
            placeholder="Username"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
            onChange={handleChange}
          />

          {/* Email */}
          <input 
            type="email" 
            id="email" 
            name='email'
            placeholder="Email address"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            onChange={handleChange}
          />

          {/* Password */}
          <input 
            type="password" 
            id="password" 
            name='password'
            placeholder="Password"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            onChange={handleChange}
          />
          {error && <p className="text-red-500 text-sm">username or email already exists</p>}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className='flex flex-row gap-2'>
            <p>have as account? </p>
            <Link to={"/sign-in"}>
                <button className="text-blue-500">Sign in</button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
