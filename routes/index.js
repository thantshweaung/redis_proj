
/*
 * GET home page.
 */
var db = require('../models/db');


exports.index = function(req, res){
	db.getAllDatas(function(dataList, _idx){
		res.render('index', {title: 'コンタクト一覧画面', datas: dataList, indexs: _idx});
	});
  	
};

exports.postIndex = function(req, res){
	var _datas = req.body;
	db.insertData(_datas);
	res.redirect('/');	
};

exports.edit = function(req, res){
	var _id = req.params.id;
	db.getData(_id, function(datas){
		res.render('edit', {title: 'コンタクト更新画面', data: datas, id: _id});
	});
};

exports.update = function(req, res){
	var _id = req.params.id;
	var _datas = req.body;
	db.updateData(_id, _datas);
	res.redirect('/');
};

exports.delete = function(req, res){
	var _id = req.params.id;
	db.deleteData(_id);
	res.redirect('/');
}