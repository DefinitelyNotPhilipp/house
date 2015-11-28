module.exports = {
    /**
     * Constructs the file name for a house download file.
     *
     * @param {Number} x the X position
     * @param {Number} y the Y position
     * @returns {String} file name
     */
    houseDownloadFile: function (x, y) {
        return 'house-download-x-' + x + '-y-' + y + '.json';
    },
    /**
     * Constructs the file name for a house enhance file.
     *
     * @param {Number} id
     * @returns {String} file name
     */
    houseEnhanceFile: function (id) {
        return 'house-enhanced-' + id + '.json';
    }
};
