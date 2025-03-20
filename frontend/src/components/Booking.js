import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../context/SharedState';
import axios from 'axios';
import Loader from './Loader';

export default function Booking({ showAlert }) {
    const states = useContext(Context);
    const navigate = useNavigate();
    const { bikeId } = useParams();

    // Calculate payment details
    const totalHours = sessionStorage.getItem('totalHours');
    const rate = sessionStorage.getItem("rate");
    const taxRate = 0.13;
    const payment = Math.round((rate * totalHours) * (1 + taxRate));

    const [user, setUser] = useState({ data: {} });
    const [isLoading, setIsLoading] = useState(true);

    const getBookingData = async () => {
        try {
            const res = await axios.put(`${states.hostname}/api/handlebooking/?bikeId=${bikeId}`);
            const vehicle = res.data.details;
            const user = res.data.user;
            setUser({ data: user });
            states.setBooking({ data: vehicle });
            setIsLoading(false);
        } catch (err) {
            showAlert("Data not found! Don't interfere with the URL pattern", "danger");
            navigate("/search");
        }
    };

    useEffect(() => {
        getBookingData();
    }, []);

    const submitBooking = async () => {
        const data = {
            bikeId: bikeId,
            startDate: sessionStorage.getItem('startDate'),
            startTime: sessionStorage.getItem('startTime'),
            endDate: sessionStorage.getItem('endDate'),
            endTime: sessionStorage.getItem('endTime'),
            payment: payment
        };
        
        try {
            await axios.put(`${states.hostname}/api/handlebooking/checkout`, data);
            navigate('/');
            showAlert("Booking Confirmed!", "success");
        } catch (err) {
            if (err.response?.status === 409) {
                showAlert("Booking already done for this vehicle", "danger");
                sessionStorage.clear();
                navigate("/");
            }
            if (err.response?.status === 500) {
                showAlert("Data not found! Don't interfere with URL pattern", "danger");
                navigate("/search");
            }
        }
    };

    const handleCoupon = () => {
        showAlert("Invalid Coupon Code", "danger");
    };

    if (isLoading || !states.booking.data.map || !user.data.map) {
        return <Loader />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Safety Alert Banner */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg shadow-sm">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700 font-medium">
                            Crossing speed limit is strictly prohibited. Rs.1000/- will be fined each time the speed limit is crossed.
                            Every vehicle is attached with a realtime-GPS system for your safety!
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - User Information */}
                <div className="w-full lg:w-2/3">
                    {user.data.map(user => (
                        <div key={user._id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl mb-8 animate-fadeIn">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Booking Information: {user.username}
                                </h2>
                            </div>
                            
                            <div className="p-6 text-red">
                                <div className="mb-6">
                                    <p className="mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Once the payment is done, confirmation mail will be sent to: <span className="font-semibold">{user.email}</span>
                                    </p>
                                    <p className="mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        If you want to change your user information, go to profile settings
                                    </p>
                                </div>
                                
                                <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Required Documentation</h3>
                                    
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">For Local Residents:</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                                            <li>Driving License will be verified in original.</li>
                                            <li>Original ID proof (Passport, Voter ID, Driving License) needs to be deposited.</li>
                                            <li>Passport needs to be deposited for bikes above 500cc (Mandatory).</li>
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">For International Visitors:</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                                            <li>Valid Driving License from their home country with international riding permit, and a valid Visa. (Original to be brought).</li>
                                            <li>Passport needs to be deposited (Mandatory).</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column - Vehicle and Payment */}
                <div className="w-full lg:w-1/3">
                    {states.booking.data.map(data => (
                        <div key={data._id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl animate-fadeIn">
                            <div className="relative">
                                <img 
                                    src={data.img} 
                                    alt={`${data.bikeName} ${data.modelName}`} 
                                    className="w-full h-56 object-cover" 
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                    <h3 className="text-xl font-bold text-white">{data.bikeName} {data.modelName}</h3>
                                </div>
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                    Rs. {data.rate}/hr
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 italic">
                                    * Image shown above may or may not represent the latest condition of the vehicle
                                </p>
                                
                                <div className="grid grid-cols-3 gap-3 text-center mb-6">
                                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Rate</div>
                                        <div className="font-bold text-gray-800 dark:text-white">Rs. {data.rate}/hr</div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Limit</div>
                                        <div className="font-bold text-gray-800 dark:text-white">{data.limit}</div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Engine</div>
                                        <div className="font-bold text-gray-800 dark:text-white">{data.cc} cc</div>
                                    </div>
                                </div>
                                
                                <div className="flex mb-4">
                                    <input
                                        type="text"
                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Coupon Code"
                                    />
                                    <button
                                        onClick={handleCoupon}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors duration-300"
                                    >
                                        Apply
                                    </button>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                                        <span className="font-medium text-gray-800 dark:text-white">Rs. {data.rate * totalHours}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600 dark:text-gray-300">Tax (13%):</span>
                                        <span className="font-medium text-gray-800 dark:text-white">Rs. {Math.round((data.rate * totalHours) * taxRate)}</span>
                                    </div>
                                    <div className="h-px bg-gray-300 dark:bg-gray-600 my-2"></div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700 dark:text-gray-200 font-medium">Total:</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">Rs. {payment}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-black">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Pickup: <strong>{data.city}</strong></span>
                                    </div>
                                    <button
                                        onClick={submitBooking}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg shadow transition-all duration-200 flex items-center"
                                    >
                                        <span>Pay Now</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}