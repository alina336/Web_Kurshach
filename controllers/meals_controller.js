// обратите внимание на то, что нужно перейти в папку, 
// в которой находится каталог models
var Meal = require("../models/meal.js"),
	User = require("../models/user.js"),
	MealsController = {};

MealsController.index = function (req, res) { 
	console.log("Вызван MealsController.index");
	var username = req.params.username || null,
		respondWithMeals;
	respondWithMeals = function (query) {
		Meal.find(query, function (err, meals) {
			if (err !== null) {
				res.json(500, err);
			} else {
				res.status(200).json(meals);
			}
		});
	};
	if (username !== null) {
		console.log("Поиск пользователя: "+username);
		User.find({"username": username}, function (err, result) {
			if (err !== null) {
				res.json(500, err);
			} else if (result.length === 0) {
				res.status(404).json({"result_length": 0});
			} else {
				respondWithMeals({"owner": result[0]._id});
			}
		});
	} else {
		respondWithMeals({});
	}
};

MealsController.create = function (req, res) {
	var username = req.params.username || null;
	var newMeal = new Meal({
		"description": req.body.description,
		"status" : req.body.status,
		"price" : req.body.price,
		"tags": req.body.tags
	});
	
	console.log("username: " + username);

	User.find({"username": username}, function (err, result) {
		if (err) {
			res.send(500);
		} else {
			if (result.length === 0) {
				newMeal.owner = null;
			} else {
				newMeal.owner = result[0]._id;
			}
			newMeal.save(function (err, result) {
				console.log(result);
				if (err !== null) {
					// элемент не был сохранен!
					console.log(err);
					res.json(500, err);
				} else {
					res.status(200).json(result);
				}
			});
		}
	});

};

MealsController.show = function (req, res) {
	// это ID, который мы отправляем через URL
	var id = req.params.id;
	// находим элемент списка задач с соответствующим ID 
	Meal.find({"_id":id}, function (err, Meal) {
		if (err !== null) {
			// возвращаем внутреннюю серверную ошибку 
			console.log("ОШИБКА ТУТ");
			res.status(500).json(err);
		} else {
			if (Meal.length > 0) {
				// возвращаем успех!
				res.status(200).json(Meal[0]);
			} else {
				// мы не нашли элемент списка задач с этим ID! 
				res.send(404);
			}
		}
	});
};

MealsController.destroy = function (req, res) {
	var id = req.params.id;
	Meal.deleteOne({"_id": id}, function (err, Meal) {
		if (err !== null) {
			res.status(500).json(err);
		} else {
			if (Meal.n === 1 && Meal.ok === 1 && Meal.deletedCount === 1) {
				res.status(200).json(Meal);
			} else {
				res.status(404).json({"status": 404});
			}
		}
	});
}

MealsController.update = function (req, res) {
	var id = req.params.id;
	var newDescription = {$set: {description: req.body.description, status: req.body.status}};
	Meal.updateOne({"_id": id}, newDescription, function (err,Meal) {
		if (err !== null) {
			res.status(500).json(err);
		} else {
			if (Meal.n === 1 && Meal.nModified === 1 && Meal.ok === 1) {
				res.status(200).json(Meal);
			} else {
				res.status(404).json({"status": 404});
			}
		}
	});
}

module.exports = MealsController;