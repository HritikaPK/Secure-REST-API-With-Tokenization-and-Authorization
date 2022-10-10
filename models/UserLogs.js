const mongoose= require('mongoose')
const Schema = mongoose.Schema  //creating schema
const userLogSchema = new Schema({  
	  //declare datatypes
	idnum: {
        type:Schema.Types.ObjectId,
        ref:"Client"
     },

    Role: {
		type: String,
		required:[true,"Role Needed!"] 
	},

    Username: {
		type: String,
		required:[true,"Username Needed!"]
	},

    Password: {
		type: String,
		required:[true,"Valid Password Needed!"]
	},

	hashedPassword: {
		type: String,
		required:[true,"Valid Password Needed!"]
	}


})

const UserLogs = mongoose.model("UserLogs",userLogSchema)  // creating a model for 'UserLog'
module.exports=UserLogs


