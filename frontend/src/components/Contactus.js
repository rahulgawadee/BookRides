import axios from 'axios';
import React, { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactUs(props) {
    const hostname = process.env.REACT_APP_PORTFOLIO_SERVER;

    const [userInput, setUserInput] = useState({});
    const handleInput = (e) => {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        });
    };

    const submitData = async (e) => {
        e.preventDefault();
        try {
            await props.showAlert("Sending your message...", "danger");
            await axios.post(`${hostname}/api/sendMail`, userInput);
            await props.showAlert("Message Sent! I will respond to you within 24 hours!", "success");
            e.target.reset();
            setUserInput({});
        } catch (error) {
            if (error.response?.status === 429) {
                props.showAlert("Too many requests! Try again later", "danger");
                return;
            }
            props.showAlert("Server Problem! Try again later", "danger");
            console.log(error);
        }
    };

    return (
        <div className='container mx-auto p-6 bg-white text-black rounded-lg shadow-lg max-w-4xl'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Contact Info */}
                <div className='space-y-4' data-aos="fade-right" data-aos-duration="2000">
                    <h2 className='text-2xl font-bold'>Getting in touch is easy!</h2>
                    <div className='flex items-center space-x-3'>
                        <MapPin className='text-green-400' />
                        <span>Pune,India</span>
                    </div>
                    <div className='flex items-center space-x-3'>
                        <Phone className='text-blue-400' />
                        <span>(+91) 9172694190</span>
                    </div>
                    <div className='flex items-center space-x-3'>
                        <Mail className='text-red-400' />
                        <span>contact@gmail.com</span>
                    </div>
                </div>
                
                {/* Contact Form */}
                <div data-aos="fade-left" data-aos-duration="2000">
                    <form onSubmit={submitData} className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium'>Your Name <span className='text-red-400'>*</span></label>
                            <input type='text' className='w-full p-2 bg-white-800 border border-blue-700 rounded-md focus:outline-none focus:border-green-400' name='name' placeholder='Full name' onChange={handleInput} required />
                        </div>
                        <div>
                            <label className='block text-sm font-medium'>Email Address <span className='text-red-400'>* must be valid</span></label>
                            <input type='email' className='w-full p-2 bg-white-800 border border-blue-700 rounded-md focus:outline-none focus:border-blue-400' name='email' placeholder='your@email.com' onChange={handleInput} required />
                        </div>
                        <div>
                            <label className='block text-sm font-medium'>Phone Number <span className='text-gray-400'>(optional)</span></label>
                            <input type='tel' className='w-full p-2 bg-white-800 border border-blue-700 rounded-md focus:outline-none focus:border-purple-400' name='phone' placeholder='+91-' onChange={handleInput} />
                        </div>
                        <div>
                            <label className='block text-sm font-medium'>Your Message <span className='text-red-400'>*</span></label>
                            <textarea className='w-full p-2 bg-white border border-gray-700 rounded-md focus:outline-none focus:border-yellow-400' rows='4' placeholder='Write your message here' name='message' onChange={handleInput} required></textarea>
                        </div>
                        <div className='text-right'>
                            <button className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition duration-200' type='submit'>Send Message</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}