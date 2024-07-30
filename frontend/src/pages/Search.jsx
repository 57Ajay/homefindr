import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    offer: false,
    furnished: false,
    parking: false,
    type: 'all',
  });
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      const response = await fetch(`/api/listing/get?${params}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setListings(data.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
    setLoading(false);
  }, [location.search]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
    // Set initial filters from URL
    setFilters({
      offer: urlParams.get('offer') === 'true',
      furnished: urlParams.get('furnished') === 'true',
      parking: urlParams.get('parking') === 'true',
      type: urlParams.get('type') || 'all',
    });
    setSort(urlParams.get('sort') || 'createdAt');
    setOrder(urlParams.get('order') || 'desc');

    fetchListings();
  }, [location.search, fetchListings]);



  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', searchTerm);
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== false && value !== 'all') {
        urlParams.set(key, value);
      }
    });
    urlParams.set('sort', sort);
    urlParams.set('order', order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Listings</h1>
      
      <form onSubmit={handleSearchSubmit} className="mb-8">
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <select
              value={filters.type}
              onChange={handleFilterChange}
              name="type"
              className="w-full p-2 border rounded"
            >
              <option value="all">All Types</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full sm:w-1/3 px-2 mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="offer"
                checked={filters.offer}
                onChange={handleFilterChange}
                className="mr-2"
              />
              Offer
            </label>
          </div>
          <div className="w-full sm:w-1/3 px-2 mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="furnished"
                checked={filters.furnished}
                onChange={handleFilterChange}
                className="mr-2"
              />
              Furnished
            </label>
          </div>
          <div className="w-full sm:w-1/3 px-2 mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="parking"
                checked={filters.parking}
                onChange={handleFilterChange}
                className="mr-2"
              />
              Parking
            </label>
          </div>
        </div>

        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="createdAt">Date</option>
              <option value="regularPrice">Price</option>
            </select>
          </div>
          <div className="w-full md:w-1/2 px-2 mb-2">
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="border rounded-lg overflow-hidden shadow-lg">
              <img src={listing.imageUrls[0]} alt={listing.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{listing.name}</h2>
                <p className="text-gray-600 mb-2">{listing.address}</p>
                <p className="text-gray-800 mb-2">{listing.description.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    ${listing.offer ? listing.discountPrice : listing.regularPrice}
                    {listing.type === 'rent' && '/month'}
                  </span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                    {listing.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;