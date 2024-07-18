// Suggested code may be subject to a license. Learn more: ~LicenseLog:3996686804.
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn";
import Header from "./pages/Header";
import SignInContextProvider from "./context/SignInContext";
import SignOut from "./pages/SignOut";

const App = () => {

  return (
    <BrowserRouter>
    <SignInContextProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-out" element={<SignOut />} />
      </Routes>
    </SignInContextProvider>
    </BrowserRouter>
  )
};

export default App;