import React from 'react';

const CreateListing = () => {
  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 md:p-10 bg-slate-200 rounded shadow-lg">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Create a Listing</h1>
      <form className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
            <input 
              type="text"
              placeholder="Name"
              maxLength={62}
              minLength={10}
              id="name"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1 font-medium">Description</label>
            <textarea 
              placeholder="Description"
              maxLength={200}
              minLength={20}
              id="description"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="address" className="block mb-1 font-medium">Address</label>
            <input 
              type="text"
              placeholder="Address"
              maxLength={37}
              minLength={3}
              id="address"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="sale"
                className="w-4 h-4 bg-white border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
              />
              <label htmlFor="sale" className="ml-2">Sell</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="rent"
                className="w-4 h-4 bg-white border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
              />
              <label htmlFor="rent" className="ml-2">Rent</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="parking"
                className="w-4 h-4 bg-white border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
              />
              <label htmlFor="parking" className="ml-2">Parking spot</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="furnished"
                className="w-4 h-4 bg-white border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
              />
              <label htmlFor="furnished" className="ml-2">Furnished</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="offer"
                className="w-4 h-4 bg-white border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
              />
              <label htmlFor="offer" className="ml-2">Offer</label>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bedrooms" className="block mb-1 font-medium">Beds</label>
              <input 
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className="block mb-1 font-medium">Baths</label>
              <input 
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="regularPrice" className="block mb-1 font-medium">
                Regular price
                <span className="text-sm ml-1">($ / month)</span>
              </label>
              <input 
                type="number"
                id="regularPrice"
                min={1}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="discountPrice" className="block mb-1 font-medium">Discounted Price</label>
              <input 
                type="number"
                id="discountPrice"
                min={0}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <div>
          <p className="font-medium mb-2">Images: <span className="text-sm font-normal">The first image will be the cover (max 6)</span></p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">Upload</button>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-950 text-white font-bold py-3 px-4 rounded w-full transition duration-300 ease-in-out">Create Listing</button>
      </form>
    </main>
  );
};

export default CreateListing;