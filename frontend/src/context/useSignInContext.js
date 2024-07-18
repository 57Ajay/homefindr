import { useContext } from 'react';
import { SignInContext } from './SignInContext';

const useSignInContext = () => {
  const context = useContext(SignInContext);
  if (context === undefined) {
    throw new Error('useSignInContext must be used within a SignInContextProvider');
  }
  return context;
};

export default useSignInContext;
