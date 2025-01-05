import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero bg-blue-500 text-white py-20 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to QuickResolve</h1>
          <p className="text-lg md:text-xl mb-6">
            Your one-stop solution for fast and efficient problem resolution.
          </p>
          <Link to='/incident-form' className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card p-6 bg-white shadow-md rounded-lg text-center">
              <i className="fa-solid fa-lightbulb text-blue-500 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Innovative Solutions</h3>
              <p className="text-gray-600">Our platform offers cutting-edge tools to streamline your tasks.</p>
            </div>
            <div className="feature-card p-6 bg-white shadow-md rounded-lg text-center">
              <i className="fa-solid fa-shield text-blue-500 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">Your data is safe with our state-of-the-art security protocols.</p>
            </div>
            <div className="feature-card p-6 bg-white shadow-md rounded-lg text-center">
              <i className="fa-solid fa-clock text-blue-500 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our team is here to assist you anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="testimonial-card p-6 bg-gray-100 shadow-md rounded-lg">
              <p className="text-gray-700 italic">
                "QuickResolve has made my work so much easier. Highly recommend it to everyone!"
              </p>
              <h4 className="text-blue-500 font-bold mt-4">- Alex Johnson</h4>
            </div>
            <div className="testimonial-card p-6 bg-gray-100 shadow-md rounded-lg">
              <p className="text-gray-700 italic">
                "Amazing platform with great features. The customer support is top-notch."
              </p>
              <h4 className="text-blue-500 font-bold mt-4">- Maria Lopez</h4>
            </div>
            <div className="testimonial-card p-6 bg-gray-100 shadow-md rounded-lg">
              <p className="text-gray-700 italic">
                "QuickResolve has changed the way we work. It's a game changer!"
              </p>
              <h4 className="text-blue-500 font-bold mt-4">- David Smith</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
