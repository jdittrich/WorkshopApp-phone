var reset


var createTimer = function(selector,time){
        var thisContainer,timerContainer, timer,startButton, resetButton, buttonContainer, timerEnd, timerStart, timerReset, notificationContainer;
        var config={
            timerNotificationText:"Next person – get ready to present and start timer!",
            timerNotificationClass:"clock-custom-notifications",
            timerContainerClass: "clock-custom-container",
            timerButtonsContainerClass:"clock-custom-button-container",
        };
        
        thisContainer = $(selector);
        timerEnd = function(){
            //BEEP part
            if(navigator && navigator.notification && navigator.notification.beep){
                //IF on phonegap
                navigator.notification.beep(1);        
            }else{ 
                //ELSE (IF not on Phonegap) use the normal browser sound
                var soundFile= new Audio();
                soundFile.src="img/beep.ogg";
                soundFile.play();
            }//END else 
            
            
            //RESET Part
            thisContainer.fadeTo(400,0.1).fadeTo(600,1, function(){
                notificationContainer.fadeTo(200,1);
            });
            
            $(timer).countdown('option', {until: time});
            $(timer).countdown("pause");            
        };//END function
        
        //Starts the timer
        timerStart = function(){
            $("."+config.timerContainerClass).trigger("timerstart",{"target":timerContainer}); //with on("timerstart"…) timers can get this event.
            $(timer).countdown("resume");
            notificationContainer.fadeTo(200,0.0);
        };
        
        //resets the timer to the orignally passed timer
        timerReset = function(){
            $(timer).countdown('option', {until: time});
            $(timer).countdown("pause");
        };
        
        timerContainer=$('<div>',{"class":config.timerContainerClass}); //this will contain only the clock object;
        buttonContainer=$('<div/>',{"class":config.timerButtonsContainerClass});
        notificationContainer = $('<div/>',{
            "class":config.timerNotificationClass,
            "text":config.timerNotificationText
        }).css("opacity","0.0");
        
        timer = $(timerContainer)
        .countdown({until:time, //time in seconds
                    onExpiry:timerEnd, //the "alarm" when the time is off
                    compact:true, //no Minutes:xx Seconds:xx
                    format:"MS"})
        .countdown('pause'); //it autostarts. And this stops it. 
                    
        //react on timerstart event in order to stop if another timer is started
        timerContainer.on("timerstart", function(e){
            if(e.target != timerContainer){
                $(timerContainer).countdown("pause");
            }
        });
    
        startButton = $("<button/>",{ //START-Button
            text:"start",
            "class":"clock-custombutton clock-custombuttoButtonsContainerClassn-start"
        }).click(timerStart);
    
        resetButton = $("<button/>",{
            text:"reset", 
            "class":"clock-custombutton flipclock-custombutton-reset"
        }).click(timerReset);
        
        //$(selector).append(timerContainer);
        $(buttonContainer).append(startButton, resetButton);
        thisContainer.append([notificationContainer,timerContainer,buttonContainer]); //lesser known: pass $.append an array of objects to insert them at once. 
        
        return timer;
};//createTimer End



$(document).bind("mobileinit", function(){
    //apply jQMobile overrides here
    $.mobile.defaultPageTransition = "none";
});

$(document).on("pagecreate",function(){}); //equivalten to jQuery's ready

$(document).on("pagebeforecreate",function(event){
    $(event.target).find(".countdownTimer").each(function(index, element){
        if(!createTimer){
            throw "no createTimer function present, can't create timer!";
        }
        
        var duration = parseFloat($(element).attr("data-clock-duration"));
        if(typeof duration !== "number"){
            throw "data-clock-duration attribute is not a number (NaN): "+typeof duration;
        }else{
            createTimer(element,duration);//end createTimer call
        
        }//end else
    });//end each callback function and each function call   
}); //end pagebeforecreate

$(document).ready(function () { //was: onbeforepageload, but this was stupid: each time the page was loaded it was executed again.
    var config, currentPageID, currentPageIDSplit_array, currentSection, currentStep;
    
    config={
        siteIdSplittingCharacter:"-",
        mainNavbarSelector:"#main-navbar"
    }
    
    //init external popups (http://view.jquerymobile.com/1.4.0-rc.1/dist/demos/popup-outside-multipage/)
    $( "body [data-role='externalPopup']" ).enhanceWithin().popup(); //external popups work only if they are direct childs to body, but that selector is somehow not working. Fix if it does with you, I probably just mistyped.
    
    
    //init external toolbars. Documentation a bit scattered, but start at http://view.jquerymobile.com/1.4.0-rc.1/dist/demos/toolbar-fixed-external/ 
	$( "[data-role='header'], [data-role='footer']" ).toolbar();
    $( "[data-role='navbar']" ).navbar();  
    
    //update external toolbar to show the currently active session
    //fromhere on: needs to go the beforepageshow-event-block!
    
    //we use the id property to determine which mainsection/subsection should be displayed and within this, which should be highlighted.
    currentPageID = $(this).attr("id");//get the id string of the currently displayed page
    currentPageIDSplit_array = currentPageID.split(config.siteIdSplittingCharacter);
    currentSection = currentPageIDSplit_array[0];
    currentStep = currentPageIDSplit_array[1];
    
    //highlight main section
    $(config.mainNavbarSelector+" [data-role='navbar'] a").each(function(index,element){
        if(index !== currentSection && $(element).hasClass("ui-btn-active")){
             $(element).removeClass( "ui-btn-active" );
        }
        if(index == currentSection){
            $(element).addClass( "ui-btn-active");
        }   
    });   
    
    //display submenu
    /*
    Which submenu is currently displayed? use: filter(":visible")
    is it the right one
    if not: hide the current, display the new. 
    */
    
    //highlight submenu  
    /*
    select displayed submenu
    
    remove class 
    
    add class to current element.
    
    
    */
    
    //TODO1
    //split id-string at "-"
    //assign first part to section, 2nd to step
    //go through the section navbar, look for data-section… attrib match
    ////go through the step navbar, look for data-section… attrib match
});
    
    