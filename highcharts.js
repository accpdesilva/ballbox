
$(function(){
    window.thechart = new Highcharts.chart('container', {
        chart: {
            type: 'area',
            events: {
                load: function () {
                    
                    // set up the updating of the chart each second
                    var infected = this.series[1];
                    var recovered = this.series[0];
                    window.countseries = 0;
                    setInterval(function () {
                        if(window.enginerunning){
                            window.countseries ++;
                            var x = countseries, // current time
                                y = Number($('#amt-infected').text());
                                z = Number($('#amt-recovered').text());
                            console.log(y);
                            infected.addPoint([x, y], true, false);
                            recovered.addPoint([x, z], true, false);
                        }
                    }, (window.speed<200)?window.speed * 2:window.speed);
                }
            }
        },
        title: {
            text: 'Chart'
        },
        xAxis: {
            allowDecimals: false,
            labels: {
                formatter: function () {
                    return this.value; // clean, unformatted number for year
                }
            }
        },
        yAxis: {
            title: {
                text: 'Total'
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            }
        },
        tooltip: {
            pointFormat: '{point.y}'
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                pointStart: 1,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Recovered',
            data: []
        },{
            name: 'Infected',
            data: []
        }],
        colors: ['lightgreen','red']
    });

});


