/**
 * Documentation:
 * - https://console.developers.google.com/project/m1n-m4x/apiui/apiview/distance_matrix_backend/overview
 * - https://developers.google.com/maps/documentation/distancematrix/
 * Notes:
 * - Free quota is 2,500 entries/day
 * - API key can be found under the Credentials tab https://console.developers.google.com/project/m1n-m4x/apiui/
 * - Extends Date prototype
 */

/**
 * Sets the day of the week to the given weekday, of one of the days of the week in the month it is in.
 * 
 * @param {Number} weekday the weekday to set to, 1 being Monday and 7 being Sunday
 */
Date.prototype.setDay = function(weekday) {
	if(this.getDate() > 10) {
	  this.setDate(this.getDate() + weekday - this.getDay());
	}
	else {
	  this.setDate(this.getDate() + weekday + (7 - this.getDay()));
	}
};

/**
 * Sets hours and minutes to the given values. Seconds and milliseconds are set to 0.
 * 
 * @param {Number} hours the hours value to set to
 * @param {Number} minutes the minutes value to set to
 */
Date.prototype.setTimes = function(hours, minutes) {
	this.setHours(hours);
	this.setMinutes(minutes);
	this.setSeconds(0);
	this.setMilliseconds(0);
};

/**
 * Retrieves the amount of seconds since Midnight January 1 1970.
 * 
 * @return {Number} the amount of seconds
 */
Date.prototype.getTimeSeconds = function() {
	var time = this.getTime();
	return Math.round(time/1000);
};

/**
 * @constructor
 */
var GoogleMapsAPI = function(){
	var self = this;
	self.defaults = {
		mode: "transit",
		key: "______KEY______"
	};
};

/**
 * @param {String[]} originsList Google Maps parseable locations i.e. ["Haarlem+Centraal", "Leiden+Centraal"]
 * @param {String[]} destinationsList i.e. Google Maps parseable locations ["52.09558,4.467138", "52.09491,4.473186", "52.09423,4.472231"]
 * @returns {Promise<>} of the parsed JSON response
 */
GoogleMapsAPI.prototype.distanceMatrix = function(originsList, destinationsList, options) {
	var url = "https://maps.googleapis.com/maps/api/distancematrix/json"
	var origins = originsList.join("|");
	var destinations = destinationsList.join("|");
	var params = {
		origins: origins,
		destinations: destinations
	};
	// TODO: Extend params with defaults and options
	// TODO: Make the http call and return the promise of the result
};

module.exports = GoogleMapsAPI;
