var redis = require('redis');
var client = redis.createClient();
var async = require('async');

client.on('error', function(err){
	console.log('Error in connection!!!')
});

insertData = function(datas){
	var _max;
	client.smembers('db:contact:all', function(err, _uids){
		if(err)
			throw err;
		else{
			// 最大の番号を受け取る
			_max = Math.max.apply(Math, _uids);
			// 最大を上げる
			if(_max != "-Infinity")
				_max = _max + 1;
			else
				_max = 1;
			var _index = 'db:contact:' + _max;
			client.hset(_index, 'name', datas.name);
			client.hset(_index, 'email', datas.email);
			client.hset(_index, 'phone', datas.phone);
			client.sadd('db:contact:all', _max);
		}
	});

};

getAllDatas = function(fn){
	var _datas = [];
	var _idx = [];
	client.smembers('db:contact:all', function(err, _uids){
		if(err)
			throw err;
		else{
			_idx = _uids;
			_uids.forEach(function(_uid){
					client.hgetall('db:contact:' + _uid, function(err, reply){
					if(err)
						throw err;
					else{
						_datas.push(reply);
					}
				});	
			});
		}
	});
	// Client.smembers機能が遅いですのでsetTimeoutを使う
	setTimeout(function(){
		fn(_datas, _idx);
	}, 100);
};

getData = function(_id, fn){
	var _data = [];
	client.hgetall('db:contact:'+ _id, function(err, reply){
		if(err)
			throw err;
		else{
			_data = reply;
			fn(_data);
		}
	});
};

updateData = function(_id, datas){
	var _index = 'db:contact:' + _id;
	client.hset(_index, 'name', datas.name);
	client.hset(_index, 'email', datas.email);
	client.hset(_index, 'phone', datas.phone);
};

deleteData = function(_id){
	client.srem('db:contact:all', _id);
	client.del('db:contact:'+ _id);
};

exports.insertData = insertData;
exports.getAllDatas = getAllDatas;
exports.getData = getData;
exports.updateData = updateData;
exports.deleteData = deleteData;