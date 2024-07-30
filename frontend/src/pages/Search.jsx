import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';

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
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Find Your Perfect Home</h1>
        
        <form onSubmit={handleSearchSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <select
                value={filters.type}
                onChange={handleFilterChange}
                name="type"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap -mx-2 mb-4">
            {['offer', 'furnished', 'parking'].map((filter) => (
              <div key={filter} className="w-full sm:w-1/3 px-2 mb-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={filter}
                    checked={filters[filter]}
                    onChange={handleFilterChange}
                    className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 capitalize">{filter}</span>
                </label>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full md:w-1/2 px-2 mb-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Date</option>
                <option value="regularPrice">Price</option>
              </select>
            </div>
            <div className="w-full md:w-1/2 px-2 mb-2">
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">
            Search
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
                <img src={listing.imageUrls[0]} alt={listing.name} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-800">{listing.name}</h2>
                  <p className="text-gray-600 mb-2">{listing.address}</p>
                  <p className="text-gray-700 mb-4 line-clamp-2">{listing.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ${listing.offer ? listing.discountPrice : listing.regularPrice}
                      {listing.type === 'rent' && '/month'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${listing.type === 'rent' ? 'bg-green-500 text-white' : 'bg-purple-500 text-white'}`}>
                      {listing.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;