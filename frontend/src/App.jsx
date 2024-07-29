import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import SignOut from "./pages/SignOut";
import VerifyAuth from "./components/VerifyAuth";
import UpdateProfile from "./pages/UpdateProfile";
import DeleteUserProfile from "./pages/DeleteUserProfile";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import ListingInfo from "./pages/ListingInfo";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<VerifyAuth><Profile /></VerifyAuth>} />
        <Route path="/update-profile" element={<VerifyAuth><UpdateProfile /></VerifyAuth>} />
        <Route path="/delete-account" element={<VerifyAuth><DeleteUserProfile /></VerifyAuth>} />
        <Route path="/sign-out" element={<VerifyAuth><SignOut /></VerifyAuth>} />
        <Route path="/create-listing" element={<VerifyAuth><CreateListing /></VerifyAuth>} />
        <Route path="/update-listing/:listingId" element={<VerifyAuth><UpdateListing /></VerifyAuth>} />
        <Route path="/listing/:listingId" element={<ListingInfo />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App;