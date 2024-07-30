import PropTypes from 'prop-types';

const ListingCard = ({ listing }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={listing.imageUrls[0]}
        alt={listing.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{listing.name}</h2>
        <p className="text-gray-600">{listing.description}</p>
        <div className="mt-4">
          <span className="text-lg font-bold">{listing.regularPrice} USD</span>
          {listing.discountPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              {listing.discountPrice} USD
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm">{listing.bedrooms} Bedrooms</span>
          <span className="text-sm">{listing.bathrooms} Bathrooms</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm">{listing.furnished ? "Furnished" : "Not Furnished"}</span>
          <span className="text-sm">{listing.parking ? "Parking Available" : "No Parking"}</span>
        </div>
        <div className="mt-2">
          <span className={`inline-block px-2 py-1 text-xs font-semibold ${listing.offer ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {listing.offer ? "Offer" : "No Offer"}
          </span>
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 ml-2">
            {listing.type === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
      </div>
    </div>
  );
};


ListingCard.propTypes = {
    listing: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
      regularPrice: PropTypes.number.isRequired,
      discountPrice: PropTypes.number,
      bedrooms: PropTypes.number.isRequired,
      bathrooms: PropTypes.number.isRequired,
      furnished: PropTypes.bool.isRequired,
      parking: PropTypes.bool.isRequired,
      offer: PropTypes.bool.isRequired,
      type: PropTypes.oneOf(['sale', 'rent']).isRequired,
    }).isRequired,
  };

export default ListingCard;
