const mongoose= require('mongoose')
const Schema = mongoose.Schema  //creating schema
const recordSchema = new Schema({    //declare datatypes

    loanstat: {
		type: String,
		required:[true,"Status Needed!"]
	},

    idnum:{
        type:Schema.Types.ObjectId,
        ref:"Client"
     }


})

const Record = mongoose.model("Record",recordSchema)  // creating a model for 'Client'
module.exports=Record


