import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 6);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const imagesArray = [
    '/images/villa1.jpg',
    '/images/villa2.jpg',
    '/images/villa3.jpg',
    '/images/villa4.jpg',
    '/images/villa5.jpg',
    '/images/villa6.jpg'
  ];

  return (
    <div className="max-w-full mx-auto p-0 space-y-8">
      <div className="relative w-full h-64 md:h-80 lg:h-[500px] xl:h-[600px] overflow-hidden">
        {imagesArray.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Landing Image ${index + 1}`}
            className={`absolute inset-0 rounded-lg w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        ))}
      </div>
      <div className="text-center p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome{currentUser ? `, ${currentUser.data.username}` : ''}!
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          HomeFindr is your premier destination for finding the perfect home. Explore our listings and find your dream property today.
        </p>
        <button className="p-3 bg-blue-600 hover:bg-blue-700 font-semibold rounded-md text-white transition duration-300">
          Explore Listings
        </button>
      </div>
    </div>
  );
};

export default Home;
