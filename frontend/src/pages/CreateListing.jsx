import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {

    const { currentUser } = useSelector((state) => state.user)
    // console.log(currentUser);
    const [files, setFiles] = useState([]);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
        imageUrls: [],
    });

    const [uploading, setUploading] = useState(false)
    const [imageUploadError, setImageUploadError] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const storeImage = async(file)=>{
        return new Promise((resolve, reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    setImageUploadProgress(progress);
                    console.log(`Upload is ${progress}% done`);
                },
                (error)=>{
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL)
                    });
                }
            );
        });
    };

    const handleImageSubmit = ()=>{
        if(files.length == 0){
            setImageUploadError("Upload at least one image");
        }else if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
            for (let i=0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=>{
                setFormData({
                    ...formData, imageUrls: formData.imageUrls.concat(urls)
                });
                setImageUploadError(false);
                setUploading(false);
            }).catch(()=>{
                setImageUploadError("Image Upload Failed (2MB/Image max Image size)");
                setLoading(false);
                setUploading(false);
            });  
        }else{
            setImageUploadError("You can only upload maximum of 6 images per listing");
            setUploading(false);
            setLoading(false);
        }
    };
    
    const handleRemoveImage = (index) => {
        
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        });
    };
    // console.log(formData);
    
    const handleChange = (e)=>{
        if(e.target.id === "sale" || e.target.id === "rent"){
            setFormData({
                ...formData,
                type: e.target.id
            });
        }
        if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer"){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            });
        }
        if(e.target.type === "number" || e.target.type === "text" || e.target.type == "textarea"){
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            });
        }
        
    };

   

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) return setError("Upload at least one image");
            if(+formData.regularPrice < +formData.discountPrice) return setError("Discount Price should be less than Regular Price");

            setLoading(true);
            setError(false);
            const res = await fetch("/api/listing/create", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser.data._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message);
            }
            navigate(`/listing/${data.data._id}`)
        } catch (error) {
            setError(error.message || "Form submission failed");
            setLoading(false);
        }

    }

  return (
    <main className="w-full h-screen mx-auto p-4 sm:p-6 md:p-10 bg-slate-950 text-white rounded shadow-lg">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 mt-10 text-center">Create a Listing</h1>
      <form
      onSubmit={handleSubmit}
      className="space-y-4 text-white font-semibold">
        <div className="grid grid-cols-1 gap-4">

          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
            <input 
            onChange={handleChange}
            value={formData.name}
              type="text"
              placeholder="Name"
              maxLength={60}
              minLength={7}
              id="name"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-medium">Description</label>
            <textarea 
            onChange={handleChange}
            value={formData.description}
              placeholder="Description"
              maxLength={500}
              minLength={20}
              id="description"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          <div>
            <label htmlFor="address" className="block mb-1 font-medium">Address</label>
            <input 
            onChange={handleChange}
            value={formData.address}
              type="text"
              placeholder="Address"
              maxLength={37}
              minLength={3}
              id="address"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input 
              checked={formData.type==="sale"}
              onChange={handleChange}
              
                type="checkbox"
                id="sale"
                className="w-4 h-4 bg-white border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
              />
              <label htmlFor="sale" className="ml-2">Sell</label>
            </div>

            <div className="flex items-center">
              <input 
              checked={formData.type==="rent"}
              onChange={handleChange}
                type="checkbox"
                id="rent"
                className="w-4 h-4 bg-white border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
              />

              <label htmlFor="rent" className="ml-2">Rent</label>
            </div>

            <div className="flex items-center">
              <input 
              onChange={handleChange}
              checked={formData.parking}
                type="checkbox"
                id="parking"
                className="w-4 h-4 bg-white border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
              />
              <label htmlFor="parking" className="ml-2">Parking spot</label>
            </div>

            <div className="flex items-center">
              <input 
              onChange={handleChange}
              checked={formData.furnished}
                type="checkbox"
                id="furnished"
                className="w-4 h-4 bg-white border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
              />
              <label htmlFor="furnished" className="ml-2">Furnished</label>
            </div>
            <div className="flex items-center">
              <input 
              onChange={handleChange}
              checked={formData.offer}
                type="checkbox"
                id="offer"
                className="w-4 h-4 bg-white border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
              />
              <label htmlFor="offer" className="ml-2">Offer</label>
            </div>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bedrooms" className="block mb-1 font-medium">Beds</label>
              <input
              onChange={handleChange} 
              value={formData.bedrooms}
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>

            <div>
              <label htmlFor="bathrooms" className="block mb-1 font-medium">Baths</label>
              <input 
              onChange={handleChange}
              value={formData.bathrooms}
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>
            <div>
              <label htmlFor="regularPrice" className="block mb-1 font-medium">
                Regular price
                <span className="text-sm ml-1">($ / month)</span>
              </label>
              <input 
              onChange={handleChange}
              value={formData.regularPrice}
                type="number"
                id="regularPrice"
                min={50}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>
            
            {formData.offer &&
                <div>
                    <label htmlFor="discountPrice" className="block mb-1 font-medium">Discounted Price</label>
                    <input 
                    onChange={handleChange}
                    value={formData.discountPrice}
                    type="number"
                    id="discountPrice"
                    min={0}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
              </div>
            }
            
          </div>
        </div>

        <div>

          <p className="font-medium mb-2">Images: <span className="text-sm font-normal">The first image will be the cover (max 6)</span></p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 

            onChange={(e)=>setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {uploading &&
                <p className='text-amber-500 text-sm'>
                    Upload is {Math.floor(imageUploadProgress)}% done
                </p>
            }
            <button 
            onClick={handleImageSubmit}
            disabled={uploading}
            type='button'
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                {uploading ? "Uploading...": "Upload"}
            </button>
          </div>
        </div>
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-950 text-white font-bold py-3 px-4 rounded w-full transition duration-300 ease-in-out">
            {loading ? "Creating..." : "Create listing"}
        </button>
        {error && <p className="text-red-700 text-sm font-semibold">{error}</p>}
        <p className='text-red-600'>{imageUploadError && imageUploadError}</p>
        
            {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index)=>(
                <div key={url} className='flex flex-row justify-between gap-2 border border-slate-800 p-2'>
                    <img key={url} src={url} alt="Listing Image" className='max-w-xs max-h-40 object-cover rounded-md' />
                    <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75 font-semibold'>delete</button>
                </div>
                
            ))
            }
      
      </form>
    </main>
  );
};

export default CreateListing;