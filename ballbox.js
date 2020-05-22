
$(function(){
    window.enginerunning = false;

    //how much should they move
    window.ox = 5;
    window.oy = 5;

    //speed (lower the faster)
    window.speed = 80;

    //number of balls
    window.balls = 200;

    //Time to recovery
    window.timetorecovery = 4 * 1000 //miliseconds

    //Initially Infected
    window.initInfect = 1;

    $('#run-button').hide()

    window.addball = function(color){
        let px = (Math.random() * 725) + 25;
        let py = (Math.random() * 725) + 25;
        $('body').append("<div class='ball' infected='false' style='top: "+px+"px; left: "+py+"px; background-color:"+color+";' reversex="+ (Math.random()>0.5) +" reversey="+ (Math.random()>0.5) +">")
    }

    window.setTimeout(function(){
        for (let i = 0; i < window.balls; i++){
            addball('gray')
        }
        console.log("Movement X: " + ox);
        console.log("Movement Y: " + oy);
        console.log("Speed: " + speed);
        console.log("Population: " + balls);
        console.log("Initially Infected: " + initInfect);
        console.log("Time to recovery: " + timetorecovery);
        for(i = 0; i < initInfect; i++){
            infect($($(".ball")[i]));
        }
        calNumbers();
        $('#run-button').show()
    }, 200)

    window.gety = function(ball){
        return ball.offset().left;
    }

    window.getx = function(ball){
        return ball.offset().top;
    }

    window.shift = function(ball, dx, dy){ //put in array of items to shift
        window.shiftlog.forEach(  //array of ball element, dx and dy
            function(e,i) 
            {
                let x = Math.round(e.e.offsetTop + e.dx);
                let y = Math.round(e.e.offsetLeft + e.dy);
                x = (x>740)?740-(x-740):x;
                y = (y>740)?740-(y-740):y;
                e.shiftx = x;
                e.shifty = y;
            });
            window.shiftlog.forEach(function(e,i) //array of ball element, dx and dy
            {
                e.e.style.top = e.shiftx + "px";
                e.e.style.left = e.shifty + "px";
            });
            window.shiftlog = [];
        }

    let engine = function(){
        window.infectionlog = []
        window.engine = window.setInterval(function(){

            if(window.blocking == false){
            window.blocking = true;
            window.shiftlog = [];
            //for each ball
            $(".ball").each(function(i,e){
            ball = $(e);

            //check if a random motion path has already been set for the ball
            if(e.dox == undefined && e.doy == undefined)
            {
                e.dox = Math.random() * window.ox;
                e.doy = Math.random() * window.oy;
            }

            dox = e.dox;
            doy = e.doy;

                if(ball.attr('reversex')=="false")
                {
                if(e.offsetTop>(740-dox))
                    {
                        ball.attr('reversex', true)
                    }
                } else {
                    if(e.offsetTop<35)
                    {
                        ball.attr('reversex', false)
                    }
                }

                if(ball.attr('reversey')=="false")
                {
                    if(e.offsetLeft>740-doy)
                    {
                        ball.attr('reversey', true);
                    }
                } else {
                    if(e.offsetLeft<35)
                    {
                        ball.attr('reversey', false);
                    }
                }

                let dx = 0;
                let dy = 0;

                if(ball.attr('reversex')=="true"){
                    dx = dox*-1;
                }
                else
                {
                    dx = dox;
                }

                if(ball.attr('reversey')=="true"){
                    dy = doy*-1;
                }
                else
                {
                    dy = doy;
                }

                window.shiftlog.push({e, dx, dy});

            })

            window.shift();
            checkconflict();
        }
        window.blocking = false;

        }, window.speed)
    }  

    let keepmoving = function(){
        if(!enginerunning){
            window.enginerunning = true;
            window.startTime = new Date();
            engine();
        }
        else{
            alert("The engine is already running!")
        }
    }

    let infect = function(ball){
        //not used anymore?
        ball.attr('infected', "true");
        ball.css('background-color', "red");
        ball[0].infectTime = new Date();
    }

    let recover = function(ball){
        ball.attr('infected', "recover");
        ball.css('background-color', "lightgreen");
    }

    let checkrecovered = function(){
        now = new Date();
        $(".ball[infected='true']").each(function(i,e){
            infecElapse = now - e.infectTime;
            if(infecElapse > timetorecovery)
            {
                recover($(e));
            }
            
        });
    }

    let calNumbers = function(){
        cal = {};
        cal.inf = $(".ball[infected='true']").length;
        cal.recovered = $(".ball[infected='recover']").length;
        cal.free = $(".ball[infected='false']").length;
        cal.total = cal.inf + cal.free + cal.recovered;
        $('#amt-infected').text(cal.inf);
        $('#amt-free').text(cal.free);
        $('#amt-total').text(cal.total);
        $('#amt-recovered').text(cal.recovered);
        return cal;
    }

    let checkconflict = function(){
        $(".ball[infected='true']").each(function(i,e){
            let x = e.offsetTop;
            let y = e.offsetLeft;
            $(".ball[infected='false']").each(function(q,r){
                let dx = x - (r.offsetTop);
                let dy = y - (r.offsetLeft+10);
                if(dx > -20 && dx < 20 && dy > -20 && dy < 20)
                {
                    window.infectionlog.push(r)
                }
            });
        })

        window.infectionlog.forEach(function(e,i){
            ball = $(e);
            ball.attr('infected', "true");
            ball.css('background-color', "red");
            e.infectTime = new Date();
        })

        window.infectionlog = [];

        checkrecovered();
        n = calNumbers();
        if(n.inf == n.total || n.inf == 0)
        {
            stopTime = new Date();
            elapse = (stopTime - window.startTime)/1000
            console.log("----------------------------------------------------------")
            console.log("Total Time for all Infections: " + elapse + " seconds.")
            console.log("Not infected: " + n.free)
            console.log("Infected: " + n.inf)
            console.log("Recovered: " + n.recovered)
            console.log("Total: " + n.total)
            console.log("----------------------------------------------------------")
            stopengine();
        }
    }
    
    let stopengine = function(){
        window.enginerunning = false;
            clearInterval(window.engine);
    }

    $('#run-button').click(keepmoving);
    $('#stop-button').click(stopengine);

});


