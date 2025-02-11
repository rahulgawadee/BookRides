import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context/SharedState';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

export default function UserBookings({ showAlert }) {
    const navigate = useNavigate();
    const { hostname, setResults, result } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRentalDetails = async () => {
            try {
                const { data } = await axios.get(`${hostname}/api/getRentalDetails`);
                if (!data || data.length === 0) {
                    sessionStorage.clear();
                    navigate('/');
                    showAlert("Sorry! You haven't booked any vehicles yet", "danger");
                } else {
                    setResults({ data });
                }
            } catch (error) {
                navigate('/login');
                showAlert(error.response?.data || "An error occurred", "danger");
            } finally {
                setLoading(false);
            }
        };

        getRentalDetails();
    }, [hostname, navigate, setResults, showAlert]);

    if (loading) return <Loader />;
    if (!result?.data?.length) return <h3 className="text-light text-center">No bookings found.</h3>;

    return (
        <div className="container">
            <h3 className="text-light text-start">All Booking Details</h3>
            <p className="text-light text-start">All your completed and on-going bookings will be displayed here. You cannot delete or update any booking details.</p>
            <hr />
            <div className="row appearfromTop">
                {result.data.map((data) => (
                    <div className="col-md-4 col-sm-6 mt-3 mb-3" key={data._id}>
                        <div className="card h-100 bigContainer text-light">
                            <div style={{ position: "relative" }}>
                                <span className="position-absolute top-0 end-0 bg-dark px-2 py-1 text-white rounded">
                                    On Going
                                </span>
                                <img src={data.img} className="card-img-top" alt="Vehicle" height={230} />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{data.bikeName} {data.modelName}</h5>

                                <div className="table-responsive">
                                    <table className="bigContainer bg-dark table text-center text-light">
                                        <thead>
                                            <tr>
                                                <th>Rate</th>
                                                <th>Speed Limit</th>
                                                <th>Engine</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Rs. {data.rate} /hr</td>
                                                <td>{data.limit}</td>
                                                <td>{data.cc} cc</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="table-responsive">
                                    <table className="bigContainer bg-dark table text-center text-light">
                                        <thead>
                                            <tr>
                                                <th>Pickup Date</th>
                                                <th>Drop Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{data.startDate}</td>
                                                <td>{data.endDate}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="text-start">
                                    <strong>Booked on:</strong> {new Date(data.date).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
                                    })}
                                </div>
                                <div className="text-start">
                                    <strong>Paid Amount:</strong> Rs. {data.payment}
                                </div>
                            </div>
                            <div className="card-footer">
                                <small className="text-light">Pick-up Location: <strong>{data.city}</strong></small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
