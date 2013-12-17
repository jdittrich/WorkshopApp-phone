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
                $(timer).countdown('option', {until: time});
                $(timer).countdown("pause"); 
            });
            
                       
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
    //init external popups (http://view.jquerymobile.com/1.4.0-rc.1/dist/demos/popup-outside-multipage/)
    $( "body [data-role='externalPopup']" ).enhanceWithin().popup(); //external popups work only if they are direct childs to body, but that selector is somehow not working. Fix if it does with you, I probably just mistyped.
    
    
    //init external toolbars. Documentation a bit scattered, but start at http://view.jquerymobile.com/1.4.0-rc.1/dist/demos/toolbar-fixed-external/ 
	$( "[data-role='header'], [data-role='footer']" ).toolbar();
    $( "[data-role='navbar']" ).navbar();  
    
    
});

$(document ).on( "pageshow",function(event, ui){
    var config, currentPageID, currentPageIDSplit_array, currentSection, currentStep, currentSubnav, displayedSubnav,displayedSubnavSection;
    
    config={
        siteIdSplittingCharacter:"-",
        mainNavbarSelector:"#main-navbar"
    }
    
    //update external toolbar to show the currently active session
    //fromhere on: needs to go the beforepageshow-event-block!
    
    //we use the id property to determine which mainsection/subsection should be displayed and within this, which should be highlighted.
    currentPageID = $(event.target).attr("id");//get the id string of the currently displayed page
    currentPageIDSplit_array = currentPageID.split(config.siteIdSplittingCharacter);
    currentSection = currentPageIDSplit_array[0];
    currentStep = currentPageIDSplit_array[1];
    
    //highlight main section
    $(config.mainNavbarSelector+" a").each(function(index,element){
        //index starts with 0, so we add 1 each time it is compared with the natural-number like ids
        if(index+1 !== currentSection && $(element).hasClass("ui-btn-active")){
             $(element).removeClass( "ui-btn-active" );
        }
        if(index+1 == currentSection){
            $(element).addClass( "ui-btn-active");
        }   
    });   
    
    //display submenu
    //maybe one could solve this based on the link itself like in the "highlight submenu section"
    displayedSubnav = $("[data-workshop-role='subnav']").filter(":visible"); //the subnavigation currently displayed
    displayedSubnavSection = displayedSubnav.attr("id").split(config.siteIdSplittingCharacter)[0]; //the number character in the currently visible Id
    currentSubnav = $("#"+currentSection+"-navbar");
    
    if (displayedSubnavSection !== currentSection){
        displayedSubnav.css("display","none");
        currentSubnav.css("display","");
    }
       
    
    //highlight submenu  
    currentSubnav.find("a").each(function(index, element){
        if(currentPageID !== $(element).attr("href").substring(1)){ //we don't want the # at the begining of the link, so we start with the 2nd character, which has the index 1
            $(element).removeClass("ui-btn-active");
        }else{
            $(element).addClass("ui-btn-active");
        }
    });
});
    
$(document ).on( "pagebeforechange",function(event, data){  
    
    (function(event, data){
        /*
        functionality that finds the digits the id starts with.
        it matches strings so it is rather unsave/dirty. 
        
        Wrapped into a function so we can return or throw if trouble occurs
        
        Alternative: give pages a data-order attribute and have "43-33-32" or the like as attribute than you dont have the error prone extration operation going on.
        */
        var pageTo, pageToString, pageToOrderNumber,pageFrom, pageFromString,  pageFromOrderNumber;
        
        if (data.toPage instanceof jQuery){
            pageToString = data.toPage.attr("id");
        }else if (typeof data.toPage === "string"){
            pageToString = data.toPage;
        }else{
            return;
        }
            
        
        /*1. Get the substring from the last occurence of "#" to the end of the string
          2. in this string, match all numbers followed by a "-" like 1- in "asdsa1-awde"
          3. an array will be returned. We dont expect more than 1 match, but even if, just take the first item [0] 
          4. replace all "-" with "" (nothing) to get the number itself */
        if(pageToString.search(/#.*[\d-]/) !== -1){
            pageToOrderNumber= parseFloat(pageToString.substring(pageToString.lastIndexOf("#")).match(/[\d-]+/)[0].replace(/-/g,""));
            console.log(pageToOrderNumber);
        }
        
        
        
        if (data.options.fromPage instanceof jQuery){ //in a single page app it should be always a jq object
            pageFromString = data.options.fromPage.attr("id");
        }else{
            return;
        }
        
        if(pageFromString.search(/#.*[\d-]/) !== -1){//there is some "#" and some digit 
             
             
            /*1. Get the substring from the last occurence of "#" to the end of the string
          2. in this string, match all numbers followed by a "-" like 1- in "asdsa1-awde"
          3. an array will be returned. We dont expect more than 1 match, but even if, just take the first item [0] 
          4. replace all "-" with "" (nothing) to get the number itself */  
             pageFromOrderNumber = parseFloat(pageFromString.substring(pageFromString.lastIndexOf("#")).match(/[\d-]+/)[0].replace(/-/g,""));
                 
        }
        
        //If both numbers are there…
        if(!isNaN(pageToOrderNumber)&& !isNaN(pageFromOrderNumber)){ //there is just a native "isNaN" so we reverse it (!) to make it an is-number-function
            if(pageToOrderNumber>pageFromOrderNumber){
                data.options.transition = "slide";
                data.options.reverse = false;
            }
            if(pageToOrderNumber<pageFromOrderNumber){
                data.options.transition = "slide";
                data.options.reverse = true;
            }
        }
        
        console.log(pageFromOrderNumber, pageToOrderNumber);
    }(event,data))
 /*
 seemingly, one can change the 
 data.options.transition="slide"
 data.options.reverse=true
 object in order to influence the transition animation:
 "It should be noted that callbacks can modify both the toPage and options properties to alter the behavior of the current changePage() call. http://api.jquerymobile.com/pagebeforechange/"
 
 keep in mind (though possibly irrelevant) http://jquerymobile.com/blog/2013/10/24/jquery-mobile-1-4-0-rc1-released/
 …but maybe we want to switch to pagebeforetransition as event?
 */
    
    
    
/*
the future page is: event.data.toPage
the current page is data.options.fromPage

*/
    
/*
possibly we just should have "1-2-somestring" IDs at pages to determine their place --> did it
*/

})
    