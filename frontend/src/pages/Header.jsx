

const Header = ()=>{
    return(
        <header className="bg-stone-300 h-[7vh] p-2 shadow-md">
            <div className="flex justify-between items-center max-w-6xl">
            <h1 className="text-sm font-bold sm:text-xl flex flex-wrap">
                <span className="text-slate-700">Home</span>
                <span className="text-slate-950">Findr</span>
            </h1>
            <form className="">
                <input type="text" placeholder="Search..." className="rounded p-1 border border-slate-950 mt-1" />
            </form>
            </div>
        </header>
    )
};

export default Header; 