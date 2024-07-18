import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useSignInContext from '../context/useSignInContext';

const Header = ()=>{
    const { signInStatus } = useSignInContext();
    return(
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
                <FaSearch className="" />
            </form>
            <ul className="flex gap-4">
                <Link to="/">
                    <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">Home</li>
                </Link>
                <Link to="/about">
                    <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">About</li>
                </Link>
                {
                    signInStatus ? <Link to={'/sign-out'}>Sign Out</Link> : <Link to={'/sign-in'}>Sign In</Link>
                }
                           
            </ul>
            </div>
        </header>
    )
};

export default Header; 