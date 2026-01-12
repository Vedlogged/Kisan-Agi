const mongoose = require('mongoose');

const DealerSchema = new mongoose.Schema({
  google_place_id: { type: String, unique: true, sparse: true },
  name: String,
  address: String,
  phone_number: String,
  rating: Number,
  open_now: Boolean,
  stock: [String],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [Longitude, Latitude]
  },
  last_updated: { type: Date, default: Date.now }
});

// CRITICAL: This index allows the map search to work
DealerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Dealer', DealerSchema);