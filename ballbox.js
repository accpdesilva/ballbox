
$(function(){
    window.enginerunning = false;

    //how much should they move
    window.ox = 20;
    window.oy = 20;

    //speed (lower the faster)
    window.speed = 50;

    //number of balls
    window.balls = 200;

    //Time to recovery
    window.timetorecovery = 3 * 1000 //miliseconds

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

    window.shift = function(ball, dx, dy){
        let x = Math.round(getx(ball) + dx);
        let y = Math.round(gety(ball) + dy);
        x = (x>740)?740-(x-740):x;
        y = (y>740)?740-(y-740):y;
        //ball.css("top", x+"px");
        //ball.css("left", y+"px");
        ball.offset({top: x, left: y});
    }

    let engine = function(ball){
        dox = Math.random() * window.ox;
        doy = Math.random() * window.oy;
        ball.get(0).engine = window.setInterval(function(){

            if(ball.attr('reversex')=="false")
            {
                if(getx(ball)>(740-dox))
                {
                    ball.attr('reversex', true)
                }
            } else {
                if(getx(ball)<35)
                {
                    ball.attr('reversex', false)
                }
            }

            if(ball.attr('reversey')=="false")
            {
                if(gety(ball)>740-doy)
                {
                    ball.attr('reversey', true);
                }
            } else {
                if(gety(ball)<35)
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

            shift(ball, dx, dy);
        }, window.speed)
    }

    let keepmoving = function(){
        if(!enginerunning){
            window.enginerunning = true;
            window.startTime = new Date();
            $(".ball").each(function(i,e){
                engine($(e));
            })
            window.conflictchecker = window.setInterval(function(){
                checkconflict();
            }, window.speed)
        }
        else{
            alert("The engine is already running!")
        }
    }

    let infect = function(ball){
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
            let x = getx($(e))+10;
            let y = gety($(e))+10;
            $(".ball[infected='false']").each(function(q,r){
                let dx = x - (getx($(r))+10);
                let dy = y - (gety($(r))+10);
                //console.log("dx = " + dx);
                //console.log("dy = " + dy);
                if(dx > -20 && dx < 20 && dy > -20 && dy < 20)
                {
                    infect($(r));
                }
            });
        })

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
        $(".ball").each(function(i,e){
            clearInterval(e.engine);
            clearInterval(window.conflictchecker);
        })
    }

    $('#run-button').click(keepmoving);
    $('#stop-button').click(stopengine);

});


