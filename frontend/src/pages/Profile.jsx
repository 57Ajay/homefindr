
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LogOut, Mail, User, Phone, MapPin, Edit, Trash2 } from 'lucide-react';
import { updateUserSuccess } from '../redux/user/userSlice';
import { useState, useEffect } from 'react';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showListingError, setShowListingError] = useState(false);
  const [loadingListing, setLoadingListing] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (currentUser) {
      dispatch(updateUserSuccess(currentUser));
      setLoadingUser(false);
    }
  }, [currentUser, dispatch]);

  if (loadingUser) {
    return <div>Loading...</div>; // Handle loading or no data state
  }

  const handleShowListings = async () => {
    try {
      setLoadingListing(true);
      setShowListingError(false);
      if (!currentUser.data._id) {
        throw new Error('Invalid user ID');
      }
      const res = await fetch(`/api/user/listings/${currentUser.data._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data.data);
      setLoadingListing(false);
    } catch (error) {
      setShowListingError(true);
      setLoadingListing(false);
      console.error(error); // Consider using a more robust logging solution
    }
  };
  
  const handleDeleteListing = async(index)=>{
    try {
      const listingId = userListings[index]._id;
      // console.log("listingId:\n",listingId)
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
      }})
      const data = res.json();
      if (data.success === false){
        console.log(data.message);
        return;
      }
      setUserListings((prev)=> prev.filter((listing)=>listing._id != listingId));
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else if (error instanceof TypeError && error.message.includes('NetworkError')) {
        console.log('Network error');
      } else {
        console.log('Other error:', error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              {currentUser.data.avatar ? (
                <img
                  src={currentUser.data.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full mr-4"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  <User size={40} className="text-gray-600" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentUser.data.username || 'Unknown User'}
                </h2>
                <p className="text-sm text-gray-500">
                  Joined On{' '}
                  {new Date(currentUser.data.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <span>{currentUser.data.email || 'No email'}</span>
              </div>
              {currentUser.data.phone && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-2" />
                  <span>{currentUser.data.phone}</span>
                </div>
              )}
              {currentUser.data.address && (
                <div className="flex items-center col-span-2">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <span>{currentUser.data.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-4 sm:px-6 bg-gray-50 flex flex-wrap gap-4">
          <Link to="/update-profile">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Edit className="w-5 h-5 mr-2" />
              Update Profile
            </button>
          </Link>
          
          <Link to="/create-listing">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <LogOut className="w-5 h-5 mr-2" />
              Create Listing
            </button>
          </Link>

          <button
            onClick={handleShowListings}
            disabled={loadingListing}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="w-5 h-5 mr-2" />
            {loadingListing ? "Getting listings..." : "View Listings"}
          </button>

          <Link to="/sign-out">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </Link>

          <Link to="/delete-account">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Account
            </button>
          </Link>
        </div>
      </div>

      {showListingError ? (
        <div className="text-red-500 font-bold mb-4">
          Error Showing Listings
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 mt-4">
          {userListings.map((listing, index) => (
            <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg shadow-md w-80 hover:shadow-xl transition duration-300 ease-in-out">
              <img
                src={listing.imageUrls[0]}
                alt="listing image"
                className="w-full h-48 object-cover rounded-lg"
              />
              <h1 className="text-lg font-bold mb-2">{listing.name}</h1>
              <div className="flex gap-2">
                <button onClick={()=>handleDeleteListing(index)} type='button' className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                    Edit
                  </button>
                </Link>
                <Link to={`/listing/${listing._id}`}>
                  <button className="bg-green-500 hover:bg-green-950 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                    View Listing
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;