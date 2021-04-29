var express = require('express'), 
    http = require("http"),
	// импорт представления ToDoController
	ToDosController = require("./controllers/todos_controller.js"),
    // импортируем библиотеку mongoose
    mongoose = require("mongoose"),
    app = express();

app.use(express.static(__dirname + "/client")); 
app.use(express.urlencoded());

// подключаемся к хранилищу данных Amazeriffic в Mongo
mongoose.connect('mongodb://localhost/amazeriffic');
// Это модель Mongoose для задач
var ToDoSchema = mongoose.Schema({
	description: String,
	tags: [ String ]
});

// var ToDo = mongoose.model("ToDo", ToDoSchema);

// начинаем слушать запросы
http.createServer(app).listen(3000);

app.use(express.static(__dirname + "/client"));
app.get("/todos.json", ToDosController.index);
// базовые маршруты CRUD 
app.get("/todos/:id", ToDosController.show); 
app.post("/todos", ToDosController.create);

// этот маршрут замещает наш файл todos.json в примере из части 5 
app.get("/todos.json", function (req, res) { 
	ToDo.find({}, function (err, toDos) {
		// не забудьте о проверке на ошибки
		res.json(toDos);
	});
});

// командуем Express принять поступающие объекты JSON
app.use(express.urlencoded({ extended: true }));

// подключаемся к хранилищу данных Amazeriffic в Mongo
mongoose.connect('mongodb://localhost/amazeriffic', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true 
}).then(res => {
    console.log("DB Connected!")
}).catch(err => {
    console.log(Error, err.message);
});

app.post("/todos", ToDosController.create);