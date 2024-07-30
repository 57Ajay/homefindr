import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import PropTypes from 'prop-types';

const Contact = ({ listing }) => {
    const [landlordDetails, setLandlordDetails] = useState(null);
    const [message, setMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const getLandlordDetails = async () => {
            const landlordId = listing.userRef;
            try {
                const res = await fetch(`/api/user/${landlordId}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                setLandlordDetails(data.data);
            } catch (error) {
                console.error("Error fetching landlord details:", error);
            }
        };
        getLandlordDetails();
    }, [listing.userRef]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!landlordDetails || !currentUser.data || !message) return;

        const subject = encodeURIComponent(`Inquiry about: ${listing.name}`);
        const body = encodeURIComponent(message);
        
        // Try to open default email client first
        const mailtoLink = `mailto:${landlordDetails.email}?subject=${subject}&body=${body}`;
        const mailtoWindow = window.open(mailtoLink, '_blank');

        // If mailtoWindow is null or undefined, fall back to Gmail
        if (!mailtoWindow || mailtoWindow.closed || typeof mailtoWindow.closed === 'undefined') {
            const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${landlordDetails.email}&su=${subject}&body=${body}`;
            window.open(gmailComposeUrl, '_blank');
        }

        setEmailSent(true);
        setMessage('');
    };

    if (!landlordDetails || !currentUser.data) {
        return <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-lg text-gray-700">Loading contact information...</p>
            </div>
        </div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white py-4 px-6">
                    <h2 className="text-2xl font-bold">Contact Landlord</h2>
                </div>
                <div className="p-6">
                    {emailSent ? (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                            <p className="font-bold">Success!</p>
                            <p>Email client or Gmail compose window opened. Don`t forget to send your message!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                >
                                    Send Email
                                </button>
                            </div>
                        </form>
                    )}
                    <p className="mt-4 text-sm text-gray-600">
                        This will open your default email client or Gmail compose window with a pre-filled message to the landlord.
                    </p>
                </div>
            </div>
        </div>
    );
};

Contact.propTypes = {
    listing: PropTypes.object.isRequired,
};

export default Contact;