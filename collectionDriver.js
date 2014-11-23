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
	console.log(obj);	
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
			// console.log(obj.)
			var arr = obj.id.split('||');
		        	var id = arr[0];
		        	var v2 = arr[2];
		        	console.log(arr);
			this.getCollection(collectionName, function(error, the_collection) {
		        if (error) {
					console.log("err");
		        	callback(error);
		        }
		        			
		        else {
		        	the_collection.update({_id: ObjectID(id)}, {"pos2d": v2}, function(){
		        		if(err)callback(err);
		        		else console.log(arguments);
		        	});
		            // obj._id = ObjectID(entityId); //A convert to a real obj id
		            // obj.updated_at = new Date(); //B
		            // the_collection.save(obj, function(error,doc) { //C
		            //     if (error) callback(error);
		            //     else callback(null, obj);
		            // });
		        }
		    });
		break;

		case "delete":
			console.log("action for delete");
		    this.getCollection(collectionName, function(error, the_collection) { //A
		      if( error ) callback(error)
		      else {
		      	// _id: ObjectID("52b2f757b8116e1df2eb46ac")
		      	the_collection.remove({_id: ObjectID(obj.id)}, function(err,o){console.log(arguments)});
		        // obj.created_at = new Date(); //B
		        // the_collection.insert(obj, function() { //C
		        //   callback(null, obj);
		        // });
		      }
		    });

		break;
		default:
			console.log("action name undefined");
	}

};

//update a specific object
CollectionDriver.prototype.update = function(collectionName, obj, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else {
            obj._id = ObjectID(entityId); //A convert to a real obj id
            obj.updated_at = new Date(); //B
            the_collection.save(obj, function(error,doc) { //C
                if (error) callback(error);
                else callback(null, obj);
            });
        }
    });
};

//delete a specific object
CollectionDriver.prototype.delete = function(collectionName, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if (error) callback(error);
        else {
            the_collection.remove({'_id':ObjectID(entityId)}, function(error,doc) { //B
                if (error) callback(error);
                else callback(null, doc);
            });
        }
    });
};



exports.CollectionDriver = CollectionDriver;