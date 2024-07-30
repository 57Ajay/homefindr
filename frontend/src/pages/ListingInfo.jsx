import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Home, ParkingCircle, Bed, Bath, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

const ListingInfo = () => {
  const params = useParams();
  const [listingDetails, setListingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchListing = useCallback(async () => {
    setLoading(true);
    try {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListingDetails(data.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  }, [params.listingId]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  useEffect(() => {
    if (listingDetails && listingDetails.imageUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          (prevIndex + 1) % listingDetails.imageUrls.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [listingDetails]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listingDetails.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % listingDetails.imageUrls.length
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-8 animate-pulse">
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded-full w-full"></div>
          <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded-full w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!listingDetails) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 animate-fadeIn">
      <div className="relative h-[70vh] overflow-hidden rounded-2xl shadow-2xl">
        {listingDetails.imageUrls.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Listing Image ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        ))}
        <button
          onClick={handlePrevImage}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <h1 className="text-5xl font-bold text-gray-800 mb-6">{listingDetails.name}</h1>
      
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center text-blue-600">
                <Home className="mr-3" /> Listing Details
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="font-semibold mr-2 text-gray-700">ID:</span> 
                  <span className="text-gray-600">{listingDetails._id}</span>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold mr-2 text-gray-700">Type:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {listingDetails.type}
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold mr-2 text-gray-700">Furnished:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listingDetails.furnished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listingDetails.furnished ? "Yes" : "No"}
                  </span>
                </li>
                <li className="flex items-center">
                  <ParkingCircle className="mr-3 text-blue-500" />
                  <span className="font-semibold mr-2 text-gray-700">Parking:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listingDetails.parking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listingDetails.parking ? "Available" : "Not Available"}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center text-blue-600">
                <Home className="mr-3" /> Additional Information
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="font-semibold mr-2 text-gray-700">Address:</span> 
                  <span className="text-gray-600">{listingDetails.address}</span>
                </li>
                <li className="flex items-center">
                  <Bed className="mr-3 text-blue-500" />
                  <span className="font-semibold mr-2 text-gray-700">Bedrooms:</span>
                  <span className="text-gray-600">{listingDetails.bedrooms}</span>
                </li>
                <li className="flex items-center">
                  <Bath className="mr-3 text-blue-500" />
                  <span className="font-semibold mr-2 text-gray-700">Bathrooms:</span>
                  <span className="text-gray-600">{listingDetails.bathrooms}</span>
                </li>
                <li className="flex items-center">
                  <DollarSign className="mr-3 text-green-500" />
                  <span className="font-semibold mr-2 text-gray-700">Regular Price:</span>
                  <span className="text-gray-600">${listingDetails.regularPrice}</span>
                </li>
                {listingDetails.discountPrice && (
                  <li className="flex items-center">
                    <DollarSign className="mr-3 text-red-500" />
                    <span className="font-semibold mr-2 text-gray-700">Discount Price:</span>
                    <span className="text-gray-600">${listingDetails.discountPrice}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Description</h2>
            <p className="text-gray-600 leading-relaxed">{listingDetails.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;