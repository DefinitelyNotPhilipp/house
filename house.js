var path = require('path');
var program = require('commander');
var FundaAPI = require('./api/api-funda.js');
var HouseDownloadTask = require('./tasks/house-download.js');
var basedir = path.join(process.cwd(), 'download');

program
	.command('house-download [startX] [limitX] [startY] [limitY]')
	.description('download location information on houses available within the specified area ( i.e. 33600 33800 21500 21660 )')
	.option('--min [min]', 'Minimum price', 50000)
	.option('--max [max]', 'Maximum price', 200000)
	.option('--index [index]', 'Resume index', 0)
	.option('--threads [threads]', 'Maximum amount of simultaneous requests', 50)
	.action(function(startX, limitX, startY, limitY, options){
		startX = parseInt(startX);
		limitX = parseInt(limitX);
		startY = parseInt(startY);
		limitY = parseInt(limitY);
		var api = new FundaAPI();
		var task = new HouseDownloadTask(api, basedir, startX, limitX, startY, limitY, options.min, options.max, options.index);
		task.start(options.threads);
	});

program
	.command('house-enhance [startX] [limitX] [startY] [limitY]')
	.description('download additional information on downloaded houses within the specified area')
	.option('--index [index]', 'Resume index', 0)
	.action(function(startX, limitX, startY, limitY, options){
	});

program.parse(process.argv);
