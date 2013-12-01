var createTimer = function(selector,time,stopCallback){
        var timerContainer, timer,startButton, resetButton;

        

        timerContainer=$('<div>',{"class":"clock-custom-container"}); //this will contain only the flipclock object;
        buttonContainer=$('<div/>',{"class":"clock-custom-button-container"});
        
        timer = $(timerContainer)
        .countdown({until:time,
                    onExpiry:stopCallback,
                    compact:true,
                    format:"MS"})
        .countdown('pause'); //it autostart otherwise
                    
        timerContainer.appendTo(selector);
        
        startButton = $("<button/>",{
            text:"start", 
            "class":"clock-custombutton clock-custombutton-start"
        }).click(function(){
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
    $(event.target).find(".flipclock").each(function(index, element){
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
    
    