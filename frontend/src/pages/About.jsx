import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

const About = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { email, username } = currentUser.data;

  return (
    <div className="max-w-7xl mx-auto p-8 bg-slate-900 h-screen rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-indigo-900 mb-8 mt-10">Welcome to HomeFindr!</h1>
      <p className="text-lg text-black font-semibold mb-6 shadow-sm bg-slate-200 p-2 rounded-md">
        HomeFindr is your premier destination for finding the perfect home. Whether you are a first-time home buyer, looking to upgrade, or seeking an investment property, HomeFindr provides a seamless and user-friendly platform to explore a wide range of properties.
      </p>
      <p className="text-lg text-black font-semibold mb-6 shadow-md bg-slate-300 p-2 rounded-md">
        Our platform offers a variety of features to enhance your property search experience. You can save your favorite listings, receive notifications about new properties that match your criteria, and even contact agents directly through the platform.
      </p>
      <p className="text-lg text-black font-semibold mb-6 shadow-lg bg-slate-400 p-2 rounded-md">
        At HomeFindr, we believe in transparency and providing our users with all the information they need. Each listing includes high-quality images, detailed descriptions, and key information such as price, location, and property features.
      </p>
      <p className="text-lg text-black font-semibold mb-6 shadow-xl bg-slate-400 p-2 rounded-md">
        We are committed to providing excellent customer service. Our team is always available to assist you with any questions or concerns you may have. Whether you need help navigating the platform or require more information about a particular property, we are here to help.
      </p>
      <p className="text-lg text-black font-semibold mb-6 shadow-2xl bg-slate-600 p-2 rounded-md">
        Thank you for choosing HomeFindr, <span className="text-indigo-900 font-bold">{username}</span> (<span className="text-red-900">{email}</span>). We are excited to be part of your journey to finding the perfect home. Explore our listings today and discover your dream property!
      </p>
      <div className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded mt-4 text-center shadow-lg">
        <Link to={"/listings"} className="hover:underline">Start Exploring</Link>
      </div>
    </div>
  );
};

export default About;