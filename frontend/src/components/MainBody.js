import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from '../context/SharedState';
import Loader from "./Loader";
import { ChevronUp, Star, Clock, Shield, Zap, ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Sachin Gawade",
    vehicle: "Bike- Ninja ZX10R",
    review: "The Kawasaki ZX-10R is a thrilling and powerful sportbike that offers exceptional performance and handling on the track.",
    rating: 5
  },
  {
    name: "Rasika",
    vehicle: "Honda Activa",
    review: "The Honda Activa is a practical choice, offering smooth performance and great fuel efficiency for daily commutes.",
    rating: 4
  },
  {
    name: "Sachin",
    vehicle: "Pulsar NS200",
    review: "The Pulsar NS 200 is a powerful and stylish bike, ideal for those looking for a thrilling ride with great performance and handling.",
    rating: 5
  },
  {
    name: "Rahul ",
    vehicle: "Royal Enfield Classic 350",
    review: "The Royal Enfield Classic 350 is a timeless beauty, perfect for those who crave a blend of style and power.",
    rating: 4
  }
];

const vehicles = [
  {
    name: "Pulsar 125",
    image: "https://akm-img-a-in.tosshub.com/indiatoday/images/bodyeditor/201910/WhatsApp_Image_2019-10-31_at_1-1200x960.jpeg?UxD25yVOyhUwLt6xGrCqDRRP4QWs8ic1",
    description: "Coming soon on our stock...",
    tag: "Coming Soon"
  },
  {
    name: "Jupiter 125",
    image: "https://stat.overdrive.in/wp-content/odgallery/2014/04/16742_7T4G5631.JPG",
    description: "Available now, Book and ride!",
    tag: "Hot Deal(10% off)"
  },
  {
    name: "Ola S1 Pro",
    image: "https://media.zigcdn.com/media/content/2025/Feb/67a318ba9abb0.png?tr=w-930",
    description: "Never overspeed, always follow traffic rules. Stay Safe!",
    tag: "Safety First"
  }
];

const features = [
  { icon: Clock, title: "24/7 Support", description: "Round-the-clock customer service" },
  { icon: Shield, title: "Insured Rides", description: "Full coverage for peace of mind" },
  { icon: Zap, title: "Instant Booking", description: "Quick and easy reservation process" },
];

