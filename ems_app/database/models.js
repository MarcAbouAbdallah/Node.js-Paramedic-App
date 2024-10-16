const mongoose = require('mongoose');

const paramedicSchema = mongoose.Schema({
    userId: { type: String, unique: true, required: true, trim: true},
    displayName: { type: String, trim: true},
    phone: { type: String },
    email: { type: String, unique: true},
    earnedRatings: { type: Number },
    totalRatings: { type: Number },
    location: { // GeoJSON object with Point type
        type: {
            type: String,
            required: true,
            default: "Point"
        },
        address: { type: String },
        coordinates: [ Number ],
    }
});

paramedicSchema.index({"location": "2dsphere", userId: 1}); // Geospatial index to query based on spatial data (optimize queries on GeoJSON objects)
const Paramedic = mongoose.model('Paramedic', paramedicSchema); // Create a model based off schema


const emergencySchema = mongoose.Schema({
    requestTime: { type: Date },
    location: {
        address: { type: String },
        coordinates: [ Number ]
    },
    patientId: { type: String },
    paramedicId: { type: String },
    status: { type: String } //pending or accepted
})

const Emergency = mongoose.model('Emergency', emergencySchema);


exports.Paramedic = Paramedic;
exports.Emergency = Emergency;