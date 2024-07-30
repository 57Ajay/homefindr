import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateListing = () => {
    const { currentUser } = useSelector((state) => state.user);
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

    const [uploading, setUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const navigate = useNavigate();

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleImageSubmit = () => {
        if (files.length === 0) {
            setImageUploadError("Upload at least one image");
        } else if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData((prevFormData) => ({
                    ...prevFormData, imageUrls: prevFormData.imageUrls.concat(urls)
                }));
                setImageUploadError(false);
                setUploading(false);
            }).catch(() => {
                setImageUploadError("Image Upload Failed (2MB/Image max Image size)");
            });
        } else {
            setImageUploadError("You can only upload a maximum of 6 images per listing");
            setUploading(false);
        }
    };

    const handleRemoveImage = (index) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            imageUrls: prevFormData.imageUrls.filter((_, i) => i !== index)
        }));
    };

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData((prevFormData) => ({
                ...prevFormData,
                ...data.data
            }));
        }
        fetchListing();
    }, [params]);

    const handleChange = (e) => {
        const { id, value, checked } = e.target;
        if (id === "sale" || id === "rent") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                type: id
            }));
        } else if (id === "parking" || id === "furnished" || id === "offer") {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [id]: checked
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [id]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError("Upload at least one image");
            if (+formData.regularPrice < +formData.discountPrice) return setError("Discount Price should be less than Regular Price");

            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: "PATCH",
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
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data.data._id}`);
        } catch (error) {
            setError(error.message || "Form submission failed");
            setLoading(false);
        }
    };

    return (
        <main className="w-full mx-auto p-4 sm:p-6 md:p-10 font-semibold bg-slate-800 rounded shadow-lg">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 text-white mt-10">Update a Listing</h1>
            <form onSubmit={handleSubmit} className="space-y-4 text-white">
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
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center">
                            <input
                                checked={formData.type === "sale"}
                                onChange={handleChange}
                                type="checkbox"
                                id="sale"
                                className="w-4 h-4 bg-white border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
                            />
                            <label htmlFor="sale" className="ml-2">Sell</label>
                        </div>

                        <div className="flex items-center">
                            <input
                                checked={formData.type === "rent"}
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
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label htmlFor="bedrooms" className="block mb-1 font-medium">Bedrooms</label>
                            <input
                                onChange={handleChange}
                                value={formData.bedrooms}
                                type="number"
                                id="bedrooms"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                            />
                        </div>

                        <div>
                            <label htmlFor="bathrooms" className="block mb-1 font-medium">Bathrooms</label>
                            <input
                                onChange={handleChange}
                                value={formData.bathrooms}
                                type="number"
                                id="bathrooms"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="regularPrice" className="block mb-1 font-medium">Regular Price</label>
                        <input
                            onChange={handleChange}
                            value={formData.regularPrice}
                            type="number"
                            placeholder="Regular Price"
                            maxLength={50}
                            minLength={0}
                            id="regularPrice"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        />
                    </div>

                    {formData.offer && (
                        <div>
                            <label htmlFor="discountPrice" className="block mb-1 font-medium">Discount Price</label>
                            <input
                                onChange={handleChange}
                                value={formData.discountPrice}
                                type="number"
                                placeholder="Discount Price"
                                maxLength={50}
                                minLength={0}
                                id="discountPrice"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                            />
                        </div>
                    )}

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

                    <div>
                        <label htmlFor="images" className="block mb-1 font-medium">Images</label>
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            type="file"
                            id="images"
                            accept=".jpg,.png,.jpeg"
                            multiple
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {files.length > 0 && (
                            <button
                                type="button"
                                onClick={handleImageSubmit}
                                className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                Upload {files.length} Image{files.length > 1 ? "s" : ""}
                            </button>
                        )}
                    </div>

                    {imageUploadError && (
                        <div className="text-red-500 text-sm">{imageUploadError}</div>
                    )}

                    {uploading && (
                        <div className="text-blue-500 text-sm">
                            Uploading {imageUploadProgress.toFixed(0)}%
                        </div>
                    )}

                    {formData.imageUrls.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            {formData.imageUrls.map((url, index) => (
                                <div key={index} className="relative">
                                    <img src={url} alt="Listing" className="w-full h-full object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {loading ? "Updating..." : "Update Listing"}
                    </button>
                </div>
            </form>
        </main>
    );
}

export default UpdateListing;
