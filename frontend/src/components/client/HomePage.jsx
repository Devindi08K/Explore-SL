import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaMapMarkedAlt, FaUserTie, FaHotel, FaArrowDown, FaRegCheckSquare, FaCompass } from 'react-icons/fa';
import { MdTour, MdBusinessCenter } from 'react-icons/md';
import { BiSolidBadgeCheck } from 'react-icons/bi';
import { RiQuillPenFill } from 'react-icons/ri';

const featuredDestinations = [
  {
    name: 'Kandy',
    image: 'https://i.pinimg.com/736x/dc/fc/9b/dcfc9bfc1fe8ad99432501bd20533bc7.jpg',
    description: 'Temple of the Sacred Tooth Relic'
  },
  {
    name: 'Sigiriya',
    image: 'https://i.pinimg.com/736x/62/a9/e3/62a9e31f1b33d9f8c82768c5767b9843.jpg',
    description: 'Ancient rock fortress'
  },
  {
    name: 'Galle',
    image: 'https://i.pinimg.com/736x/c5/0d/91/c50d919929458cdb8673eb7fc0513409.jpg',
    description: 'Historic coastal city'
  },
  {
    name: 'Ella',
    image: 'https://i.pinimg.com/736x/76/87/14/768714b6a2e2e46875fe132876b83ffc.jpg',
    description: 'Famous for Nine Arch Bridge'
  },
  {
    name: 'Nuwara Eliya',
    image: 'https://i.pinimg.com/736x/49/f5/4b/49f54b9954b574e9dca8f5788a656e14.jpg',
    description: 'Little England of Sri Lanka'
  },
  {
    name: 'Mirissa',
    image: 'https://i.pinimg.com/736x/05/4f/f4/054ff48fcfa601cd27a05ae96c945843.jpg',
    description: 'Beach paradise and whale watching'
  },
  {
    name: 'Polonnaruwa',
    image: 'https://i.pinimg.com/736x/28/ac/23/28ac23617a6e579853a27a43bfcdc8d1.jpg',
    description: 'Ancient city ruins'
  },
  {
    name: 'Anuradhapura',
    image: 'https://i.pinimg.com/736x/cb/a7/61/cba7612b3fb0a2a6ba6cc6b2d295443f.jpg',
    description: 'Sacred ancient city'
  }
];

