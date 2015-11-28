var q = require('q');
var request = require('request');

/**
 * @constructor
 */
var API = function () {
};

/**
 * @param {Number} z a Google Maps 'z' position, from 16 and higher all results are returned
 * @param {Number} x a Google Maps 'x' position relative to their map and the 'z' parameter
 * @param {Number} y a Google Maps 'y' position relative to their map and the 'z' parameter
 * @param {Number} min the minimum price, i.e. 100000
 * @param {Number} max the maximum price, i.e. 500000
 * @returns {Promise<Object[]>} promise of the parsed JSON response
 */
API.prototype.listHouses = function (z, x, y, min, max) {
    var node = Math.min(Math.floor(Math.random() * 3) + 1, 3);
    var url = 'http://mt' + node + '.funda.nl/maptiledata.ashx';
    var params = {
        z: z,
        x: x,
        y: y,
        zo: 'koop/kaart/heel-nederland/' + min + '-' + max + '/'
    };
    var deferred = q.defer();
    request({
        url: url,
        qs: params
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(JSON.parse(body));
        }
        else {
            deferred.reject(error);
        }
    });
    return deferred.promise;
};

/**
 * @param {String[]} idsList a list of house ids
 * @param {String} referrer the referrer URL, i.e. 'http%3A//www.funda.nl/koop/kaart/%23/heel-nederland/100000-500000/'
 * @returns {Promise} promise of the parsed JSON response
 */
API.prototype.listHousesData = function (idsList, referrer) {
    var url = 'https://www.funda.nl/clientactie/getobjectinfo/';
    var ids = idsList.join(',');
    var params = {
        ids: ids,
        referrer: referrer
    };
    var deferred = q.defer();
    request({
        url: url,
        qs: params
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(JSON.parse(body));
        }
        else {
            deferred.reject(error);
        }
    });
    return deferred.promise;
};

module.exports = API;
