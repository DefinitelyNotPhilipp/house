var async = require('async');
var fs = require('fs');
var path = require('path');
var constants = require('./constants.js');

/**
 * A Funda bulk-enhancing process.
 *
 * @param {API} fundaApi the Funda API
 * @param {String} basedir the directory to save files into
 * @param {Number} startX minimum X location
 * @param {Number} limitX maximum X location
 * @param {Number} startY minimum Y location
 * @param {Number} limitY maximum Y location
 * @param {Number} [index] resume index
 * @param {Number} [requestconcurrency] maximum concurrent requests
 * @param {Number} [batchsize] maximum batch size
 * @param {Number} [fileconcurrency] maximum concurrent file reads
 * @constructor
 */
var Task = function (fundaApi, basedir, startX, limitX, startY, limitY, index, requestconcurrency, batchsize, fileconcurrency) {
    var self = this;
    self.basedir = basedir;
    self._batchsize = batchsize || 10;
    self._batch = [];
    self._fundaApi = fundaApi;
    self._startX = startX;
    self._limitX = limitX;
    self._startY = startY;
    self._limitY = limitY;
    self._index = index || 0;
    self._requestQueue = async.queue(self._processBatch.bind(self), requestconcurrency || 5);
    self._fileQueue = async.queue(self._processFile.bind(self), fileconcurrency || 20);
};

/**
 * @returns the current X position
 * @private
 */
Task.prototype._currentX = function () {
    var self = this;
    return self._startX + self._index % ( self._limitX - self._startX + 1 );
};

/**
 * @returns the current Y position
 * @private
 */
Task.prototype._currentY = function () {
    var self = this;
    return self._startY + Math.floor(self._index / ( self._limitX - self._startX + 1 ));
};

/**
 * Processes batches of ids, queries for additional information by house ids and then stores the result.
 *
 * @param {String[]} batch async task data; list of house data
 * @param {Function} callback async callback
 * @private
 */
Task.prototype._processBatch = function (batch, callback) {
    var ids = [];
    for(var i in batch) {
        ids.push(batch[i].id);
    }
    self._fundaApi.listHousesData(ids, 'http://www.funda.nl/koop/kaart/#/heel-nederland/100000-500000/')
        .then(function(result){
            console.log('downloaded (%s), resume index = %d', ids.join(','), self._index);
            var file = constants.houseEnhanceFile(ids[0]);
			fs.writeFile(file, JSON.stringify(result, null, 2), function(ex) {
				if(ex) {
					return console.error(ex);
				}
			});
        });
    callback();
};

/**
 * Processes one file by name, extracts houses and adds those to the current batch.
 *
 * @param {Object} task async task data; path to the file
 * @param {Function} callback async callback
 * @private
 */
Task.prototype._processFile = function (task, callback) {
    fs.readFile(task.file, function (ex, json) {
        if (ex) {
            console.error(ex);
            callback();
        }
        else {
            var data = JSON.parse(json);
            for (var i in data.points) {
                var house = data.points[i];
                self._batch.push(house);
                if (self._batch.length == self._batchsize || task.lastBatch && self._batch.length == self._index % self._batchsize) {
                    var batch = self._batch;
                    self._batch = [];
                    self._requestQueue.push(batch);
                }
            }
            callback();
        }
    });
};

/**
 * Starts the process.
 */
Task.prototype.start = function () {
    var self = this;
    var file = null;
    var lastBatch = false;
    var maximumIndex = (self._limitY - self._startY + 1) * (self._limitX - self._startX + 1);
    for (var y = self._startY; y < self._limitY; y++) {
        for (var x = self._startX; x < self._limitX; x++) {
            self._index++;
            lastBatch = lastBatch || maximumIndex - self._index < self._batchsize;
            file = path.join(self.basedir, constants.houseDownloadFile(x, y));
            self._fileQueue.push({
                file: file,
                lastBatch: lastBatch
            });
        }
    }
};

module.exports = Task;
