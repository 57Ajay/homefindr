import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

const UpdateProfile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: currentUser?.data?.username || '',
    email: currentUser?.data?.email || '',
    password: '',
    avatar: currentUser?.data?.avatar || ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(undefined);
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

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
      setError('An error occurred while updating the profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadPercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.error('Upload error:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
          setSuccess('Image uploaded successfully!');
          setFileUploadPercentage(0);
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-center">Update Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center justify-center">
          <input
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.data.avatar}
            alt="Profile-Photo"
            className='rounded-full w-28 h-28 object-cover cursor-pointer transition-transform duration-300 hover:scale-110'
          />
          {fileUploadPercentage > 0 && fileUploadPercentage < 100 && (
            <p className="text-sm text-gray-500 mt-2">Upload progress: {fileUploadPercentage}%</p>
          )}
          {fileUploadError && (
            <p className="text-sm text-red-500 mt-2">Error uploading file. Please try again.</p>
          )}
        </div>

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