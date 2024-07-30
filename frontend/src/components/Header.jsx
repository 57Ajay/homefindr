import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaHome, FaInfoCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User, LogOut, LogIn, ChevronDown } from 'lucide-react';


const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };


    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);


    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearchSubmit = (e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const url = urlParams.get("searchTerm");
    if(url){
      setSearchTerm(url)
    }
  }, []);


  return (
    <>
      <header 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
          <Link to="/" className="flex items-center text-slate-800 hover:text-slate-600 transition-all duration-300 transform hover:scale-105">
            <FaHome className="mr-2 text-2xl" />
            <h1 className="text-xl font-bold sm:text-2xl flex flex-wrap">
              <span className="text-blue-600">Home</span>
              <span className="text-slate-800">Findr</span>
            </h1>
          </Link>
          <form name="Search" className="relative group" onSubmit={handleSearchSubmit} >
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
              className="bg-gray-100 py-2 px-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 w-24 sm:w-64 focus:w-72"
            />
            <button>
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            </button>
          </form>
          <ul className="flex gap-6 items-center">
            <Link to="/" className="items-center text-slate-700 hover:text-blue-600 transition-all duration-300 hidden sm:flex">
              <FaHome className="mr-1" />
              <span className="font-medium">Home</span>
            </Link>
            <Link to="/about" className="items-center text-slate-700 hover:text-blue-600 transition-all duration-300 hidden sm:flex">
              <FaInfoCircle className="mr-1" />
              <span className="font-medium">About</span>
            </Link>
            <li className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 transition-all duration-300 focus:outline-none"
              >
                {currentUser ? (
                  <>
                    <span className="flex items-center gap-2">
                      {currentUser.data.avatar ? (
                        <img src={currentUser.data.avatar} alt="User avatar" className="rounded-full w-8 h-8 object-cover border-2 border-blue-400" />
                      ) : (
                        <span className="font-medium">{currentUser.data.username}</span>
                      )}
                    </span>
                    <ChevronDown size={16} className="ml-1" />
                  </>
                ) : (
                  <>
                    <User size={24} />
                    <ChevronDown size={16} className="ml-1" />
                  </>
                )}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {currentUser ? (
                    <>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User size={16} className="inline mr-2" />
                        Profile
                      </Link>
                      <Link 
                        to="/sign-out" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LogOut size={16} className="inline mr-2" />
                        Sign Out
                      </Link>
                    </>
                  ) : (
                    <Link 
                      to="/sign-in" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LogIn size={16} className="inline mr-2" />
                      Sign In
                    </Link>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </header>
     
    </>
  );
};

export default Header;