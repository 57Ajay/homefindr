import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const SignInContext = createContext();

const SignInContextProvider = ({ children }) => {
  const [signInStatus, setSignInStatus] = useState(false);

  return (
    <SignInContext.Provider value={{ signInStatus, setSignInStatus }}>
      {children}
    </SignInContext.Provider>
  );
};

SignInContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SignInContextProvider;
