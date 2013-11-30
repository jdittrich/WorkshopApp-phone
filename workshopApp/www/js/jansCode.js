var createTimer = function(selector,time,stopCallback){
        var timerContainer, timer,startButton, resetButton;

        

        timerContainer=$('<div>',{"class":"flipclock-custom-container"}); //this will contain only the flipclock object;
        buttonContainer=$('<div/>',{"class":"flipclock-custom-button-container"});
    
        timer = timerContainer.FlipClock({
            callbacks:{
                stop:stopCallback
            },
            countdown: true, //otherwise it counts upwards
            autoStart: false, //otherwise it will "tick" right after being created
            clockFace: "MinuteCounter"
        });
        timer.setTime(time);
        
        timerContainer.appendTo(selector);
        
        startButton = $("<button/>",{
            text:"start", 
            "class":"flipclock-custombutton flipclock-custombutton-start"
        }).click(function(){
            if(timer.timer.factory.time<=0){return;} //<= because when the displayed time is  on 0, the time value is actually -1 (possible we trigger an additional flip in the start function) 
            timer.start(); //starts the timer
            timer.flip();//due to a bug (?) the first flip occurs not after 1, but after 2 seconds, as the first triggering of the flip method changes nothing. So we trigger it here the first time. 
        });
        resetButton = $("<button/>",{
            text:"reset", 
            "class":"flipclock-custombutton flipclock-custombutton-reset"
        }).click(function(){
            timer.stop();//otherwise it will just continue after reset
            timer.setTime(time); //sets the time to the time value passed for initialization. Closures FTW. 
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
    $(event.target).find(".flipclock").each(function(index, element){
        if(!createTimer){
            throw "no createTimer function present, can't create timer!";
        }
        
        var duration = parseFloat($(element).attr("data-clock-duration"));
        if(typeof duration !== "number"){
            throw "data-clock-duration attribute is not a number (NaN): "+typeof duration;
        }else{
            createTimer(element,duration, function(){
                if(this.factory.time.time!==0){return}// since the function will be called everytime the timer is stopped, not only when the time is up (on 0). So every stop done while there is still time left, leads to an return. 
                //TODO: needs some check that the timer is finished and not just reset. 
                console.log("callback?!");
                //this function will be called when the timer reached 00:00 
                
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
    
    /*
    clock = $('.flipclock').FlipClock({
            callbacks{
                stop:function(){console.log("heho")}
            },
            countdown: true,
            autoStart: false
        });
    clock.setTime(3);
    clock.start();*/
});
    
    