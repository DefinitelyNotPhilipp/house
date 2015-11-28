var path = require('path');
var async = require('async');
var fs = require('fs');
var constants = require('./constants.js');

/**
 * A Funda bulk-downloading process.
 * 
 * @param {API} fundaApi the Funda API
 * @param {String} basedir the directory to save files into
 * @param {Number} startX minimum X location
 * @param {Number} limitX maximum X location
 * @param {Number} startY minimum Y location
 * @param {Number} limitY maximum Y location
 * @param {Number} min minimum price
 * @param {Number} max maximum price
 * @param {Number} [index] resume index
 * @constructor
 */
var Task = function(fundaApi, basedir, startX, limitX, startY, limitY, min, max, index){
	var self = this;
	self.z = 16;
	self.basedir = basedir;
	self._fundaApi = fundaApi;
	self._startX = startX;
	self._limitX = limitX;
	self._startY = startY;
	self._limitY = limitY;
	self._min = min;
	self._max = max;
	self._index = index || 0;
};

/**
 * Performs the call to the API for the current position, and reschedules.
 * 
 * @param {Number} x the X position to retrieve
 * @param {Number} y the Y position to retrieve
 * @private
 */
Task.prototype._run = function (x, y) {
	var self = this;
	self._fundaApi.listHouses(self.z, x, y, self._min, self._max)
		.then(function(result) {
		    console.log('downloaded (%d, %d), resume index = %d', x,  y, self._index);
            var file = path.join(self.basedir, constants.houseDownloadFile(x, y));
			fs.writeFile(file, JSON.stringify(result, null, 2), function(ex) {
				if(ex) {
					return console.error(ex);
				}
			});
			self._schedule();
		}, function(ex) {
			self._schedule();
			console.error(ex);
		});
};

/**
 * @returns the current X position
 * @private
 */
Task.prototype._currentX = function() {
	var self = this;
	return self._startX + self._index % ( self._limitX - self._startX + 1 );
};

/**
 * @returns the current Y position
 * @private
 */
Task.prototype._currentY = function() {
	var self = this;
	return self._startY + Math.floor(self._index / ( self._limitX - self._startX + 1 ));
};

/**
 * Increments the index, and continues if there are positions left.
 *
 * @private
 */
Task.prototype._schedule = function() {
	var self = this;
	var x = self._currentX();
	var y = self._currentY();
	self._index++;
	if(x <= self._limitX && y <= self._limitY) {
		setImmediate(function(){
			self._run(x, y);
		});
	}
};

/**
 * Starts the process.
 * 
 * @param {Number} concurrency maximum concurrent requests
 */
Task.prototype.start = function(concurrency) {
	var self = this;
    // TODO: refactor so it works the same as house-enhance with async queues.
	for(var i = 0; i < concurrency; i++) {
		self._schedule();
	}
};

module.exports = Task;