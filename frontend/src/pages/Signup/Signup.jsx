import React, { useState } from "react";
import {useAuthStore} from "../../stores/authStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    photo: "",
    email: "",
    mobile: "",
    aadharCard: "",
    address: "",
    password: "",
  });

  const { register } = useAuthStore();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFormData({ ...formData, aadharCard: reader.result });
    };
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFormData({ ...formData, photo: reader.result });
    };
  };

  const validateFormData = () => {
    if (!formData.firstName.trim()) return toast.error("First name is required!");
    if (!formData.lastName.trim()) return toast.error("Last name is required!");
    if (!formData.email.trim()) return toast.error("Email is required!");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.mobile.trim()) return toast.error("Mobile number is required!");
    if (!formData.aadharCard) return toast.error("Aadhar card is required!");
    if (!formData.address.trim()) return toast.error("Address is required!");
    if (!formData.password) return toast.error("Password is required!");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters long!");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFormData()) {
      register(formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-100">
      <div className="lg:w-1/2 bg-white p-12 shadow-lg rounded-lg max-w-lg mx-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="input input-bordered w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="input input-bordered w-full"
          />
          <input
            type="file"
            name="aadharCard"
            placeholder="Upload Aadhar Card"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          <input
            type="file"
            name="photo"
            placeholder="Upload Profile Photo"
            onChange={handlePhoto}
            className="file-input file-input-bordered w-full"
          />
          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="textarea textarea-bordered w-full"
          ></textarea>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary w-full">
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p>
            Already registered? Check your account{" "}
            <Link to="/check-approval" className="text-blue-500 hover:underline">
              Approval
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 lg:w-1/2">
        <div className="max-w-md text-center">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-primary/10 ${i % 2 === 0 ? "animate-pulse" : ""}`}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">Welcome to Our Platform!</h2>
          <p className="text-base-container/60">Join our community and start reporting incidents easily.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;