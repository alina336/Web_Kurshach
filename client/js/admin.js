var liaWithEditOrDeleteOnClick = function (User, callback) {
	var $userListItem = $("<li>").text(User.username);
    if (User.username != "admin") {
        var $userRemoveLink = $("<a>").attr("href", "users/" + User.username);
        $userRemoveLink.addClass("linkRemove");
        $userRemoveLink.text("Удалить");
        $userRemoveLink.on("click", function () {
            $.ajax({
                url: "/users/" + User.username,
                type: "DELETE"
            }).done(function (responde) {
                callback();
            }).fail(function (err) {
                console.log("Произошла ошибка: " + err.textStatus);
            });
            return false;
        });
        $userListItem.append($userRemoveLink); 
    }
	
	return $userListItem;
}

var main = function(userObjects) {
	"use strict";
	// создание пустого массива с вкладками
	var tabs = [];

	// добавляем вкладку Пользователи
	tabs.push({
		"name": "Пользователи",
		"content": function(callback) {
			$.getJSON("/users.json", function (userObjects) {
				var $content = $("<ul>");
				for (var i = userObjects.length-1; i>=0; i--) {
					var $userListItem = liaWithEditOrDeleteOnClick(userObjects[i], function() {
						$(".tabs a:first-child span").trigger("click");
					});
					var $text = $("<p>").text("");
					$content.append($text);
					$content.append($userListItem);
				}
				callback(null, $content);
			}).fail(function (jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});
	
	// создаем вкладку Добавить пользователя
	tabs.push({
		"name": "Добавить",
		"content":function () {
			$.get("/users.json", function (userObjects) {	
				// создание $content для Добавить 
				var $textInput = $("<h3>").text("Введите имя нового пользователя: "),
					$input = $("<input>").addClass("username"), 
					$button = $("<button>").text("Добавить"),
					$content = $("<ul>");

				$content.append($input);
				$("main .content").append($textInput);
				$("main .content").append($content);
				$("main .content").append($button); 
				
				function btnfunc() {
					var username = $input.val();
					// создаем нового пользователя
                    if (username !== null && username.trim() !== "") {
                        var newUser = {"username": username};
                        $.post("/users", newUser, function(result) {
                            console.log(result);
                            // отправляем на клиент
                            userObjects.push(newUser);
                            $input.val("");
                            $(".tabs a:first-child span").trigger("click");
                        }).done(function(responde) {
                            console.log(responde);
                            alert('Аккаунт успешно создан!')
                        }).fail(function(jqXHR, textStatus, error) {
                            console.log(error);
                            if (jqXHR.status === 501) {
                                alert("Такой пользователь уже существует!\nИзмените логин и повторите "
                                    + "попытку");
                            } else {					
                                alert("Произошла ошибка!\n"+jqXHR.status + " " + jqXHR.textStatus);	
                            }
                        });
                    }
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
    $.getJSON("/users.json", function (userObjects) {
        var username = Cookies.get('CurrentUser'); // => "value"
        var $place = $("<p>").text("Здравствуйте, " + username);
        $("header .username").append($place);
        console.log(username);
        main(userObjects);
    });	
});