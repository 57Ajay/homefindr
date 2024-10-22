import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DeleteUserProfile = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/user/delete-user', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        credentials: 'include', // This is important for cookie handling
      });

      if (response.ok) {
        const data = await response.json();
        // Clear all client-side authentication data
        dispatch({ type: 'DELETE_USER' });
        localStorage.clear(); // Clear all localStorage items
        sessionStorage.clear(); // Clear all sessionStorage items as well
        setSuccess(data.data.message || 'Profile deleted successfully!');

        // Short delay before navigation to ensure state updates
        setTimeout(() => {
            window.location.reload();
            navigate("/sign-in");
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData?.message || 'Failed to delete profile');
      }
    } catch (error) {
      setError('An error occurred while deleting the profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-slate-950 rounded-md shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-white">Delete Profile</h1>
      <p className="text-red-700 mb-4">This action cannot be undone. Are you sure you want to proceed?</p>
      <p className='font-bold text-red-800 mb-3'> You will loose all your listings and data</p>
      <button 
        onClick={handleDelete} 
        disabled={loading}
        className={`w-full py-2 rounded-md text-white ${loading ? 'bg-red-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
      >
        {loading ? 'Deleting...' : 'Delete Profile'}
      </button>
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      {success && <p className="mt-4 text-green-500 text-center">{success}</p>}
    </div>
  );
};

export default DeleteUserProfile;