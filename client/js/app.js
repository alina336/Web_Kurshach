var organizeByTags = function (toDoObjects) {
	// создание пустого массива для тегов
	var tags = [];
	// перебираем все задачи toDos
	toDoObjects.forEach(function (toDo) {
		// перебираем все теги для каждой задачи
		toDo.tags.forEach(function (tag) {
			// убеждаемся, что этого тега еще нет в массиве
			if (tags.indexOf(tag) === -1) {
				tags.push(tag);
			}
		});
	});
	var tagObjects = tags.map(function (tag) {
		// здесь мы находим все задачи, содержащие этот тег
		var toDosWithTag = [];
		toDoObjects.forEach(function (toDo) {
			// проверка, что результат  indexOf is *не* равен -1
			if (toDo.tags.indexOf(tag) !== -1) {
				toDosWithTag.push(toDo.description);
			}
		});
		// мы связываем каждый тег с объектом, который  содержит название тега и массив
		return { "name": tag, "toDos": toDosWithTag };
	});
	// console.log(tagObjects);
	return tagObjects;
};

var liaWithEditOrDeleteOnClick = function (todo) {
	var $todoListItem = $("<li>").text(todo),
		$todoEditLink = $("<a>").attr("href", "todos/" + todo._id),
		$todoRemoveLink = $("<a>").attr("href", "todos/" + todo._id);

	$todoEditLink.text(" Редактировать");
	$todoEditLink.on("click", function() {
		var newDescription = prompt("Введите новое наименование для задачи", todo);
		if (newDescription !== null && newDescription.trim() !== "") {
			$.ajax({
				"url": "/todos/" + todo._id,
				"type": "PUT",
				"data": { "description": newDescription },
			}).done(function (responde) {
				$(".tabs a:nth-child(2) span").trigger("click");
			}).fail(function (err) {
				console.log("Произошла ошибка: " + err);
			});
		}
		return false;
	});
	$todoListItem.append($todoEditLink);

	$todoRemoveLink.text(" Удалить");
	$todoRemoveLink.on("click", function () {
		$.ajax({
			url: "/todos/" + todo._id,
			type: "DELETE",
		}).done(function (responde) {
			$(".tabs a:first-child span").trigger("click");
		}).fail(function (err) {
			console.log("error on delete 'todo'!");
		});
		return false;
	});
	$todoListItem.append($todoRemoveLink);
	return $todoListItem;
}

var main = function (toDoObjects) { 
	"use strict";
	var toDos = toDoObjects.map(function (toDo) {
		// просто возвращаем описание этой задачи
		return toDo.description;
	});
	// сейчас весь старый код должен работать как раньше!
	$("document").ready( function(){

		$(".tabs a span").toArray().forEach(function (element) { 
			// создаем обработчик щелчков для этого элемента 
			$(element).on("click", function () {
				// поскольку мы используем версию элемента jQuery,
				// нужно создать временную переменную,
				// чтобы избежать постоянного обновления
				var $element = $(element),
				$content;
				$(".tabs a span").removeClass("active");
				$element.addClass("active");
				$("main .content").empty();
				if ($element.parent().is(":nth-child(1)")) {
					for (var i = toDos.length-1; i > -1; i--) { 
						var $todoListItem = liaWithEditOrDeleteOnClick(toDos[i]);
						$(".content").append($todoListItem);
						// $(".content").append($("<li>").text(toDos[i]));
					}
				} 
				else if ($element.parent().is(":nth-child(2)")) {
					$content = $("<ul>");
					toDos.forEach(function (todo) {
						var $todoListItem = liaWithEditOrDeleteOnClick(toDos);
						$(".content").append($todoListItem);
							// $content.append($("<li>").text(todo));
					});
					$("main .content").append($content);
				} 
				else if ($element.parent().is(":nth-child(3)")) {
					// ЭТО КОД ДЛЯ ВКЛАДКИ ТЕГИ
					console.log("щелчок на вкладке Теги");
					var organizedByTag = organizeByTags(toDoObjects);
					organizedByTag.forEach(function (tag) {
						var $tagName = $("<h3>").text(tag.name),
						$content = $("<ul>");
						tag.toDos.forEach(function (description) {
						var $li = $("<li>").text(description);
						$content.append($li);
						});
						$("main .content").append($tagName);
						$("main .content").append($content);
					});
				}
				else if ($element.parent().is(":nth-child(4)")) {
					var $input = $("<input>").addClass("description"), 
					$inputLabel = $("<p>").text("Новая задача: "),
					$tagInput = $("<input>").addClass("tags"),
					$tagLabel = $("<p>").text("Тэги: "),
					$button = $("<button>").text("+");
					$("main .content").append($inputLabel).append($input).append($tagLabel).append($tagInput).append($button); 

					function btnfunc() {
						var description = $input.val(),
							// разделение в соответствии с запятыми
							tags = $tagInput.val().split(","), 
							newToDo = {"description":description, "tags":tags};
							$.post("todos", newToDo, function(result) {
								console.log(result);
								// нужно отправить новый объект на клиент  после получения ответа сервера
								toDoObjects.push(newToDo);
								// обновляем toDos
								toDos = toDoObjects.map(function (toDo) {
									return toDo.description;
								});
								$input.val("");
								$tagInput.val("");
							});
					}

					$button.on("click", function () {
						if (($input.val() !== "") && (($input.val()).trim().length > 0)) { btnfunc(); }
					});
					$input.keypress(function(event) {
						if (($input.val() !== "") && (($input.val()).trim().length > 0)) {
							if (event.which == 13) { btnfunc(); }
						}
					});
					$tagInput.keypress(function(event) {
						if (($input.val() !== "") && (($input.val()).trim().length > 0) && ($tagInput.val() !== "") && ($tagInput.val()).trim().length > 0) {
							if (event.which == 13) { btnfunc(); }
						}
					});		
				}
				return false;
			})
		})
		
		$(".tabs a:first-child span").trigger("click");
		
		})

	var addCommentFromInputBox = function () {
		var $new_comment;
		if ($(".comment-input input").val() !== "") {
			$new_comment = $("<p>").text($(".comment-input input").val());
			$new_comment.hide();
			$(".comments").append($new_comment);
			$new_comment.fadeIn();
			$(".comment-input input").val("");
		}
	};
	$(".comment-input button").on("click", function (event) {
		addCommentFromInputBox();
	});
	$(".comment-input input").on("keypress", function (event) {
		if (event.keyCode === 13) {
			addCommentFromInputBox();
		}
	});
};
$(document).ready(function () {
	$.getJSON("todos.json", function (toDoObjects) {
	// вызов функции main с аргументом в виде объекта toDoObjects 
		main(toDoObjects);
	});
}); 