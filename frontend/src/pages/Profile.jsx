import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LogOut, Mail, User, Phone, MapPin } from 'lucide-react';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
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
                <h2 className="text-2xl font-bold text-gray-900">{currentUser.data.username}</h2>
                <p className="text-sm text-gray-500">Member since {new Date(currentUser.data.createdAt).toLocaleDateString()}</p> 
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <span>{currentUser.data.email}</span>
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
        <div className="px-4 py-4 sm:px-6 bg-gray-50">
          <Link to={"/sign-out"}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;