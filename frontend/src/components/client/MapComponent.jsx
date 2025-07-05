import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MapComponent = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchType, setSearchType] = useState('all');
  const [mapUrl, setMapUrl] = useState('https://www.openstreetmap.org/export/embed.html?bbox=79.5,5.8,82.0,9.9&layer=mapnik');
  const [mapLoading, setMapLoading] = useState(true); // Add a new state for map loading

  // Complete Sri Lankan districts data
  const districtsData = {
    colombo: {
      name: 'Colombo',
      description: 'The commercial capital and largest city of Sri Lanka, featuring modern amenities, historical sites, and bustling markets.',
      attractions: ['Galle Face Green', 'National Museum', 'Gangaramaya Temple', 'Pettah Market'],
      coordinates: '6.927079,79.861243'
    },
    kandy: {
      name: 'Kandy',
      description: 'The cultural capital of Sri Lanka, home to the Temple of the Tooth Relic and surrounded by beautiful hills.',
      attractions: ['Temple of the Tooth', 'Kandy Lake', 'Royal Botanical Gardens', 'Cultural Shows'],
      coordinates: '7.290572,80.633728'
    },
    galle: {
      name: 'Galle',
      description: 'Historic coastal city known for its Dutch colonial architecture and iconic fortress.',
      attractions: ['Galle Fort', 'Maritime Museum', 'Japanese Peace Pagoda', 'Unawatuna Beach'],
      coordinates: '6.053519,80.220978'
    },
    matara: {
      name: 'Matara',
      description: 'A major commercial hub and tourist destination in the Southern Province.',
      attractions: ['Matara Fort', 'Paravi Duwa Temple', 'Polhena Beach', 'Dondra Head Lighthouse'],
      coordinates: '5.9549,80.5550'
    },
    hambantota: {
      name: 'Hambantota',
      description: 'Known for its natural harbors, wildlife sanctuaries, and salt pans.',
      attractions: ['Bundala National Park', 'Mirijjawila Botanical Garden', 'Hambantota Port'],
      coordinates: '6.1429,81.1212'
    },
    jaffna: {
      name: 'Jaffna',
      description: 'Cultural capital of Sri Lankan Tamils with unique architecture and traditions.',
      attractions: ['Nallur Kandaswamy Temple', 'Jaffna Fort', 'Nagadeepa Temple', 'Point Pedro'],
      coordinates: '9.6615,80.0255'
    },
    trincomalee: {
      name: 'Trincomalee',
      description: 'Famous for its natural deep-water harbor and beautiful beaches.',
      attractions: ['Koneswaram Temple', 'Fort Frederick', 'Pigeon Island', 'Nilaveli Beach'],
      coordinates: '8.5874,81.2152'
    },
    batticaloa: {
      name: 'Batticaloa',
      description: 'Known for its lagoons, beaches, and cultural heritage.',
      attractions: ['Batticaloa Fort', 'Batticaloa Lighthouse', 'Singing Fish'],
      coordinates: '7.7170,81.7000'
    },
    anuradhapura: {
      name: 'Anuradhapura',
      description: 'Ancient capital with well-preserved ruins of Sri Lankan civilization.',
      attractions: ['Sri Maha Bodhi', 'Ruwanwelisaya', 'Jetavanaramaya', 'Thuparamaya'],
      coordinates: '8.3114,80.4037'
    },
    polonnaruwa: {
      name: 'Polonnaruwa',
      description: 'Medieval capital and UNESCO World Heritage site.',
      attractions: ['Ancient City', 'Gal Vihara', 'Polonnaruwa Vatadage', 'Parakrama Samudra'],
      coordinates: '7.9403,81.0188'
    },
    matale: {
      name: 'Matale',
      description: 'Known for spice gardens and cultural sites.',
      attractions: ['Aluvihara Rock Temple', 'Spice Gardens', 'Nalanda Gedige'],
      coordinates: '7.4717,80.6244'
    },
    nuwara_eliya: {
      name: 'Nuwara Eliya',
      description: 'Hill country with tea plantations and cool climate.',
      attractions: ['Victoria Park', 'Gregory Lake', 'Tea Plantations', 'Horton Plains'],
      coordinates: '6.9497,80.7891'
    },
    badulla: {
      name: 'Badulla',
      description: 'Uva province capital surrounded by mountains.',
      attractions: ['Dunhinda Falls', 'Muthiyangana Temple', 'Bogoda Bridge'],
      coordinates: '6.9934,81.0550'
    },
    ratnapura: {
      name: 'Ratnapura',
      description: 'The gem capital of Sri Lanka.',
      attractions: ['Gem Museums', 'Sinharaja Forest', 'Adam\'s Peak'],
      coordinates: '6.7056,80.3847'
    },
    kegalle: {
      name: 'Kegalle',
      description: 'Known for rubber plantations and elephant orphanages.',
      attractions: ['Pinnawala Elephant Orphanage', 'Ethagala Rock'],
      coordinates: '7.2513,80.3464'
    },
    gampaha: {
      name: 'Gampaha',
      description: 'Second largest urban area with botanical gardens.',
      attractions: ['Henarathgoda Botanical Garden', 'Attanagalla Temple'],
      coordinates: '7.0873,80.0168'
    },
    ampara: {
      name: 'Ampara',
      description: 'Known for its paddy cultivation, beautiful beaches, and historical sites.',
      attractions: ['Arugam Bay', 'Lahugala National Park', 'Magul Maha Vihara'],
      coordinates: '7.2917,81.6724'
    },
    monaragala: {
      name: 'Monaragala',
      description: 'Famous for its agricultural products and natural beauty.',
      attractions: ['Yala National Park', 'Maligawila Buddha Statue', 'Buduruwagala'],
      coordinates: '6.8706,81.3487'
    },
    puttalam: {
      name: 'Puttalam',
      description: 'Known for its salt pans, fishing industry, and coconut plantations.',
      attractions: ['Wilpattu National Park', 'Dutch Fort', 'Kalpitiya Beach'],
      coordinates: '8.0362,79.8283'
    },
    kurunegala: {
      name: 'Kurunegala',
      description: 'Ancient royal capital surrounded by rocky outcrops.',
      attractions: ['Elephant Rock', 'Athagala Rock Temple', 'Kurunegala Lake'],
      coordinates: '7.4867,80.3647'
    },
    kalutara: {
      name: 'Kalutara',
      description: 'Coastal district famous for its beaches and historical temples.',
      attractions: ['Kalutara Bodhiya', 'Richmond Castle', 'Calido Beach'],
      coordinates: '6.5854,79.9607'
    },
    mannar: {
      name: 'Mannar',
      description: 'Island district with rich history and natural beauty.',
      attractions: ['Mannar Fort', 'Thiruketheeswaram Temple', 'Adam\'s Bridge'],
      coordinates: '8.9833,79.9000'
    },
    mullaitivu: {
      name: 'Mullaitivu',
      description: 'Coastal district with pristine beaches and lagoons.',
      attractions: ['Mullaitivu Beach', 'Nanthikadal Lagoon', 'Birds Sanctuary'],
      coordinates: '9.2667,80.8167'
    },
    vavuniya: {
      name: 'Vavuniya',
      description: 'Important transport hub and cultural center.',
      attractions: ['Madukanda Vihara', 'Vavuniya Tank', 'Archaeological Museum'],
      coordinates: '8.7514,80.4997'
    },
    kilinochchi: {
      name: 'Kilinochchi',
      description: 'Agricultural district with historical significance.',
      attractions: ['Iranamadu Tank', 'Elephant Pass', 'War Museum'],
      coordinates: '9.3803,80.4070'
    }
  };

  // Update the map when district changes
  useEffect(() => {
    if (selectedDistrict === 'all') {
      // Show full Sri Lanka map when "All Districts" is selected
      setMapUrl('https://www.openstreetmap.org/export/embed.html?bbox=79.5,5.8,82.0,9.9&layer=mapnik');
    } else {
      // Show specific district with marker and appropriate zoom level
      const coords = districtsData[selectedDistrict].coordinates.split(',');
      const lat = parseFloat(coords[0]);
      const lon = parseFloat(coords[1]);
      
      // Calculate bounding box with some padding for zoom level
      const padding = 0.1; // Adjust for desired zoom level
      const bbox = `${lon-padding},${lat-padding},${lon+padding},${lat+padding}`;
      
      setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`);
    }
  }, [selectedDistrict]);

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-charcoal mb-6 text-center">
          Explore Sri Lanka
        </h2>

        {/* Interactive District Selection */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-charcoal mb-4">Select a District</h3>
            
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-3 bg-cream border border-tan rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-tan text-charcoal transition-shadow"
              >
                <option value="all">All Districts of Sri Lanka</option>
                <optgroup label="Popular Districts">
                  <option value="colombo">Colombo</option>
                  <option value="kandy">Kandy</option>
                  <option value="galle">Galle</option>
                  <option value="nuwara_eliya">Nuwara Eliya</option>
                </optgroup>
                <optgroup label="All Districts">
                  {Object.keys(districtsData)
                    .filter(key => !['colombo', 'kandy', 'galle', 'nuwara_eliya'].includes(key))
                    .sort((a, b) => districtsData[a].name.localeCompare(districtsData[b].name))
                    .map((key) => (
                      <option key={key} value={key}>
                        {districtsData[key].name}
                      </option>
                    ))}
                </optgroup>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-tan">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-charcoal mb-3">About Selected District</h4>
              {selectedDistrict !== 'all' ? (
                <div className="p-4 bg-cream/50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {districtsData[selectedDistrict].description}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-cream/50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Select a specific district to see detailed information and attractions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map and Information Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="relative w-full h-[350px] sm:h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
                {mapLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-cream/50">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-tan border-t-transparent"></div>
                  </div>
                )}
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Sri Lanka Map"
                  className="w-full h-full"
                  onLoad={() => setMapLoading(false)}
                ></iframe>
              </div>
              
              {/* Map Legend */}
              <div className="mt-4 p-3 bg-cream rounded-lg flex flex-wrap gap-4 text-xs text-gray-600 items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>District Capital</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 border border-blue-500 bg-blue-200 rounded-full mr-2"></div>
                  <span>Water Bodies</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-300 rounded-sm mr-2"></div>
                  <span>National Parks</span>
                </div>
                <div className="ml-auto">
                  <span>Data source: OpenStreetMap</span>
                </div>
              </div>
            </div>
          </div>

          {/* District Information Panel */}
          <div className="lg:col-span-1 space-y-6">
            {selectedDistrict !== 'all' && districtsData[selectedDistrict] && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-charcoal">
                    {districtsData[selectedDistrict].name}
                  </h3>
                  <span className="px-3 py-1 bg-tan/10 text-tan text-xs rounded-full">
                    District
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {districtsData[selectedDistrict].description}
                </p>
                
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-charcoal mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-tan" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Key Attractions
                  </h4>
                  <ul className="space-y-2">
                    {districtsData[selectedDistrict].attractions.map((attraction, index) => (
                      <li key={index} className="flex items-start group">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-tan mt-1.5 mr-2 group-hover:bg-gold transition-colors"></span>
                        <Link to={`/destinations?search=${encodeURIComponent(attraction)}`} className="text-gray-600 hover:text-tan transition-colors">
                          {attraction}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link 
                  to={`/destinations?district=${districtsData[selectedDistrict].name}`}
                  className="mt-6 inline-flex items-center text-sm font-medium text-tan hover:text-gold transition-colors"
                >
                  View all destinations in {districtsData[selectedDistrict].name}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Sri Lanka Facts with Visual Enhancement */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-tan" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                </svg>
                About Sri Lanka
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-cream rounded-lg hover:shadow-md transition-shadow">
                  <span className="block text-2xl font-bold text-tan">25</span>
                  <span className="text-sm text-charcoal">Districts</span>
                </div>
                <div className="text-center p-4 bg-cream rounded-lg hover:shadow-md transition-shadow">
                  <span className="block text-2xl font-bold text-tan">9</span>
                  <span className="text-sm text-charcoal">Provinces</span>
                </div>
                <div className="text-center p-4 bg-cream rounded-lg hover:shadow-md transition-shadow">
                  <span className="block text-2xl font-bold text-tan">65,610</span>
                  <span className="text-sm text-charcoal">km² Area</span>
                </div>
                <div className="text-center p-4 bg-cream rounded-lg hover:shadow-md transition-shadow">
                  <span className="block text-2xl font-bold text-tan">22M+</span>
                  <span className="text-sm text-charcoal">Population</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-charcoal mb-4">Explore By Region</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedDistrict('colombo')}
                  className="w-full text-left px-4 py-2 bg-cream hover:bg-tan/10 rounded-md text-sm transition-colors flex justify-between items-center"
                >
                  <span>Western Province</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => setSelectedDistrict('kandy')}
                  className="w-full text-left px-4 py-2 bg-cream hover:bg-tan/10 rounded-md text-sm transition-colors flex justify-between items-center"
                >
                  <span>Central Province</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => setSelectedDistrict('jaffna')}
                  className="w-full text-left px-4 py-2 bg-cream hover:bg-tan/10 rounded-md text-sm transition-colors flex justify-between items-center"
                >
                  <span>Northern Province</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sri Lanka Provincial Map */}
            {selectedDistrict === 'all' && (
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h4 className="text-lg font-semibold text-charcoal mb-4">Provinces</h4>
                <div className="flex justify-center">
                 
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="p-1 bg-red-100">Northern</div>
                  <div className="p-1 bg-blue-100">North Central</div>
                  <div className="p-1 bg-green-100">Eastern</div>
                  <div className="p-1 bg-yellow-100">North Western</div>
                  <div className="p-1 bg-purple-100">Central</div>
                  <div className="p-1 bg-pink-100">Uva</div>
                  <div className="p-1 bg-orange-100">Western</div>
                  <div className="p-1 bg-indigo-100">Sabaragamuwa</div>
                  <div className="p-1 bg-teal-100">Southern</div>
                </div>
              </div>
            )}

            {/* Travel Information */}
            {selectedDistrict !== 'all' && selectedDistrict !== 'colombo' && (
              <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
                <h4 className="text-sm font-medium text-charcoal mb-2">Travel from Colombo</h4>
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-tan mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">
                    {/* This would be dynamically calculated in a real application */}
                    {selectedDistrict === 'kandy' ? '115 km' : 
                     selectedDistrict === 'galle' ? '119 km' : '150+ km'} from Colombo
                  </span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-tan mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">
                    {/* This would be dynamically calculated in a real application */}
                    {selectedDistrict === 'kandy' ? 'Approx. 3 hours' : 
                     selectedDistrict === 'galle' ? 'Approx. 2.5 hours' : '4+ hours'} by car
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
