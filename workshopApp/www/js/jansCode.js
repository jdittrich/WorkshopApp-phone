var createTimer = function(selector,time,stopCallback){
        var timerContainer, timer,startButton, resetButton;
        var config={
            timerContainerClass: "clock-custom-container",
            timerButtonsContainerClass:"clock-custom-button-container",
        };
        

        timerContainer=$('<div>',{"class":config.timerContainerClass}); //this will contain only the flipclock object;
        buttonContainer=$('<div/>',{"class":config.timerButtonsContainerClass});
        
        timer = $(timerContainer)
        .countdown({until:time, //time in seconds
                    onExpiry:stopCallback, //the "alarm" when the time is off
                    compact:true, //no Minutes:xx Seconds:xx
                    format:"MS"})
        .countdown('pause'); //it autostarts. And this stops it. 
                    
        timerContainer.appendTo(selector);
        
        //react on timerstart event in order to stop if another timer is started
        timerContainer.on("timerstart", function(e){
            if(e.target != timerContainer){
                $(timerContainer).countdown("pause");
            }
        });
    
        startButton = $("<button/>",{
            text:"start", 
            "class":"clock-custombutton clock-custombutton-start"
        }).click(function(){
            $("."+config.timerContainerClass).trigger("timerstart",{"target":timerContainer});
            $(timer).countdown("resume");
        });
        resetButton = $("<button/>",{
            text:"reset", 
            "class":"flipclock-custombutton flipclock-custombutton-reset"
        }).click(function(){
            $(timer).countdown('option', 
    {until: time});
            $(timer).countdown("pause");
        });
    
        $(buttonContainer).append(startButton, resetButton);
        $(selector).append([timerContainer,buttonContainer]); //lesser known: pass $.append an array of objects to insert them at once. 
        
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
            createTimer(element,duration, function(){
               
                if(navigator && navigator.notification && navigator.notification.beep){//if on phonegap
                    navigator.notification.beep(1);        
                }else{ //else use the normal browser sound
                    var soundFile= new Audio();
                    soundFile.src="img/beep.ogg";
                    soundFile.play();
                }//END else 
            }//END function
        );//end createTimer call
        
        }//end else
    });//end each callback function and each function call   
}); //end pagebeforecreate

$(document).ready(function () { //was: onbeforepageload, but this was stupid: each time the page was loaded it was executed again. 

    //We create the timer reacting on jquery mobile's "pagebeforecreate" event, so that the markup we insert here is enhanced by jquery mobile
    
   
});
    
    