import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LogOut, Mail, User, Phone, MapPin, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { updateUserSuccess } from '../redux/user/userSlice';

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
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-700">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
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
      console.error(error);
    }
  };
  
  const handleDeleteListing = async (index) => {
    try {
      const listingId = userListings[index]._id;
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.error('Error deleting listing:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mt-10">
        <div className="bg-slate-700 shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h3 className="text-2xl font-bold text-white">User Profile</h3>
          </div>
          <div className="px-6 py-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center mb-8">
              {currentUser.data.avatar ? (
                <img
                  src={currentUser.data.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-4 sm:mb-0 sm:mr-8"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-4 sm:mb-0 sm:mr-8 shadow-lg">
                  <User size={48} className="text-white" />
                </div>
              )}
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                  {currentUser.data.username || 'Unknown User'}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Joined on {new Date(currentUser.data.createdAt).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                  <div className="flex items-center bg-blue-100 rounded-full px-4 py-2">
                    <Mail className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-800">{currentUser.data.email || 'No email'}</span>
                  </div>
                  {currentUser.data.phone && (
                    <div className="flex items-center bg-green-100 rounded-full px-4 py-2">
                      <Phone className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800">{currentUser.data.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {currentUser.data.address && (
              <div className="flex items-center bg-yellow-100 rounded-lg px-4 py-3 mb-8">
                <MapPin className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
                <span className="text-yellow-800">{currentUser.data.address}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/update-profile" className="w-full">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                  <Edit className="w-5 h-5 mr-2" />
                  Update Profile
                </button>
              </Link>
              <Link to="/create-listing" className="w-full">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Listing
                </button>
              </Link>
              <button
                onClick={handleShowListings}
                disabled={loadingListing}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <Eye className="w-5 h-5 mr-2" />
                {loadingListing ? "Loading..." : "View Listings"}
              </button>
              <Link to="/sign-out" className="w-full">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out">
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </button>
              </Link>
              <Link to="/delete-account" className="w-full">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out">
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete Account
                </button>
              </Link>
            </div>
          </div>
        </div>

        {showListingError && (
          <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
            <p className="font-bold">Error</p>
            <p>Unable to fetch listings. Please try again later.</p>
          </div>
        )}

        {userListings.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-200 mb-6">Your Listings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((listing, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{listing.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button onClick={() => handleDeleteListing(index)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                        Delete
                      </button>
                      <Link to={`/update-listing/${listing._id}`} className="flex-1">
                        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                          Edit
                        </button>
                      </Link>
                      <Link to={`/listing/${listing._id}`} className="flex-1">
                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;