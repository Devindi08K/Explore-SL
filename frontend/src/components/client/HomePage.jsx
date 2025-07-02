import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaMapMarkedAlt, FaUserTie, FaHotel, FaArrowDown, FaRegCheckSquare, FaCompass, FaCrown } from 'react-icons/fa';
import { MdTour, MdBusinessCenter } from 'react-icons/md';
import { BiSolidBadgeCheck } from 'react-icons/bi';
import { RiQuillPenFill } from 'react-icons/ri';
import api from '../../utils/api'; // Fixed import path

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
  const [featuredGuides, setFeaturedGuides] = useState([]);

  // Add ref for the scrollable container
  const scrollContainerRef = React.useRef(null);

  // Add scroll handlers
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  useEffect(() => {
    const fetchFeaturedGuides = async () => {
      try {
        const response = await api.get('/tour-guides/featured/homepage');
        setFeaturedGuides(response.data);
      } catch (error) {
        console.error('Error fetching featured guides:', error);
      }
    };
    
    fetchFeaturedGuides();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section with Rotating Images */}
      <div className="relative h-screen md:h-screen flex items-center justify-center overflow-hidden">
        {/* Add a subtle pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-10"></div>
        
        {heroImages.map((image, index) => (
          <img
            key={image.url}
            src={image.url}
            alt={image.alt}
            loading={index === 0 ? "eager" : "lazy"}
            className={`
              absolute inset-0 w-full h-full object-cover object-center transform scale-[1.02]
              transition-opacity duration-1000
              ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}
            `}
          />
        ))}
        <div className="relative z-20 text-center text-white px-4 sm:px-6 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 drop-shadow-lg">
            Welcome to Sri Lanka
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto drop-shadow-md font-light">
            Discover the pearl of the Indian Ocean
          </p>
          <Link 
            to="/destinations"
            className="inline-block bg-tan text-cream px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gold transition duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Exploring
          </Link>
        </div>

        {/* Enhanced scroll indicator */}
        <div 
          onClick={() => {
            document.getElementById('destinations').scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer hover:opacity-100 opacity-80 transition-all w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20"
        >
          <FaArrowDown 
            className="w-5 h-5 sm:w-6 sm:h-6 text-cream animate-bounce" 
            aria-label="Scroll to destinations"
          />
        </div>

        {/* Enhanced image navigation dots */}
        <div className="absolute bottom-24 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 
                ${index === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Destinations */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-cream/30" id="destinations">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 text-center" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-charcoal inline-block relative">
              Popular Destinations
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-tan rounded-full"></span>
            </h2>
          </div>
          
          {/* Destination slider with enhanced cards */}
          <div className="relative" data-aos="fade-up">
            <div 
              ref={scrollContainerRef}
              className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4 snap-x snap-mandatory"
            >
              {featuredDestinations.map((place, index) => (
                <div 
                  key={place.name}
                  className="flex-none w-72 sm:w-80 group relative rounded-lg shadow-lg overflow-hidden snap-start"
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
            
            {/* Enhanced navigation buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-6 -right-2 sm:-right-6">
              <div className="flex justify-between">
                <button 
                  onClick={() => handleScroll('left')}
                  className="bg-white text-tan p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none hover:bg-tan hover:text-white transform hover:scale-105"
                  aria-label="Scroll left"
                >
                  <span className="text-lg sm:text-xl">←</span>
                </button>
                <button 
                  onClick={() => handleScroll('right')}
                  className="bg-white text-tan p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none hover:bg-tan hover:text-white transform hover:scale-105"
                  aria-label="Scroll right"
                >
                  <span className="text-lg sm:text-xl">→</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Enhanced CTA */}
          <div className="text-center mt-12">
            <Link 
              to="/destinations"
              className="inline-flex items-center bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition-all duration-300 shadow-md hover:shadow-lg"
              data-aos="fade-up"
            >
              <span>View All Destinations</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section with gradient */}
      <section className="py-20 px-6 bg-gradient-to-b from-cream to-cream/70" id="services">
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

      {/* Tour Guide Registration Section with background pattern */}
      <section className="py-20 px-6 bg-cream relative" id="become-guide">
        <div className="absolute inset-0 opacity-5 pattern-dots"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
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

      {/* Vehicle Registration Section with subtle background */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50" id="register-vehicle">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
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
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-cream relative overflow-hidden" id="map">
        {/* Background decoration */}
        <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-tan/5 rounded-full"></div>
        <div className="absolute -left-24 -top-24 w-48 h-48 bg-tan/5 rounded-full"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal text-center mb-10 sm:mb-14" data-aos="fade-up">
            Explore Sri Lanka
          </h2>
          <Link 
            to="/map" 
            className="inline-flex flex-col items-center group"
            data-aos="zoom-in"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-tan rounded-full mb-5 group-hover:bg-gold transition-colors duration-300 shadow-lg relative">
              <FaCompass className="w-10 h-10 sm:w-12 sm:h-12 text-cream" />
              
              {/* Animated ring effect */}
              <div className="absolute inset-0 border-4 border-tan/30 rounded-full animate-ping opacity-75 group-hover:border-gold/30"></div>
            </div>
            <span className="text-xl font-semibold text-charcoal group-hover:text-gold transition-colors duration-300">
              Open Interactive Map
            </span>
            <p className="text-gray-600 mt-3 max-w-md mx-auto">
              Discover destinations, plan routes, and explore the beauty of Sri Lanka
            </p>
          </Link>
        </div>
      </section>

      {/* Featured Tour Guides Section */}
      {featuredGuides.length > 0 && (
        <section className="py-16 px-6 bg-cream">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-charcoal">Premium Tour Guides</h2>
              <Link to="/tour-guides" className="text-tan hover:text-gold transition">
                View all guides →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredGuides.map(guide => (
                <div key={guide._id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
                  <div className="p-4 flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-tan">
                      <img
                        src={guide.image || 'https://via.placeholder.com/300x300?text=Guide'}
                        alt={guide.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg">{guide.name}</h3>
                      <p className="text-sm text-gray-600">{guide.yearsOfExperience} years experience</p>
                    </div>
                    {guide.isPremium && (
                      <span className="absolute top-2 right-2 bg-gradient-to-r from-gold to-tan text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md">
                        <FaCrown className="mr-1" />
                        PREMIUM
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{guide.bio}</p>
                    <div className="flex justify-end">
                      <Link
                        to={`/tour-guides/${guide._id}`}
                        className="text-tan hover:text-gold text-sm font-medium"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const ServiceCard = ({ icon: Icon, title, description, link, delay }) => (
  <Link 
    to={link}
    className="bg-white rounded-lg p-8 text-center hover:shadow-xl transition duration-300 transform hover:-translate-y-2 group border border-transparent hover:border-tan/10"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tan/10 mb-6 mx-auto group-hover:bg-tan/20 transition-all">
      <Icon className="text-3xl text-tan" />
    </div>
    <h3 className="text-xl font-semibold text-tan mb-3 group-hover:text-gold transition-colors">{title}</h3>
    <p className="text-charcoal mb-4">{description}</p>
    <span className="inline-block text-sm font-medium text-tan group-hover:text-gold transition-colors">
      Learn more →
    </span>
  </Link>
);

const PartnerCard = ({ icon: Icon, title, description, link, delay }) => (
  <Link 
    to={link}
    className="group bg-cream rounded-lg p-8 text-center hover:shadow-xl transition duration-300 relative overflow-hidden"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    {/* Background accent */}
    <div className="absolute top-0 left-0 w-full h-1 bg-tan transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    
    <Icon className="text-4xl mb-5 mx-auto text-tan" />
    <h3 className="text-xl font-semibold text-tan mb-3 group-hover:text-gold transition-colors">
      {title}
    </h3>
    <p className="text-charcoal mb-4">{description}</p>
    <span className="inline-block mt-2 text-tan group-hover:text-gold transition-colors font-medium">
      Learn More <span className="group-hover:ml-1 transition-all duration-300">→</span>
    </span>
  </Link>
);

export default HomePage;
