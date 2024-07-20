import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const UpdateProfile = () => {
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: currentUser?.data?.username || '',
    email: currentUser?.data?.email || '',
    avatar: currentUser?.data?.avatar || "",
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/user/update-user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        setSuccess('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData?.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred while updating the profile, consider changing username or email or consider Resign-in');
    } finally {
      setLoading(false);
    }
  };
  console.log(formData);
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-md shadow-md"> 
      <h1 className="text-2xl font-semibold mb-4">Update Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input 
            type="text" 
            id="username" 
            value={formData.username} 
            onChange={handleChange}
            className="w-full p-2 border rounded-md" 
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            value={formData.email} 
            onChange={handleChange}
            className="w-full p-2 border rounded-md" 
          />
        </div>

        <div>
          <label htmlFor="avatar" className="block text-gray-700">avatar</label>
          <input 
            type="url" 
            id="avatar" 
            value={formData.avatar} 
            onChange={handleChange}
            className="w-full p-2 border rounded-md" 
          />
          <p className='text-red-700 break-words'>To update the profile enter valid link of your image from a cloud provider (ex. google photos).</p>
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700">New Password (optional)</label>
          <input 
            type="password" 
            id="password" 
            value={formData.password} 
            onChange={handleChange}
            className="w-full p-2 border rounded-md" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      {success && <p className="mt-4 text-green-500 text-center">{success}</p>}
    </div>
  );
};

export default UpdateProfile;
