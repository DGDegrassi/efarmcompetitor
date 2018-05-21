var express = require('express');
var router = express.Router();

// get equipmentlist
router.get('/equipmentlist', function(req,res) {
	var db = req.db;
	var collection = db.get('equipmentlist');
	collection.find({},{}, function(e,docs){
		res.json(docs);
	});
});

// Post to addequipment
router.post('/addequipment', function(req,res) {
	var db = req.db;
	var collection = db.get('equipmentlist');
	collection.insert(req.body, function(err, result) {
		res.send(
			(err === null) ? {msg: ''} : {msg: err}
			);
	});
});

// Delete to deleteequipment
router.delete('/deleteequipment/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('equipmentlist');
  var equipmentToDelete = req.params.id;
  collection.remove({ '_id' : equipmentToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});
module.exports = router;
