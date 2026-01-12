const express = require('express');
const axios = require('axios');
const Dealer = require('../models/Dealer');
const router = express.Router();

// GET /api/dealers?lat=19.1&long=72.8&product=Calcium
router.get('/', async (req, res) => {
  const { lat, long, product } = req.query;

  // 1. Validate Input
  if (!lat || !long) {
    return res.status(400).json({ error: "Latitude and Longitude required" });
  }

  const userLat = parseFloat(lat);
  const userLong = parseFloat(long);
  const searchRadius = 5000; // 5km search radius

  try {
    console.log(`📍 Searching dealers near: ${userLat}, ${userLong}`);

    // 2. CHECK LOCAL MONGODB FIRST
    // We use $near to find dealers sorted by distance
    let dealers = await Dealer.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [userLong, userLat] },
          $maxDistance: searchRadius
        }
      }
    });

    console.log(`✅ Found ${dealers.length} dealers in local DB.`);

    // 3. SMART SYNC LOGIC:
    // If local DB has fewer than 5 results, fetch fresh data from Google
    if (dealers.length < 5) {
      console.log("🌍 Local data low. Fetching from Google Maps...");

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const googleUrl = `https://places.googleapis.com/v1/places:searchNearby`;

      // Call Google Places API (New)
      const googleResponse = await axios.post(
        googleUrl,
        {
          // ✅ FIX: Use only official "Table A" types for Places API v1
          includedTypes: ["hardware_store", "home_improvement_store", "store"],

          maxResultCount: 10,
          locationRestriction: {
            circle: {
              center: { latitude: userLat, longitude: userLong },
              radius: searchRadius
            }
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.nationalPhoneNumber,places.id,places.types'
          }
        }
      );

      const googlePlaces = googleResponse.data.places || [];
      console.log(`📍 Google returned ${googlePlaces.length} locations.`);

      // 4. SAVE TO MONGODB (Upsert)
      // We loop through Google results and save them so we don't have to call Google next time
      for (const place of googlePlaces) {

        // Basic tagging logic for the "stock"
        let stockList = ["General Tools"];
        if (product) stockList.push(product); // Add the user's needed product
        if (place.types.includes("farm_supply_store")) stockList.push("Fertilizers", "Pesticides", "Seeds");

        const newDealer = {
          google_place_id: place.id,
          name: place.displayName?.text || "Unknown Shop",
          address: place.formattedAddress || "No Address",
          phone_number: place.nationalPhoneNumber || "No Phone",
          rating: place.rating || 0,
          stock: stockList,
          location: {
            type: "Point",
            coordinates: [place.location.longitude, place.location.latitude] // Mongo needs [Long, Lat]
          },
          last_updated: new Date()
        };

        // Update if exists, Insert if new
        await Dealer.findOneAndUpdate(
          { google_place_id: place.id },
          newDealer,
          { upsert: true, new: true }
        );
      }

      // 5. RE-FETCH FROM DB
      // Now that we saved them, fetch from DB again to return the standardized format
      dealers = await Dealer.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [userLong, userLat] },
            $maxDistance: searchRadius
          }
        }
      });
    }

    // 6. RETURN RESULTS
    res.json(dealers);

  } catch (error) {
    console.error("❌ Dealer API Error:", error.message);

    // Detailed error logging for debugging
    if (error.response) {
      console.error("Google Error Details:", JSON.stringify(error.response.data, null, 2));
      return res.status(500).json({
        error: "Google Maps API Failed",
        details: error.response.data
      });
    }

    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

module.exports = router;