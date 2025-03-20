import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/SharedState";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Loader from "./Loader";

export default function VehicleCards({ showAlert }) {
    const navigate = useNavigate();
    const states = useContext(Context);

    sessionStorage.removeItem("bikeId");

    // Fetch sessionStorage values once
    const [filters, setFilters] = useState({
        city: sessionStorage.getItem("city"),
        vtype: sessionStorage.getItem("vtype"),
        startDate: sessionStorage.getItem("startDate"),
        startTime: sessionStorage.getItem("startTime"),
        endDate: sessionStorage.getItem("endDate"),
        endTime: sessionStorage.getItem("endTime"),
        sortBy: sessionStorage.getItem("sortBy") || "",
    });

    const startDateTime = moment(`${filters.startDate}T${filters.startTime}`);
    const endDateTime = moment(`${filters.endDate}T${filters.endTime}`);

    const totalDays = endDateTime.diff(startDateTime, "days");
    const Hours = endDateTime.diff(startDateTime, "hours") % 24;
    const totalHours = endDateTime.diff(startDateTime, "hours");

    sessionStorage.setItem("totalHours", totalHours);

    // Fetch data from API
    const fetchData = async () => {
        try {
            const res = await axios.post(`${states.hostname}/api/search/`, {
                city: filters.city,
                vtype: filters.vtype,
                sortBy: filters.sortBy,
            });

            if (!res.data || res.data === "Empty") {
                sessionStorage.clear();
                navigate("/");
                showAlert("Sorry! Vehicle(s) are not available", "danger");
            } else {
                states.setResults({ data: res.data });
            }
        } catch (err) {
            console.error("Axios Error:", err);
            showAlert(err.response?.data || "Network error, please try again.", "danger");
            navigate("/login");
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters.city, filters.vtype, filters.sortBy]);

    const handleBooking = (bikeId, rate) => {
        sessionStorage.setItem("rate", rate);
        navigate(`/booking/${bikeId}`);
    };

    if (!states.result.data?.length) {
        return <Loader />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Booking Summary & Filters */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-xl mb-8 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white">Rental Summary</h2>
                        <div className="flex items-center space-x-2 text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">
                                Duration: <span className="font-bold">{totalDays} days {Hours} hours</span> <span className="text-sm text-gray-400">(Total: {totalHours} hours)</span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">
                                Location: <span className="font-bold capitalize">{filters.city}</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="sortBy" className="text-gray-300 font-medium">Sort by:</label>
                        <select
                            id="sortBy"
                            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                            value={filters.sortBy}
                            onChange={(e) => {
                                const value = e.target.value;
                                sessionStorage.setItem("sortBy", value);
                                setFilters((prev) => ({ ...prev, sortBy: value }));
                            }}
                        >
                            <option value="" disabled>Select option</option>
                            <option value="rate">Price: Low to High</option>
                            <option value="cc">Engine: Low to High</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Vehicle Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {states.result.data.map((data) => (
                    <VehicleCard
                        key={data._id}
                        data={data}
                        totalHours={totalHours}
                        onBooking={handleBooking}
                    />
                ))}
            </div>
        </div>
    );
}

// Enhanced Vehicle Card Component
const VehicleCard = ({ data, totalHours, onBooking }) => {
    const totalPrice = data.rate * totalHours;
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="relative">
                <img 
                    src={data.img} 
                    alt={data.bikeName} 
                    className="w-full h-56 object-cover object-center" 
                />
                <div className="absolute top-3 right-3 bg-red-500 text-black px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                    Rs. {data.rate}/hr
                </div>
            </div>
            
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    {data.bikeName} {data.modelName}
                </h3>
                
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Engine</div>
                        <div className="font-bold dark:text-white">{data.cc} cc</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Speed Limit</div>
                        <div className="font-bold dark:text-white">{data.limit}</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">City</div>
                        <div className="font-bold dark:text-white capitalize">{data.city}</div>
                    </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t pt-4 dark:border-gray-700">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Price</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-red">Rs. {totalPrice}</div>
                    </div>
                    <button
                        onClick={() => onBooking(data._id, data.rate)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg shadow transition-all duration-200 flex items-center"
                    >
                        <span>Book Now</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};