var express = require('express'), 
    http = require("http"),
	// импорт представления MealController
	MealsController = require("./controllers/meals_controller.js"),
	UsersController = require("./controllers/users_controller.js"),
    // импортируем библиотеку mongoose
    mongoose = require("mongoose"),
	database = 'Cafe'; //название хранилища в Mongo
    app = express();


// начинаем слушать запросы
http.createServer(app).listen(3000);

app.use('/',express.static(__dirname + "/client"));
app.use('/user/:username',express.static(__dirname + "/client"));

// командуем Express принять поступающие объекты JSON
app.use(express.urlencoded({ extended: true }));

// подключаемся к хранилищу данных Amazeriffic в Mongo
mongoose.connect('mongodb://localhost/' + database, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true 
}).then(res => {
	console.log("DB Connected!")
}).catch(err => {
	console.log(Error, err.message);
});

app.get("/meals.json", MealsController.index);
app.get("/meals/:id", MealsController.show); 
app.post("/meals", MealsController.create);
app.put("/meals/:id", MealsController.update);
app.delete("/meals/:id", MealsController.destroy);

app.get("/users/:username/meals.json", MealsController.index);
app.post("/users/:username/meals", MealsController.create);
app.put("/users/:username/meals/:id", MealsController.update);
app.delete("/users/:username/meals/:id", MealsController.destroy);

app.get("/users.json", UsersController.index); 
app.post("/users", UsersController.create); 
app.get("/users/:username", UsersController.show);
app.put("/users/:username", UsersController.update);
app.delete("/users/:username", UsersController.destroy);