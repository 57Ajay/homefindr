import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User, LogOut, LogIn, ChevronDown } from 'lucide-react';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
      const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
              setIsDropdownOpen(false);
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

  return (
      <header className="bg-stone-300 shadow-md">
          <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
              <Link to="/">
                  <h1 className="text-sm font-bold sm:text-xl flex flex-wrap transform transition-transform hover:scale-110">
                      <span className="text-slate-700">Home</span>
                      <span className="text-slate-950">Findr</span>
                  </h1>
              </Link>
              <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                  <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64" />
                  <FaSearch />
              </form>
              <ul className="flex gap-4 items-center">
                  <Link to="/">
                      <li className="hidden sm:inline text-slate-700 hover:font-semibold cursor-pointer">Home</li>
                  </Link>
                  <Link to="/about">
                      <li className="hidden sm:inline text-slate-700 hover:font-semibold cursor-pointer">About</li>
                  </Link>
                  <li className="relative" ref={dropdownRef}>
                      <button 
                          onClick={toggleDropdown}
                          className="flex items-center space-x-1 text-slate-700 hover:font-semibold cursor-pointer"
                      >
                          {currentUser ? (
                              <>
                                  <span className="flex items-center gap-2">
                                      {currentUser.data.avatar ? (
                                          <img src={currentUser.data.avatar} alt="User avatar" className="rounded-full w-6 h-6 object-cover" />
                                      ) : (
                                          currentUser.data.username
                                      )}
                                  </span>
                                  <ChevronDown size={16} />
                              </>
                          ) : (
                              <>
                                  <User size={24} />
                                  <ChevronDown size={16} />
                              </>
                          )}
                      </button>
                      {isDropdownOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-10">
                              {currentUser ? (
                                  <>
                                      <Link 
                                          to="/profile" 
                                          className="block px-4 py-2 text-sm text-gray-200 hover:font-semibold"
                                          onClick={() => setIsDropdownOpen(false)}
                                      >
                                          <User size={16} className="inline mr-2" />
                                          Profile
                                      </Link>
                                      <Link 
                                          to="/sign-out" 
                                          className="block px-4 py-2 text-sm text-gray-200 hover:font-semibold"
                                          onClick={() => setIsDropdownOpen(false)}
                                      >
                                          <LogOut size={16} className="inline mr-2" />
                                          Sign Out
                                      </Link>
                                  </>
                              ) : (
                                  <Link 
                                      to="/sign-in" 
                                      className="block px-4 py-2 text-sm text-gray-200 hover:font-semibold"
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
  );
};


export default Header;