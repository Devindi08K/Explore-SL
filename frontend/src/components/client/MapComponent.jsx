import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MapComponent = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchType, setSearchType] = useState('all');

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

  const getDistrictMapUrl = (district) => {
    const coordinates = districtsData[district]?.coordinates || '7.873054,80.771797'; // Sri Lanka center
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates},${coordinates}&layer=mapnik&marker=${coordinates}`;
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-charcoal mb-6 text-center">
          Explore Sri Lanka
        </h2>

        {/* Interactive District Selection */}
        <div className="mb-8 space-y-4">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-gold bg-white"
          >
            <option value="all">All Districts</option>
            {Object.keys(districtsData).map((key) => (
              <option key={key} value={key}>
                {districtsData[key].name}
              </option>
            ))}
          </select>
        </div>

        {/* Map and Information Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="w-full h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=79.5,5.8,82.0,9.9&layer=mapnik`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Sri Lanka Map"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>

          {/* District Information Panel */}
          <div className="lg:col-span-1 space-y-6">
            {selectedDistrict !== 'all' && districtsData[selectedDistrict] && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-charcoal mb-4">
                  {districtsData[selectedDistrict].name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {districtsData[selectedDistrict].description}
                </p>
                <h4 className="font-medium text-charcoal mb-2">Key Attractions:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {districtsData[selectedDistrict].attractions.map((attraction, index) => (
                    <li key={index}>{attraction}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Access Categories */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-charcoal mb-4">About Sri Lanka</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-cream rounded-lg">
                  <span className="block text-2xl font-bold text-tan">25</span>
                  <span className="text-sm text-charcoal">Districts</span>
                </div>
                <div className="text-center p-4 bg-cream rounded-lg">
                  <span className="block text-2xl font-bold text-tan">9</span>
                  <span className="text-sm text-charcoal">Provinces</span>
                </div>
                <div className="text-center p-4 bg-cream rounded-lg">
                  <span className="block text-2xl font-bold text-tan">65,610</span>
                  <span className="text-sm text-charcoal">km² Area</span>
                </div>
                <div className="text-center p-4 bg-cream rounded-lg">
                  <span className="block text-2xl font-bold text-tan">22M+</span>
                  <span className="text-sm text-charcoal">Population</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
