var mongoose = require("mongoose"),
	ObjectId = mongoose.Schema.Types.ObjectId;
// Это модель mongoose для списка блюд меню
var MealSchema = mongoose.Schema({
	description: String,
	status : String,
	price : Number,
	tags: [ String ],
	owner : { type: ObjectId, ref: "User" }
});

var Meal = mongoose.model("Meal", MealSchema); 
module.exports = Meal;