var organizeByTags = function (mealObjects) { 
	// создание пустого массива для тегов
	var tags = [];
	// перебираем все задачи meals 
	mealObjects.forEach(function (Receipt) {
		// перебираем все теги для каждой задачи 
		Receipt.tags.forEach(function (tag) {
			// убеждаемся, что этого тега еще нет в массиве
			if (tags.indexOf(tag) === -1) { 
				tags.push(tag);
			}
		});
	}); 
	var tagObjects = tags.map(function (tag) {
		// здесь мы находим все задачи,
		// содержащие этот тег
		var mealsWithTag = []; 
		mealObjects.forEach(function (Receipt) {
			// проверка, что результат
			// indexOf is *не* равен -1
			if (Receipt.tags.indexOf(tag) !== -1) { 
				mealsWithTag.push(Receipt.description);
			}
		});
		// мы связываем каждый тег с объектом, который содержит название тега и массив
		return { "name": tag, "meals": mealsWithTag };
	});
	return tagObjects;
};

var liaWithEditOrDeleteOnClick = function (Receipt, callback) {
	var $mealListItem = $("<li>").text(Receipt.description),
		$mealEditLink = $("<a>").attr("href", "meals/" + Receipt._id),
		$mealRemoveLink = $("<a>").attr("href", "meals/" + Receipt._id);

	$mealEditLink.addClass("linkEdit");
	$mealRemoveLink.addClass("linkRemove");

		if (Receipt.status === 'Есть в меню') {
			$mealEditLink.text("Убрать из меню");
			$mealEditLink.on("click", function() {
				var newDescription = Receipt.description + " [Сегодня не в меню]";
				if (newDescription !== null && newDescription.trim() !== "") {
					$.ajax({
						"url": "/meals/" + Receipt._id,
						"type": "PUT",
						"data": { "description": newDescription, "status": 'Сегодня не в меню' },
					}).done(function (responde) {
						Receipt.status = 'Сегодня не в меню';
						callback();
					}).fail(function (err) {
						console.log("Произошла ошибка: " + err);
					});
				}
	
				return false;
			});	
			$mealListItem.append($mealEditLink); 
		}
		else {
			$mealRemoveLink.text("Удалить");
			$mealRemoveLink.on("click", function () {
				$.ajax({
					url: "/meals/" + Receipt._id,
					type: "DELETE"
				}).done(function (responde) {
					callback();
				}).fail(function (err) {
					console.log("Произошла ошибка: " + err.textStatus);
				});
				return false;
			});
			$mealListItem.append($mealRemoveLink);
		}

	return $mealListItem;
}

