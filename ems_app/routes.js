// API endpoints

const express = require('express');
const router = express.Router();
const dbFuntions = require('./database/db-functions.js');


// Fetch nearest paramedics given lat and lgn as query parameters
router.get('/paramedics', async (req,res) => {

    // Request object query parameters
    const longitude = Number(req.query.lng);
    const latitude = Number(req.query.lat);

    const nearestParamedics = await dbFuntions.getNearestParamedics([longitude, latitude], 2000); // Get paramedics within 2 km

    res.json({
        paramedics: nearestParamedics
    });
});

router.get('/patient.html', (req,res) => {
    res.render('patient.html', {
        userId: req.query.userId
    })
})

router.get('/paramedic.html', (req,res) => {
    res.render('paramedic.html', {
        userId: req.query.userId
    })
})

router.get('/', (req,res) => {
    res.render('index.html')
})

// Get paramedic details given userId
router.get('/paramedics/info', async(req,res) => {
    const paramedicDetails = await dbFuntions.getParamedicInfo(req.query.userId);
    
    res.json({
        paramedicDetails: paramedicDetails
    })
})

// Get all MongoDb emergency objects and convert them to GeoJSON
router.get('/emergencies/info', async(req,res) => {
    const emergencies = await dbFuntions.getEmergencies();
    const geojson_emergencies = [];

    for (let i=0; i<emergencies.length; i++){
        geojson_emergencies.push(
            {
            type:"Feature",
            geometry: {type: "Point", coordinates: emergencies[i].location.coordinates 
            },
            properties:{status: emergencies[i].status, requestTime: emergencies[i].requestTime, address: emergencies[i].address}

        })
    }

    const geojson = {type: "FeatureCollection", features: geojson_emergencies};
    res.json(geojson);
})


// Render heat map page
router.get('/emergencies.html', (req, res) =>{
    res.render('requests.html');
})



module.exports = router;