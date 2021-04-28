function convertDate(inputFormat) {
	function pad(s) {
		return s < 10 ? "0" + s : s;
	}
	var d = new Date(inputFormat);
	return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
}

let background = "./backgrounds\\white.png",
	imgFormData,
	type = "на лолю",
	front = "./gradients\\rainbow1.png",
	userName = "Василий Пупкин",
	id = 1,
	userId = 1,
	currentDate = new Date(),
	dateOfCreation = convertDate(Date.now()),
	newDate = new Date(currentDate.getTime() + 86400000 * 90), // + 1 day in ms
	dateOfEnding = convertDate(newDate.toLocaleString()); // + 1 day in ms

$(window).ready(function () {
	$(".preview-front").attr("src", colors[front]);
	$(".preview-background").attr("src", backgrounds[background]);
	$(".preview-name").text(userName);
	$(".preview-id").text(id);
	$(".preview-date").text(convertDate(dateOfCreation));
	$(".preview-dateend").text(convertDate(dateOfEnding));
	if (/iPhone|iPod/.test(navigator.platform)) {
	}

	$("#preloader").fadeOut(100).css("opacity", "0.5");

	// footer = 90 - 15;
	// setTimeout(function () {
	// 	$("#settings").css("max-height", String(parseFloat($(window).innerHeight()) - ($(".top-section").innerHeight() + footer)) + "px");
	// 	$("#fill").css("height", String($(".preview-background").height()) + "px");
	// }, 10);
	// setTimeout(function () {
	// 	$("#settings").css("max-height", String(parseFloat($(window).innerHeight()) - ($(".top-section").innerHeight() + footer)) + "px");
	// 	$("#fill").css("height", String($(".preview-background").height()) + "px");
	// }, 100);
	// setTimeout(function () {
	// 	$("#settings").css("max-height", String(parseFloat($(window).innerHeight()) - ($(".top-section").innerHeight() + footer)) + "px");
	// 	$("#fill").css("height", String($(".preview-background").height()) + "px");
	// }, 250);

	$(".sett-color").parent().css("padding-bottom", "47.5px");

	$(".sett-cardcolor").on("click", function () {
		$(".sett-cardcolor").removeClass("selected");
		$(this).addClass("selected");
		params.color = $(this).attr("data-id");
		changeColor(params.color);
	});

	$(".sett-backcolor").on("click", function () {
		$(".sett-backcolor").removeClass("selected");
		$(this).addClass("selected");
		params.background = $(this).attr("data-id");
		changeBackground(params.background);
	});
});
vkBridge.send("VKWebAppInit").then(() => {
	vkBridge.send("VKWebAppGetUserInfo").then((data) => {
		var user_id = data.id; // user's id
		var app_id = 7350674; // your app's id
		userId = data.id;

		admanInit(
			{
				user_id: user_id,
				app_id: app_id,
				// mobile: true, // for mobile apps
				// params: {preview: 1}, // to verify the correct operation of advertising
				type: "rewarded", // 'preloader' or 'rewarded' (default - 'preloader')
			},
			onAdsReady,
			onNoAds
		);

		function onAdsReady(adman) {
			adman.onStarted(function () {});
			adman.onCompleted(function () {});
			adman.onSkipped(function () {});
			adman.onClicked(function () {});
			adman.start("preroll");
		}

		function onNoAds() {}
		$(".preview-id").text(data.id);
		$("#inputNickname").value(data.first_name + " " + data.last_name);
		$(".preview-name").text(data.first_name + " " + data.last_name);
		vkBridge.send("VKWebAppJoinGroup", { group_id: 192847668 }).then(() => {
			vkBridge.send("VKWebAppAllowMessagesFromGroup", { group_id: 192847668 }).then(() => {});
		});
	});
});

var params = { color: 1, background: 1, name: $("#name").val(), type: "на лолю", photo: 0, qr: false };
var backgrounds = [null, "./backgrounds\\white.png", "./backgrounds\\aqua.png", "./backgrounds\\purple.png", "./backgrounds\\black.png"];
var colors = [null, "./gradients\\rainbow1.png", "./gradients\\pink.png", "./gradients\\rainbow2.png", "./gradients\\orange.png", "./gradients\\moonlight.png", "./gradients\\orange2.png"];

function changeColor(id) {
	$("#preloader").fadeIn(100);
	$(".preview-front")
		.attr("src", colors[id])
		.ready(function () {
			setTimeout(function () {
				front = colors[id];
				$("#preloader").fadeOut(100);
			}, 100);
		});
}

function changeBackground(id) {
	$("#preloader").fadeIn(100);
	$(".preview-background")
		.attr("src", backgrounds[id])
		.ready(function () {
			setTimeout(function () {
				background = backgrounds[id];
				$("#preloader").fadeOut(100);
			}, 100);
		});
}

function sendRequest() {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "https://young-mesa-70239.herokuapp.com/", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(
		JSON.stringify({
			background,
			imgFormData,
			type,
			front,
			userName,
			id,
			userId,
			dateOfCreation,
			dateOfEnding,
		})
	);
}

function changeName() {
	text = $("#name").val().substr(0, 20);
	$("#name").val(text);
	$("#name-used").text(`${text.length}\\20`);
	$(".preview-name").text(text);
	userName = text;
}

function changeType() {
	text = $("#type").val().substr(0, 10);
	$("#type").val(text);
	$("#type-used").text(`${text.length}\\10`);
	$(".preview-type").text(text);
	type = text;
}

var formData = new FormData();
var imagefile = document.querySelector(".avatar");
formData.append("image", imagefile.files[0]);
console.log(formData);

function changePhoto(input) {
	photo = $("#photo")
		.val()
		.replace(/.*[\/\\]/, "");
	if (photo.length > 19) {
		text = photo.substr(0, 19) + "...";
	} else {
		text = photo;
	}
	$("#img").text(text);
	if (input.files && input.files[0]) {
		$("#preloader").fadeIn(100);
		var reader = new FileReader();
		reader.onload = function (e) {
			let blobFile = $("#photo").files[0];
			let formData = new FormData();
			formData.append("fileToUpload", blobFile);
			$(".preview-photo").css("background-image", "url(" + e.target.result + ")");
			$(".photo-chooser").text("Файл выбран!");
			params.photo = e.target.result;
			setTimeout(function () {
				$("#preloader").fadeOut(100);
			}, 100);
		};
		reader.readAsDataURL(input.files[0]);
	}
}

$(document).on("focus blur", "select, textarea, input[type=text], input[type=date], input[type=password], input[type=email], input[type=number]", function (e) {
	var $obj = $(this);
	var nowWithKeyboard = e.type == "focusin";
	$("body").toggleClass("view-withKeyboard", nowWithKeyboard);
	onKeyboardOnOff(nowWithKeyboard);
});

function show_notify(text, color = "#fbfbfb", clr = "black", callback = () => {}) {
	$("#notify").css("background-color", color).css("color", clr).html(text).show(200);
	setTimeout(function () {
		$("#notify").hide(150);
	}, 2500);
}
