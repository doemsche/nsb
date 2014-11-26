var ObjectID = require('mongodb').ObjectID;

CollectionDriver = function(db) {
  this.db = db;
};

CollectionDriver.prototype.getCollection = function(collectionName, callback) {
  this.db.collection(collectionName, function(error, the_collection) {
    if( error ) callback(error);
    else callback(null, the_collection);
  });
};

CollectionDriver.prototype.findAll = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
      if( error ) callback(error);
      else {
        the_collection.find().toArray(function(error, results) { //B
          if( error ) callback(error);
          else callback(null, results);
        });
      }
    });
};

CollectionDriver.prototype.get = function(collectionName, id, callback) { //A
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B
            if (!checkForHexRegExp.test(id)) callback({error: "invalid id"});
            else the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) { //C
                if (error) callback(error);
                else callback(null, doc);
            });
        }
    });
};

//save new object
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
	//Since Unity3d does not Support DELETE AND PUT all updates will be handled 
	//in a pseudy-CRUD implementation with the POST param

	switch(obj.action){
		case "create":
			console.log("action for create");
		    this.getCollection(collectionName, function(error, the_collection) { //A
		      if( error ) callback(error)
		      else {
		        obj.created_at = new Date(); //B
		        the_collection.insert(obj, function() { //C
		          callback(null, obj);
		        });
		      }
		    });
		break;

		case "update":
			console.log("action for update");
			console.log(obj);
			var arr = obj.updateData.split('||');
        	var engineId = arr[0];
        	var updateType = arr[1];
        	var val = arr[2];
        	switch(updateType){
        		case "position":
					this.getCollection(collectionName, function(error, the_collection) {
						if (error) {console.log("err");}
						else {
								the_collection.update(
									{Id: engineId},
									{$set: {"Pos2d": val, "lastAction":"update-pos"}},
									{upsert: false, multi:false}, 
									function(err, doc){
										console.log(err,doc);	
									}
								);
							}
						});
        		break;
        		case "size":
					this.getCollection(collectionName, function(error, the_collection) {
						if (error) {console.log("err");}
						else {
								the_collection.update(
									{Id: engineId},
									{$set: {"Size": val, "lastAction":"update-size"}},
									{upsert: false, multi:false}, 
									function(err, doc){
										console.log(err,doc);	
									}
								);
							}
						});
        		break;
        		case "rotation":
        			console.log("db update rotaion");
					this.getCollection(collectionName, function(error, the_collection) {
						if (error) {console.log("err");}
						else {
								the_collection.update(
									{Id: engineId},
									{$set: {"Rotation": val, "lastAction":"update-rotation"}},
									{upsert: false, multi:false}, 
									function(err, doc){
										console.log(err,doc);	
									}
								);
							}
						});
        		break;
        		case "mirror":
        		break;
        		default: 
        			console.log("header contains no valid update action. Valid actions for update are: postion, size, rotation, mirror");
        	}

		break;

		case "delete":
			console.log("action for delete");
		    this.getCollection(collectionName, function(error, the_collection) { //A
		      if( error ) callback(error)
		      else {
		      	// var x = the_collection.find({Id:"f80dc7a3-428a-4262-ba7c-77f83b5ac481"});
		      	console.log(obj.engineId);
		      	the_collection.remove(
		      		{engineId:engineId},
		      		{justOne: true},
		      		function(err,o){
		      			console.log(arguments)
		      		});
		      }
		    });

		break;
		default:
			console.log("action name undefined");
	}

};

//update a specific object
// CollectionDriver.prototype.update = function(collectionName, obj, entityId, callback) {
//     this.getCollection(collectionName, function(error, the_collection) {
//         if (error) callback(error);
//         else {
//             obj._id = ObjectID(entityId); //A convert to a real obj id
//             obj.updated_at = new Date(); //B
//             the_collection.save(obj, function(error,doc) { //C
//                 if (error) callback(error);
//                 else callback(null, obj);
//             });
//         }
//     });
// };

// //delete a specific object
// CollectionDriver.prototype.delete = function(collectionName, entityId, callback) {
//     this.getCollection(collectionName, function(error, the_collection) { //A
//         if (error) callback(error);
//         else {
//             the_collection.remove({'_id':ObjectID(entityId)}, function(error,doc) { //B
//                 if (error) callback(error);
//                 else callback(null, doc);
//             });
//         }
//     });
// };



exports.CollectionDriver = CollectionDriver;