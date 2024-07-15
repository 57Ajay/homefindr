import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
const Header = ()=>{
    return(
        <header className="bg-stone-300 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
            <Link to="/">
                <h1 className="text-sm font-bold sm:text-xl flex flex-wrap">
                    <span className="text-slate-700">Home</span>
                    <span className="text-slate-950">Findr</span>
                </h1>
            </Link>
            <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64" />
                <FaSearch className="" />
            </form>
            <ul className="flex gap-4">
                <Link to="/home">
                    <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">Home</li>
                </Link>
                <Link to="/about">
                    <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">About</li>
                </Link>
                <Link to="sign-in">
                    <li className="text-slate-700 hover:underline cursor-pointer">SignIn</li> 
                </Link>
                           
            </ul>
            </div>
        </header>
    )
};

export default Header; 