const heroImages = [
  {
    url: "https://i.pinimg.com/736x/48/f9/4d/48f94db9b68ef6effbd0974358cb256d.jpg",
    alt: "Temple of the Sacred Tooth Relic, Kandy"
  },
  {
    url: "https://i.pinimg.com/736x/2a/b3/5b/2ab35bc7d3c4340b1bbd74608ef116aa.jpg",
    alt: "Sigiriya Rock Fortress"
  },
  {
    url: "https://i.pinimg.com/736x/24/dd/ad/24ddad6e778d64161b3c7bf7c48fa21d.jpg",
    alt: "Galle Dutch Fort"
  },
  {
    url: "https://i.pinimg.com/736x/6d/38/e2/6d38e2dd86e58bdf2b7dc8527c23999a.jpg",
    alt: "Nine Arch Bridge, Ella"
  },
  {
    url: "https://i.pinimg.com/736x/b5/2b/59/b52b59e9c9763defa3e628d43fe24030.jpg",
    alt: "Unawatuna Beach"
  }
];

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    // Image rotation logic
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section with Rotating Images */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {heroImages.map((image, index) => (
          <img
            key={image.url}
            src={image.url}
            alt={image.alt}
            loading="eager" // Prioritize loading
            className={`
              absolute inset-0 w-full h-full object-cover object-center transform scale-[1.02]
              transition-opacity duration-1000 will-change-transform
              ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              imageRendering: '-webkit-optimize-contrast',
              backfaceVisibility: 'hidden'
            }}
          />
        ))}
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6" data-aos="fade-down">
            Welcome to Sri Lanka
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" data-aos="fade-up">
            Discover the pearl of the Indian Ocean
          </p>
          <Link 
            to="/destinations"
            className="inline-block bg-tan text-cream px-8 py-4 rounded-lg hover:bg-gold transition duration-300 text-lg"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Start Exploring
          </Link>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <FaArrowDown className="w-6 h-6 text-white" />
        </div>

        {/* Image Navigation Dots */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 
                ${index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Destinations */}
      <section className="py-20 px-6 bg-white" id="destinations">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-charcoal text-center mb-12" data-aos="fade-up">
            Popular Destinations
          </h2>
          <div className="relative" data-aos="fade-up">
            <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4">
              {featuredDestinations.map((place, index) => (
                <div 
                  key={place.name}
                  className="flex-none w-80 group relative rounded-lg shadow-lg overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{place.name}</h3>
                    <p className="text-sm text-white/90">{place.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 right-4">
              <div className="flex justify-between">
                <button 
                  onClick={() => document.getElementById('destinations').scrollBy(-300, 0)}
                  className="bg-white/80 hover:bg-white text-charcoal p-2 rounded-full shadow-lg transition-all duration-200"
                >
                  ←
                </button>
                <button 
                  onClick={() => document.getElementById('destinations').scrollBy(300, 0)}
                  className="bg-white/80 hover:bg-white text-charcoal p-2 rounded-full shadow-lg transition-all duration-200"
                >
                  →
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link 
              to="/destinations"
              className="inline-block bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition duration-200"
              data-aos="fade-up"
            >
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-cream" id="services">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-charcoal text-center mb-12" data-aos="fade-up">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={FaUserTie}
              title="Tour Guides"
              description="Connect with professional local guides"
              link="/tour-guides"
              delay={0}
            />
            <ServiceCard 
              icon={MdTour}
              title="Curated Tours"
              description="Explore our handpicked tour packages"
              link="/tours"
              delay={100}
            />
            <ServiceCard 
              icon={FaHotel}
              title="Accommodations"
              description="Find the perfect place to stay"
              link="/affiliate-links"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* Tour Guide Registration Section */}
      <section className="py-20 px-6 bg-cream" id="become-guide">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-charcoal mb-6" data-aos="fade-up">
            Become a Tour Guide
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Share your knowledge and passion for Sri Lanka. Join our network of professional tour guides.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="200">
              <BiSolidBadgeCheck className="text-4xl text-tan mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Get Verified</h3>
              <p className="text-gray-600">Earn a verified badge and build trust</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="300">
              <FaMapMarkedAlt className="text-4xl text-tan mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Choose Your Areas</h3>
              <p className="text-gray-600">Specify your preferred tour locations</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="400">
              <MdBusinessCenter className="text-4xl text-tan mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Grow Your Business</h3>
              <p className="text-gray-600">Connect with tourists worldwide</p>
            </div>
          </div>
          <Link 
            to="/tour-guide-registration"
            className="inline-block bg-tan text-cream px-8 py-4 rounded-lg hover:bg-gold transition duration-300"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            Register as Tour Guide
          </Link>
        </div>
      </section>

      {/* Vehicle Registration Section */}
      <section className="py-20 px-6 bg-white" id="register-vehicle">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-charcoal mb-6" data-aos="fade-up">
            Register Your Vehicle
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Join our network of trusted transport providers. Reach more customers and grow your business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="200">
              <FaRegCheckSquare className="text-4xl text-tan mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Verified Provider</h3>
              <p className="text-gray-600">Get verified status and build trust with customers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="300">
              <FaMapMarkedAlt className="text-4xl text-tan mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Choose Your Area</h3>
              <p className="text-gray-600">Specify your service areas and travel preferences</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md" data-aos="fade-up" data-aos-delay="400">
              <MdBusinessCenter className="text-4xl text-tan mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Manage Bookings</h3>
              <p className="text-gray-600">Receive direct inquiries from tourists</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4" data-aos="fade-up" data-aos-delay="500">
            <Link 
              to="/vehicle-registration"
              className="inline-block bg-tan text-cream px-8 py-4 rounded-lg hover:bg-gold transition duration-300"
            >
              Register Your Vehicle
            </Link>
            <p className="text-sm text-gray-500">
              <span className="text-tan">🔒</span> Secure verification process | Professional support | Trusted by travelers
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-20 px-6 bg-white" id="partnership">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-charcoal text-center mb-12" data-aos="fade-up">
            Partner With Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PartnerCard 
              icon={MdTour}
              title="Tour Operators"
              description="Join our network of trusted tour operators"
              link="/partnership/tour-operator"
              delay={0}
            />
            <PartnerCard 
              icon={MdBusinessCenter}
              title="Business Listings"
              description="List your hotel, restaurant or local business"
              link="/partnership/business-listing"
              delay={100}
            />
            <PartnerCard 
              icon={RiQuillPenFill}
              title="Travel Bloggers"
              description="Share your Sri Lankan travel experiences"
              link="/partnership/blog-submission"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 px-6 bg-cream" id="map">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-charcoal text-center mb-12" data-aos="fade-up">
            Explore Sri Lanka
          </h2>
          <Link 
            to="/map" 
            className="inline-flex flex-col items-center group"
            data-aos="zoom-in"
          >
            <div className="w-24 h-24 flex items-center justify-center bg-tan rounded-full mb-4 group-hover:bg-gold transition-colors duration-300 shadow-lg">
              <FaCompass className="w-12 h-12 text-cream" />
            </div>
            <span className="text-xl font-semibold text-charcoal group-hover:text-gold transition-colors duration-300">
              Open Interactive Map
            </span>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">
              Discover destinations, plan routes, and explore the beauty of Sri Lanka
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ icon: Icon, title, description, link, delay }) => (
  <Link 
    to={link}
    className="bg-white rounded-lg p-6 text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <Icon className="text-5xl mb-4 mx-auto text-tan" />
    <h3 className="text-xl font-semibold text-tan mb-3">{title}</h3>
    <p className="text-charcoal">{description}</p>
  </Link>
);

const PartnerCard = ({ icon: Icon, title, description, link, delay }) => (
  <Link 
    to={link}
    className="group bg-cream rounded-lg p-6 text-center hover:shadow-xl transition duration-300"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <Icon className="text-4xl mb-4 mx-auto text-tan" />
    <h3 className="text-xl font-semibold text-tan mb-3 group-hover:text-gold transition-colors">
      {title}
    </h3>
    <p className="text-charcoal">{description}</p>
    <span className="inline-block mt-4 text-tan group-hover:text-gold transition-colors">
      Learn More →
    </span>
  </Link>
);

export default HomePage;
