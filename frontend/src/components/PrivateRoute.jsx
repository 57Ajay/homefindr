import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Profile from "../pages/Profile";
import { Loader2 } from "lucide-react";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken || currentUser === null) {
        // Clear any remaining auth data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch({ type: 'DELETE_USER' });
        navigate("/sign-in");
      } else {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [currentUser, navigate, dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return currentUser ? <Profile /> : null;
};

export default PrivateRoute;