export default function MainBody(props) {
  const states = useContext(Context);
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split('T')[0];
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [hoverStates, setHoverStates] = useState({
    searchButton: false,
    bookNow: false,
    contactUs: false
  });

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    states.setLoading(true);

    try {
      const startDate = sessionStorage.getItem('startDate');
      const startTime = sessionStorage.getItem('startTime');
      const isValidTime = new Date(`${startDate}T${startTime}`) > new Date();

      if (!isValidTime) {
        throw new Error("Invalid date/time selected");
      }

      const response = await axios.post(states.hostname + "/api/search/", {
        city: states.city,
        vtype: states.vtype,
        startDate,
        startTime
      });

      if (response.data === "Empty") {
        props.showAlert("No vehicles available", "warning");
        return;
      }

      sessionStorage.setItem('city', states.city);
      sessionStorage.setItem('vtype', states.vtype);
      navigate('/search');
    } catch (err) {
      props.showAlert(err.message || "An error occurred", "danger");
      if (err.response?.status === 401) navigate('/login');
    } finally {
      states.setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {states.loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl group transition-transform duration-500 hover:scale-105">
            <img 
              src="https://capitalist.com.br/wp-content/uploads/2023/01/uber-moto.jpg" 
              alt="Hero" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl">
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
                Book your Ride Now
              </h2>
              <div className="bg-gradient-to-r from-red-100 to-red-50 text-red-800 px-6 py-3 rounded-xl mt-2 animate-pulse">
                <span className="font-semibold">Special Offer:</span> 10% off on your first ride. Use code FIRSTFLY
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <select
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                    onChange={e => states.setCity(e.target.value)}
                    required
                  >
                    <option value="">Select City</option>
                    {["Kendur", "Pabal", "Khed", "Avsari", "Jategaon", "Sanaswadi"].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="group">
                  <select
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                    onChange={e => states.setVtype(e.target.value)}
                    required
                  >
                    <option value="">Vehicle Type</option>
                    <option value="Scooter">Scooters (within city limit)</option>
                    <option value="L300">Less than 300cc Motorcycle</option>
                    <option value="M300">More than 300cc Motorcycle</option>
                    <option value="Any">Any Available</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: "Pickup Date", type: "date", min: currentDate, onChange: e => sessionStorage.setItem('startDate', e.target.value) },
                  { label: "Pickup Time", type: "time", onChange: e => sessionStorage.setItem('startTime', e.target.value) },
                  { label: "Drop Date", type: "date", min: sessionStorage.getItem('startDate') || currentDate, onChange: e => sessionStorage.setItem('endDate', e.target.value) },
                  { label: "Drop Time", type: "time", onChange: e => sessionStorage.setItem('endTime', e.target.value) }
                ].map((field, index) => (
                  <div key={index} className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      min={field.min}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                      onChange={field.onChange}
                      required
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                onMouseEnter={() => setHoverStates(prev => ({ ...prev, searchButton: true }))}
                onMouseLeave={() => setHoverStates(prev => ({ ...prev, searchButton: false }))}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:from-blue-700 hover:to-blue-800 relative overflow-hidden group"
              >
                <span className="flex items-center justify-center">
                  Search Available Vehicles
                  <ArrowRight className={`ml-2 transition-transform duration-300 transform ${hoverStates.searchButton ? "translate-x-2" : ""}`} />

                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <feature.icon className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Vehicles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-8">
            Featured Vehicles
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative overflow-hidden group">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name} 
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {vehicle.tag}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{vehicle.name}</h3>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-8">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-1">{testimonial.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{testimonial.vehicle}</p>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.review}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-12 mb-16 text-white transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
          <p className="text-lg mb-8 opacity-90">
            We offer a seamless and convenient way to book well-maintained bikes for your travel needs.
            Our commitment to providing top-quality bikes ensures a safe and enjoyable ride every time.
          </p>
          <div className="flex gap-6">
            <button 
              onMouseEnter={() => setHoverStates(prev => ({ ...prev, bookNow: true }))}
              onMouseLeave={() => setHoverStates(prev => ({ ...prev, bookNow: false }))}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:bg-blue-50 flex items-center"

            >
              Book Now
              <ArrowRight className={`ml-2 transition-transform duration-300 ${hoverStates.bookNow ? 'translate-x-1' : ''}`} />
            </button>
            <Link 
              to="/contact"
              onMouseEnter={() => setHoverStates(prev => ({ ...prev, contactUs: true }))}
              onMouseLeave={() => setHoverStates(prev => ({ ...prev, contactUs: false }))}
              className="bg-blue-500 bg-opacity-20 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-opacity-30 border-2 border-white flex items-center"
            >
              Contact Us
              <ArrowRight className={`ml-2 transition-transform duration-300 ${hoverStates.contactUs ? 'translate-x-1' : ''}`} />
            </Link>
          </div>
        </div>
      </div>



{/* Scroll to Top Button */}
<button
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  className={`fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-500 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 ${
    showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
  }`}
>
  <ChevronUp size={24} />
</button>

<footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
  <div className="container mx-auto px-4">
    <div className="text-center space-y-4">
      <h3 className="text-2xl font-bold mb-4">BookMyRide</h3>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto">
        Your trusted partner for convenient and reliable two-wheeler rentals.
        Experience the freedom of the open road with our quality vehicles.
      </p>
      <div className="pt-6 border-t border-gray-700 mt-6">
        <p className="text-gray-400">&copy; 2025 all rights reserved | Namrata and Komal</p>
      </div>
    </div>
  </div>
</footer>
</div>
)};