var main = function (mealObjects) {
	"use strict";
	// создание пустого массива с вкладками
	var tabs = [];
	// добавляем вкладку Меню
	tabs.push({
		"name": "Меню",
		"content": function(callback) {
			$.getJSON("meals.json", function (mealObjects) {
				var $content = $("<ul>");
				for (var i = mealObjects.length-1; i>=0; i--) {
					var $mealListItem = liaWithEditOrDeleteOnClick(mealObjects[i], function() {
						$(".tabs a:first-child span").trigger("click");
					});
					var $text = $("<p>").text("");
					var $ingredients = $("<li>").text("Состав: " + mealObjects[i].tags);
					var $price = $("<li>").text("Цена: " + mealObjects[i].price + " рублей");
					$content.append($text);
					$content.append($mealListItem);
					$content.append($ingredients);
					$content.append($price);
				}
				callback(null, $content);
			}).fail(function (jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// добавляем вкладку Сегодня в меню
	tabs.push({
		"name": "Есть в меню",
		"content": function(callback) {
			$.getJSON("meals.json", function (mealObjects) {
				var $content,
					i;
				$content = $("<ul>");
				for (i = 0; i < mealObjects.length; i++) {
					if (mealObjects[i].status === 'Есть в меню') {
						var $mealListItem = liaWithEditOrDeleteOnClick(mealObjects[i], function() {
							$(".tabs a:nth-child(2) span").trigger("click");
						});
						var $text = $("<p>").text("");
						var $ingredients = $("<li>").text("Состав: " + mealObjects[i].tags);
						var $price = $("<li>").text("Цена: " + mealObjects[i].price + " рублей");
						$content.append($text);
						$content.append($mealListItem);
						$content.append($ingredients);
						$content.append($price);
					}
				}
				callback(null, $content);
			}).fail(function(jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	// добавляем вкладку Поиск по ингредиентам
	tabs.push({
		"name": "Ингредиенты",
		"content":function (callback) {
			$.get("meals.json", function (mealObjects) {	
				// создание $content для Теги 
				var organizedByTag = organizeByTags(mealObjects),
					$content;
				organizedByTag.forEach(function (tag) {
					var $tagName = $("<h3>").text(tag.name);
						$content = $("<ul>");
					tag.meals.forEach(function (description) {
						var $li = $("<li>").text(description);
						$content.append($li);
					});
					$("main .content").append($tagName);
					$("main .content").append($content);
				});
				callback(null,$content);
			}).fail(function (jqXHR, textStatus, error) {
				// в этом случае мы отправляем ошибку вместе с null для $content
				callback(error, null);
			});
		}
	});

	// создаем вкладку Добавить
	tabs.push({
		"name": "Добавить",
		"content":function () {
			$.get("meals.json", function (mealObjects) {	
				// создание $content для Добавить 
				var $textInput = $("<h3>").text("Введите новое блюдо: "),
					$input = $("<input>").addClass("description"), 
					$textTag = $("<h3>").text("Введите ингредиенты: "),
					$tagInput = $("<input>").addClass("tags"),
					$textPrice = $("<h3>").text("Введите стоимость (в рублях): "),
					$priceInput = $("<input>").addClass("price"),
					$button = $("<button>").text("Добавить"),
					$content1 = $("<ul>"), $content2 = $("<ul>"), $content3 = $("<ul>");

				$content1.append($input);
				$content2.append($tagInput);
				$content3.append($priceInput);

				$("main .content").append($textInput);
				$("main .content").append($content1);
				$("main .content").append($textTag);
				$("main .content").append($content2);
				$("main .content").append($textPrice);
				$("main .content").append($content3);
				$("main .content").append($button); 
				
				function btnfunc() {
					var description = $input.val(),
						tags = $tagInput.val().split(","),
						price = $priceInput.val(),
						// создаем новый элемент списка задач
						newMeal = {"description":description, "tags":tags, "status": 'Есть в меню', "price": price};
						// newReceipt = {"description":description, "phone":phone, "status": 'Открыто'};
					$.post("meals", newMeal, function(result) {
						$input.val("");
						$tagInput.val("");
						$priceInput.val("");
						$(".tabs a:first-child span").trigger("click");
					});
				}
				$button.on("click", function() {
					btnfunc();
				});
				$('.tags').on('keydown',function(e){
					if (e.which === 13) {
						btnfunc();
					}
				});
			});
		}
	});

	tabs.forEach(function (tab) {
		var $aElement = $("<a>").attr("href",""),
			$spanElement = $("<span>").text(tab.name);
		$aElement.append($spanElement);
		$("main .tabs").append($aElement);

		$spanElement.on("click", function () {
			var $content;
			$(".tabs a span").removeClass("active");
			$spanElement.addClass("active");
			$("main .content").empty();
			tab.content(function (err, $content) {
				if (err !== null) {
					alert ("Возникла проблема при обработке запроса: " + err);
				} else {
					$("main .content").append($content);
				}
			});
			return false;
		});
	});

	$(".tabs a:first-child span").trigger("click");
}

$(document).ready(function() {
	$.getJSON("meals.json", function (mealObjects) {
		var username = Cookies.get('CurrentUser'); // => "value"
		var $place = $("<p>").text("Здравствуйте, " + username);
		$("header .username").append($place);
		console.log(username);
		main(mealObjects);
	});
});
