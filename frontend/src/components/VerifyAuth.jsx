import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PropTypes from 'prop-types';

const VerifyAuth = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser === null) {
      navigate("/sign-in");
    } else {
      setIsLoading(false);
    }
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return currentUser ? children : null;
};

VerifyAuth.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default VerifyAuth;