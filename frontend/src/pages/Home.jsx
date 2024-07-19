import { useSelector } from 'react-redux';

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Home
        </h1>
        {currentUser && currentUser.data && (
          <p className="text-xl text-center text-gray-600">
            Hello,{' '}
            <span className="font-semibold text-blue-600">
              {currentUser.data.username}
            </span>
            !
          </p>
        )}
        <p className="mt-4 text-center text-gray-500">
          We`re glad to see you here.
        </p>
      </div>
    </div>
  );
};

export default Home;