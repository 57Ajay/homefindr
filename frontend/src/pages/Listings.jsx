import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

const ListingCard = React.memo(({ listing, index }) => (
  <motion.div
    className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
  >
    <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}

        
      <img
        src={listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls[0] : "/images/villa5.jpg"}
        alt={`${listing.name} - First image`}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/villa5.jpg";
        }}
      />
    </div>
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{listing.name}</h2>
      <p className="text-gray-600 mb-4">{listing.description}</p>
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="w-full sm:w-auto mb-2 sm:mb-0">
          <p className="text-sm text-gray-500">Regular Price</p>
          <p className="text-xl font-semibold text-green-600">${listing.regularPrice.toLocaleString()}</p>
        </div>
        {
            listing.offer && 
            <div className="w-full sm:w-auto">
                <p className="text-sm text-gray-500">Discount Price</p>
                <p className="text-xl font-semibold text-green-600">${listing.discountPrice.toLocaleString()}</p>   
            </div>
        }
        
      </div>
      <div className="flex flex-wrap justify-between text-sm text-gray-500 mb-4">
        <span className="flex items-center mb-2 sm:mb-0"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"/></svg>{listing.bedrooms} beds</span>
        <span className="flex items-center mb-2 sm:mb-0"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4a1 1 0 011-1h1a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm4 0a1 1 0 011-1h1a1 1 0 011 1v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4zm5-1a1 1 0 00-1 1v12a1 1 0 001 1h1a1 1 0 001-1V4a1 1 0 00-1-1h-1z"/></svg>{listing.bathrooms} baths</span>
        <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
      </div>
      <Link to={`/listing/${listing._id}`} className="block">
        <button className='bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'>
          View Property
        </button>
      </Link>
    </div>
  </motion.div>
));

ListingCard.displayName = 'ListingCard';

ListingCard.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    regularPrice: PropTypes.number.isRequired,
    discountPrice: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    furnished: PropTypes.bool.isRequired,
    offer: PropTypes.bool.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchListings = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/listing/get?limit=6&startIndex=${(page - 1) * 6}`);
      if (!res.ok) throw new Error('Failed to fetch listings');
      const data = await res.json();
      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setListings(prev => [...prev, ...data.data]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    fetchListings();
  }, []); 

  const memoizedListings = useMemo(() => listings.map((listing, index) => (
    <ListingCard key={listing._id} listing={listing} index={index} />
  )), [listings]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800 mt-7">Featured Listings</h1>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {memoizedListings}
      </div>
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={fetchListings}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Listings;