// API endpoints

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbFuntions = require('./database/db-functions.js');
const models = require('./database/models.js');
const Paramedic = models.Paramedic;
const Patient = models.Patient;

JWT_secret = 'my_secret_token'

// Login (JWT)
router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        let user;
        if (role === "patient"){
            user = await Patient.findOne({ username });
        }
        else if (role === "paramedic") {
            user = await Paramedic.findOne({ username });
        }
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        // Generate a JWT
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: role }, 
            JWT_SECRET,                                                    
            { expiresIn: '1h' }                                            
        );
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});


// Fetch nearest paramedics given lat and lgn as query parameters
router.get('/paramedics', async (req, res) => {

    // Request object query parameters
    const longitude = Number(req.query.lng);
    const latitude = Number(req.query.lat);

    const nearestParamedics = await dbFuntions.getNearestParamedics([longitude, latitude], 2000); // Get paramedics within 2 km

    res.json({
        paramedics: nearestParamedics
    });
});

router.get('/patient.html', authenticateJWT, (req, res) => {
    try{
        const { username } = req.user; // req.user is populated by the Middleware function
        res.render('patient.html', {
            username: username
        })
    } catch (error) {
        res.status(500).json({ message: "Error loading patient page"})
    }
})

router.get('/paramedic.html', authenticateJWT, (req, res) => {
    try{
        const { username } = req.user; // req.user is populated by the Middleware function
        res.render('paramedic.html', {
            username: username
        })
    } catch (error) {
        res.status(500).json({ message: "Error loading paramedic page"})
    }
})

router.get('/', (req, res) => {
    res.render('index.html')
})

// Get paramedic details given username
router.get('/paramedics/info', async (req, res) => {
    const paramedicDetails = await dbFuntions.getParamedicInfo(req.query.username);

    res.json({
        paramedicDetails: paramedicDetails
    })
})

// Get all emergencies and convert them to GeoJSON
router.get('/emergencies/info', async (req, res) => {
    const emergencies = await dbFuntions.getEmergencies();
    const geojson_emergencies = [];

    for (let i = 0; i < emergencies.length; i++) {
        geojson_emergencies.push(
            {
                type: "Feature",
                geometry: {
                    type: "Point", coordinates: emergencies[i].location.coordinates
                },
                properties: { status: emergencies[i].status, requestTime: emergencies[i].requestTime, address: emergencies[i].address }

            })
    }

    const geojson = { type: "FeatureCollection", features: geojson_emergencies };
    res.json(geojson);
})


// Render heat map page
router.get('/emergencies.html', (req, res) => {
    res.render('requests.html');
})

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        req.user = user; // Attach user info to the request
        next();
    });
}



module.exports = router;