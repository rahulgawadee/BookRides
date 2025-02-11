import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import setAuthToken from './setAuthToken';
import { Context } from '../context/SharedState';
import Loader from './Loader';

export default function LoginSignup(props) {
    const states = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        states.setLoading(true);
        e.preventDefault();

        axios.post(states.hostname + "/api/handleuser/login", { email, password })
            .then(res => {
                if (!res.data || !res.data.authtoken) {
                    throw new Error("Invalid response from server");
                }

                const token = res.data.authtoken;
                props.showAlert(`Welcome! ${res.data.username || "User"}, you are logged in`, "success");

                localStorage.setItem("jwtToken", token);
                setAuthToken(token);

                axios.post(states.hostname + '/api/handleuser/getuser', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(async res => {
                    if (!res.data) throw new Error("User data not found");
                    await states.setUser({ data: res.data });
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                    if (error.response?.status === 403) {
                        states.setUser(null);
                    }
                });

                states.setLoading(false);
                navigate('/');
            })
            .catch(error => {
                states.setLoading(false);
                console.error("Login error:", error);
                props.showAlert(error.response?.data?.message || "Login failed", "danger");
            });
    };

    return (
        <>
            {states.loading && <Loader />}
            <div className="flex items-center justify-center min-h-screen bg-[#EEF1F8]">
                <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl">
                    <h3 className="text-2xl font-semibold text-center text-gray-900">Login</h3>
                    <hr className="my-4 border-gray-300" />
                    
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="relative">
                            <input 
                                type="email" 
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="relative">
                            <input 
                                type="password" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                       

                        <button 
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:opacity-90 transition-all"
                        >
                            Continue Login
                        </button>
                    </form>

                    <hr className="my-4 border-gray-300" />
                    
                    <div className="text-center text-gray-600">
                        Don't have an account?  
                        <Link to="/signup" className="text-indigo-600 font-semibold hover:underline ml-1">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
