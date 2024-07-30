import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Home, ParkingCircle, Bed, Bath, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

const ListingInfo = () => {
  const params = useParams();
  const [listingDetails, setListingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
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
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchListing();
  }, [params]);

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
      <div className="max-w-5xl mx-auto p-4 space-y-4 animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!listingDetails) return null;
  // console.log(listingDetails)
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 animate-fadeIn">
      <div className="relative h-96 overflow-hidden rounded-lg">
        {listingDetails.imageUrls.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Listing Image ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <button
          onClick={handlePrevImage}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <h1 className="text-4xl font-bold text-gray-800">{listingDetails.name}</h1>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Home className="mr-2" /> Listing Details
              </h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="font-semibold mr-2">ID:</span> 
                  <span>{listingDetails._id}</span>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold mr-2">Type:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {listingDetails.type}
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold mr-2">Furnished:</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    listingDetails.furnished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listingDetails.furnished ? "Yes" : "No"}
                  </span>
                </li>
                <li className="flex items-center">
                  <ParkingCircle className="mr-2 text-blue-500" />
                  <span className="font-semibold mr-2">Parking:</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    listingDetails.parking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listingDetails.parking ? "Available" : "Not Available"}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Home className="mr-2" /> Additional Information
              </h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="font-semibold mr-2">Address:</span> 
                  <span>{listingDetails.address}</span>
                </li>
                <li className="flex items-center">
                  <Bed className="mr-2 text-blue-500" />
                  <span className="font-semibold mr-2">Bedrooms:</span>
                  <span>{listingDetails.bedrooms}</span>
                </li>
                <li className="flex items-center">
                  <Bath className="mr-2 text-blue-500" />
                  <span className="font-semibold mr-2">Bathrooms:</span>
                  <span>{listingDetails.bathrooms}</span>
                </li>
                <li className="flex items-center">
                  <DollarSign className="mr-2 text-green-500" />
                  <span className="font-semibold mr-2">Regular Price:</span>
                  <span>${listingDetails.regularPrice}</span>
                </li>
                {listingDetails.discountPrice && (
                  <li className="flex items-center">
                    <DollarSign className="mr-2 text-red-500" />
                    <span className="font-semibold mr-2">Discount Price:</span>
                    <span>${listingDetails.discountPrice}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{listingDetails.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingInfo;