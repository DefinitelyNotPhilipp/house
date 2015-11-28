var async = require('async');
var GoogleMapsAPI = require('./api-google-maps.js');
var gmaps = new GoogleMapsAPI();

var departureTime = new Date();
departureTime.setDay(1);
departureTime.setTimes(17, 5);

var arrivalTime = new Date();
arrivalTime.setDay(1);
arrivalTime.setTimes(8, 55);
