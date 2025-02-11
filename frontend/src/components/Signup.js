import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../context/SharedState";
import Loader from "./Loader";

export default function Signup({ showAlert }) {
  const { setLoading, loading, hostname } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${hostname}/api/handleuser/signup`, formData);
      showAlert(res.data, "dark");
      navigate("/login");
    } catch (err) {
      showAlert(`Error! ${err.response?.data || "Something went wrong"}`, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h3 className="text-2xl font-semibold text-gray-800 text-center">Sign Up</h3>
          <p className="text-gray-500 text-center text-sm">Create an account to continue</p>
          <hr className="my-4" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "username", type: "text", placeholder: "Username" },
              { name: "email", type: "email", placeholder: "Email address" },
              { name: "phone", type: "tel", placeholder: "Phone (+91)" },
              { name: "password", type: "password", placeholder: "Password" },
            ].map(({ name, type, placeholder }) => (
              <div key={name} className="relative">
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  placeholder={placeholder}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  aria-label={placeholder}
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300"
            >
              Create Account
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Already have an account?</p>
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
