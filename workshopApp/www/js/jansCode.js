var createTimer = function (selector, time) {
	var thisContainer, timerContainer, timer, startButton, resetButton, buttonContainer, timerEnd, timerStart, timerReset, notificationContainer;
	var config = {
		timerNotificationText: "Next person – get ready to present and start timer!",
		timerNotificationClass: "clock-custom-notifications label label-info",
		timerContainerClass: "clock-custom-container",
		timerButtonsContainerClass: "clock-custom-button-container",
		timerButtonClass: "btn btn-default clock-custom-button"
	};

	thisContainer = $(selector);
	timerEnd = function () {
		//BEEP part
		if (navigator && navigator.notification && navigator.notification.beep) {
			//IF on phonegap
			navigator.notification.beep(1);
		} else {
			//ELSE (IF not on Phonegap) use the normal browser sound
			var soundFile = new Audio();
			soundFile.src = "img/beep.ogg";
			soundFile.play();
		} //END else


		//RESET Part
		thisContainer.fadeTo(400, 0.1).fadeTo(600, 1, function () {
			//notificationContainer.fadeTo(200,1);
			notificationContainer.show(400);
			$(timer).countdown('option', {
				until: time
			});
			$(timer).countdown("pause");
		});


	}; //END function

	//Starts the timer
	timerStart = function () {
		$("." + config.timerContainerClass).trigger("timerstart", {
			"target": timerContainer
		}); //with on("timerstart"…) timers can get this event.
		$(timer).countdown("resume");
		//notificationContainer.fadeTo(200,0.0);
		notificationContainer.hide();
	};

	//resets the timer to the orignally passed timer
	timerReset = function () {
		$(timer).countdown('option', {
			until: time
		});
		$(timer).countdown("pause");
	};

	timerContainer = $('<div>', {
		"class": config.timerContainerClass
	}); //this will contain only the clock object;
	buttonContainer = $('<div/>', {
		"class": config.timerButtonsContainerClass
	});
	notificationContainer = $('<div/>', {
		"class": config.timerNotificationClass,
		"text": config.timerNotificationText
	}).hide();

	timer = $(timerContainer)
		.countdown({
			until: time, //time in seconds
			onExpiry: timerEnd, //the "alarm" when the time is off
			compact: true, //no Minutes:xx Seconds:xx
			format: "MS"
		})
		.countdown('pause'); //it autostarts. And this stops it.

	//react on timerstart event in order to stop if another timer is started
	timerContainer.on("timerstart", function (e) {
		if (e.target != timerContainer) {
			$(timerContainer).countdown("pause");
		}
	});

	startButton = $("<button/>", { //START-Button
		text: "start",
		"class": config.timerButtonClass
	}).click(timerStart);

	resetButton = $("<button/>", {
		text: "reset",
		"class": config.timerButtonClass
	}).click(timerReset);

	//$(selector).append(timerContainer);
	$(buttonContainer).append(startButton, resetButton);
	thisContainer.append([notificationContainer, timerContainer, buttonContainer]); //lesser known: pass $.append an array of objects to insert them at once.

	return timer;
}; //createTimer End




$(function () {

	//create Timers
	$(".countdownTimer").each(function (index, element) {
		if (!createTimer) {
			throw "no createTimer function present, can't create timer!";
		}

		var duration = parseFloat($(element).attr("data-clock-duration"));
		if (typeof duration !== "number") {
			throw "data-clock-duration attribute is not a number (NaN): " + typeof duration;
		} else {
			createTimer(element, duration); //end createTimer call

		} //end else
	}); //end each callback function and each function call

	//activate the 1st link in the subnav each time a mainnav link is clicked
	$('#stepsnavContainer a').click(function (e) {
		e.preventDefault();
		$('#subnavContainer li[class="active"]').removeClass("active");
		var hrefString = $(e.target).attr("href");
		if (typeof hrefString === "string") {
			$('#subnavContainer ' + hrefString + " a:first").tab("show");
		}
	}); //click( and function(){ end;

	//update active tabs
	$('#content-steps div a[data-toggle="tab"]').click(function (e) {
		e.preventDefault();
		$('#subnavContainer li[class="active"]').removeClass("active");
		$('#stepsnavContainer li[class="active"]').removeClass("active");

		//determine the main nav to activate by extracting the number from the link
		//---------------------------------
		var hrefString = $(e.target).attr("href");

		if (typeof hrefString !== "string") {
			return;
		}
		var mainNavNumber = parseFloat(hrefString.slice(1));
		if (mainNavNumber > -1) {
			$("#stepsnavContainer li").eq(mainNavNumber - 1).children("a").tab("show"); //-1 since document is 1 based and eq is 0 based-counted
		}

		//activate the subnav link with the same target as the clicked link
		//---------------------------------
		$("#subnavContainer li a[href=" + hrefString + "]").parent().addClass("active");
	});
}); //end ready

$(document).on('show.bs.tab', 'a[data-toggle="tab"]', function (e) {
	config={
		classPanelForwardMove:"slideFromLeft"
	}
	e.target // activated tab
	e.relatedTarget // previous tab

	var panelId = $(e.target).attr("href");

	//link must be an Id
	if(panelId.charAt(0)!=="#"){
		return;
	}

	//calculate if the change is backward or forward
	panelId.split("-");

	$(panelId).addClass(config.classPanelForwardMove)

})

$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
	config={
		classPanelForwardMove:"slideFromLeft",
		classPanelFinalStyle:"slideIn"
	}
	e.target // activated tab
	e.relatedTarget // previous tab

	var panelId = $(e.target).attr("href");
	if(panelId.charAt(0)!=="#"){
		return;
	}

	$(panelId).addClass(config.classPanelFinalStyle)
})
