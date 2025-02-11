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

            if (res.data === "Empty") {
                sessionStorage.clear();
                navigate("/");
                showAlert("Sorry! Vehicle(s) are not available", "danger");
            } else {
                states.setResults({ data: res.data });
            }
        } catch (err) {
            navigate("/login");
            showAlert(err.response.data, "danger");
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
        <>
            <div className="container mx-auto p-4 flex flex-wrap items-center justify-between bg-gray-900 text-white rounded-lg shadow-lg">
                <strong className="text-lg">
                    Time Period: {totalDays} days {Hours} hours (Total: {totalHours} hrs)
                </strong>
                <select
                    className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                    value={filters.sortBy}
                    onChange={(e) => {
                        const value = e.target.value;
                        sessionStorage.setItem("sortBy", value);
                        setFilters((prev) => ({ ...prev, sortBy: value }));
                        fetchData();
                    }}
                >
                    <option value="" disabled>
                        Sort by:
                    </option>
                    <option value="rate">Price Rate</option>
                    <option value="cc">Lower cc</option>
                </select>
            </div>

            <div className="container mx-auto mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {states.result.data.map((data) => (
                    <VehicleCard
                        key={data._id}
                        data={data}
                        totalHours={totalHours}
                        onBooking={handleBooking}
                    />
                ))}
            </div>
        </>
    );
}

// Extracted Card Component
const VehicleCard = ({ data, totalHours, onBooking }) => {
    return (
        <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden ">
            <img src={data.img} alt={data.bikeName} className="w-full h-64 object-cover" />
            <div className="p-8">
                <h5 className="text-xl font-semibold">
                    {data.bikeName} {data.modelName}
                </h5>
                <div className="mt-2">
                    <table className="w-full text-center border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="p-2">Rate</th>
                                <th className="p-2">Speed Limit</th>
                                <th className="p-2">Engine</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2">Rs. {data.rate} /hr</td>
                                <td className="p-2">{data.limit}</td>
                                <td className="p-2">{data.cc} cc</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="mt-2">
                    Price: <strong>Rs. {data.rate * totalHours}/-</strong>
                </p>
            </div>
            <div className="flex justify-between p-4 bg-gray-900">
                <span>
                    Pickup: <strong>{data.city}</strong>
                </span>
                <button
                    onClick={() => onBooking(data._id, data.rate)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};
