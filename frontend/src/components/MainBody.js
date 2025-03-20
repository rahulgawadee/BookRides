import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from '../context/SharedState';
import Loader from "./Loader";
import { 
  ChevronUp, Star, Clock, Shield, Zap, ArrowRight, 
  Calendar, Clock3, MapPin, Bike, Award, MessageSquare, Heart
} from "lucide-react";

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

  useEffect(() => {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {states.loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-800 py-24">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Ride Your <span className="text-yellow-400">Dream Bike</span> Today
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-xl">
                Premium motorcycle and scooter rentals with hassle-free booking. Experience the freedom of the open road with our well-maintained fleet.
              </p>
              <div className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded-lg inline-block mb-8">
                10% OFF your first ride with code: <span className="font-bold">FIRSTFLY</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-blue-50">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">Book Your Ride</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <div className="absolute left-4 top-4 text-blue-500">
                        <MapPin size={20} />
                      </div>
                      <select
                        className="w-full p-4 pl-12 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        onChange={e => states.setCity(e.target.value)}
                        required
                      >
                        <option value="">Select City</option>
                        {["Kendur", "Pabal", "Khed", "Avsari", "Jategaon", "Sanaswadi"].map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-4 text-blue-500">
                        <Bike size={20} />
                      </div>
                      <select
                        className="w-full p-4 pl-12 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                      <div className="absolute left-4 top-10 text-blue-500">
                        <Calendar size={18} />
                      </div>
                      <input
                        type="date"
                        min={currentDate}
                        className="w-full p-3 pl-12 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        onChange={e => sessionStorage.setItem('startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time</label>
                      <div className="absolute left-4 top-10 text-blue-500">
                        <Clock3 size={18} />
                      </div>
                      <input
                        type="time"
                        className="w-full p-3 pl-12 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        onChange={e => sessionStorage.setItem('startTime', e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Drop Date</label>
                      <div className="absolute left-4 top-10 text-blue-500">
                        <Calendar size={18} />
                      </div>
                      <input
                        type="date"
                        min={sessionStorage.getItem('startDate') || currentDate}
                        className="w-full p-3 pl-12 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        onChange={e => sessionStorage.setItem('endDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Drop Time</label>
                      <div className="absolute left-4 top-10 text-blue-500">
                        <Clock3 size={18} />
                      </div>
                      <input
                        type="time"
                        className="w-full p-3 pl-12 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        onChange={e => sessionStorage.setItem('endTime', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, searchButton: true }))}
                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, searchButton: false }))}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:from-blue-700 hover:to-blue-900 relative overflow-hidden group flex items-center justify-center"
                  >
                    <span className="flex items-center justify-center">
                      Search Available Vehicles
                      <ArrowRight className={`ml-2 transition-transform duration-300 transform ${hoverStates.searchButton ? "translate-x-2" : ""}`} />
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Benefits</span>
            <h2 className="text-3xl font-bold mt-2">Why Choose BookMyRide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                <div className="bg-blue-100 text-blue-600 rounded-2xl p-4 inline-flex mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Vehicles */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-10">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Explore Our Fleet</span>
              <h2 className="text-3xl font-bold mt-2">Featured Vehicles</h2>
            </div>
            <Link to="/vehicles" className="text-blue-600 font-medium flex items-center mt-4 md:mt-0 group">
              View All Vehicles
              <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name} 
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {vehicle.tag}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{vehicle.name}</h3>
                  <p className="text-gray-600 mb-4">{vehicle.description}</p>
                  <div className="flex justify-end">
                    <button className="text-blue-600 font-medium flex items-center group-hover:underline">
                      View Details
                      <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-12 md:p-16">
                <span className="text-blue-200 font-semibold text-sm uppercase tracking-wider">Experience Excellence</span>
                <h2 className="text-3xl font-bold text-white mt-3 mb-4">Why Choose BookMyRide?</h2>
                <p className="text-blue-100 mb-8 text-lg">
                  We offer a seamless and convenient way to book well-maintained bikes for your travel needs.
                  Our commitment to providing top-quality vehicles ensures a safe and enjoyable ride every time.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Shield, text: "Insured Vehicles" },
                    { icon: Award, text: "Quality Maintained" },
                    { icon: Zap, text: "Quick Booking" },
                    { icon: Clock, text: "24/7 Support" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="bg-blue-700 p-2 rounded-lg">
                        <item.icon className="w-5 h-5 text-blue-200" />
                      </div>
                      <span className="text-white">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, bookNow: true }))}
                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, bookNow: false }))}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                  >
                    Book Now
                    <ArrowRight className={`ml-2 transition-transform duration-300 ${hoverStates.bookNow ? 'translate-x-1' : ''}`} />
                  </button>
                  <Link 
                    to="/contact"
                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, contactUs: true }))}
                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, contactUs: false }))}
                    className="bg-blue-700 bg-opacity-40 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-opacity-60 border border-blue-400 flex items-center justify-center"
                  >
                    Contact Us
                    <ArrowRight className={`ml-2 transition-transform duration-300 ${hoverStates.contactUs ? 'translate-x-1' : ''}`} />
                  </Link>
                </div>
              </div>
              <div className="hidden md:block relative h-full">
                <div className="h-full overflow-hidden">
                  <img 
                    src="https://capitalist.com.br/wp-content/uploads/2023/01/uber-moto.jpg" 
                    alt="Motorcycle rider" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Customer Reviews</span>
            <h2 className="text-3xl font-bold mt-2">What Our Riders Say</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 relative"
              >
                <div className="absolute top-6 right-6 text-blue-100">
                  <Heart className="w-10 h-10 fill-current opacity-20" />
                </div>
                <div className="mb-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6">{testimonial.review}</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-blue-600 text-sm">{testimonial.vehicle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/testimonials" className="text-blue-600 font-medium inline-flex items-center group">
              Read More Reviews
              <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-100 rounded-3xl p-12 mb-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Join thousands of satisfied customers who trust BookMyRide for their two-wheeler rental needs.
              Book your ride now and experience the difference.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:from-blue-700 hover:to-blue-900 inline-flex items-center"
            >
              Start Booking
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </section>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-500 hover:bg-blue-700 hover:shadow-xl z-40 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ChevronUp size={24} />
      </button>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">BookMyRide</h3>
              <p className="text-gray-300 mb-6">
                Your trusted partner for convenient and reliable two-wheeler rentals.
                Experience the freedom of the open road with our quality vehicles.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <a key={social} href={`#${social}`} className="bg-gray-700 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'About Us', 'Vehicles', 'Pricing', 'FAQs', 'Contact'].map((link) => (
                  <li key={link}>
                    <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-white transition-colors duration-200">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
              <div className="space-y-4 text-gray-300">
                <p>123 Main Street</p>
                <p>Pune, Maharashtra 411001</p>
                <p>Phone: +91 98765 43210</p>
                <p>Email: info@bookmyride.com</p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} BookMyRide - All rights reserved | Namrata and Komal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}