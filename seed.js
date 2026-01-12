const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Dealer = require('./models/Dealer'); // Make sure this path is right

dotenv.config();

const dealers = [
  {
    name: "AgroTech Solutions (Andheri)",
    rating: 4.8,
    stock: ["Fungicide X", "Urea", "Neem Oil"],
    location: { type: "Point", coordinates: [72.8311, 19.1136] } // Andheri West
  },
  {
    name: "Kisan Seva Kendra (Juhu)",
    rating: 4.5,
    stock: ["Pesticide A", "Seeds"],
    location: { type: "Point", coordinates: [72.8258, 19.0968] } // Juhu
  },
  {
    name: "Green Leaf Supplies (Bandra)",
    rating: 4.9,
    stock: ["Organic Fertilizer", "Tools"],
    location: { type: "Point", coordinates: [72.8407, 19.0596] } // Bandra
  },
  {
    name: "FarmWise Co. (Goregaon)",
    rating: 4.2,
    stock: ["Fungicide X", "Sprayers"],
    location: { type: "Point", coordinates: [72.8521, 19.1663] } // Goregaon
  },
  {
    name: "Rural Agrotis (Powai)",
    rating: 4.6,
    stock: ["Heavy Machinery", "Urea"],
    location: { type: "Point", coordinates: [72.9051, 19.1187] } // Powai
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");
    
    await Dealer.deleteMany({}); // Clears old data so you don't get duplicates
    console.log("Old data cleared.");

    await Dealer.insertMany(dealers);
    console.log("✅ 5 Dealers Added Successfully!");
    
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

seedDB();
