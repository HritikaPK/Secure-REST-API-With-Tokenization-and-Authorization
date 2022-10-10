const mongoose= require('mongoose')
const Schema = mongoose.Schema  //creating schema
const clientSchema = new Schema({    //declare datatypes

    firstname: {
		type: String,
		required:[true,"Name Needed!"] 
	},

    lastname: {
		type: String,
		required:[true,"Name Needed!"]
	},

    phnum: {
		type: String,
		required:[true,"Phone number Needed!"]
	}

})

const Client = mongoose.model("Client",clientSchema)  // creating a model for 'Client'
module.exports=Client


