var elem = document.getElementsByTagName("input")[0].addEventListener("click", clickUpdateGauge)
import {MultiDial} from '../dist/multiDial-0.0.3.js'

let testGauge = new MultiDial({
    container: 'boatSpeed_gauge',
    numberDials: 3,
    radius: 25,
    individualDialOpts: [
        {
            orientation: 180,
            stroke: 5,
            color: 'rgba(255,0,0,0.2)',
            arc: 330,
            maxValue: 100,
            colorSchedule: function(value){
                switch(true){
                  case value < 25:
                    return 'rgba(255,0,0,0.25)';
                  case value >= 25 && value < 50:
                    return 'rgba(255,0,0,0.5)';
                  case value >= 50 && value < 75:
                    return 'rgba(255,0,0,0.75)';
                  case value >= 75:
                      return 'rgba(255,0,0,1)';
                }
            }
        },
        {
            orientation: 180,
            stroke: 4,
            color: 'blue',
            arc: 330,
            lineCap: 'qweqwe'
        },
        {
            orientation: 180,
            stroke: 3,
            color: 'green',
            arc: 320
        }
    ]
});

function clickUpdateGauge(){
    console.log('click')
    Math.floor(Math.random() * 100); 
    testGauge.setDialValue(Math.floor(Math.random() * 100), 0, true, 1);
    testGauge.setDialValue(Math.floor(Math.random() * 100), 1, true, 1);
    testGauge.setDialValue(Math.floor(Math.random() * 100), 2, true, 1);
   // testGauge.setDialValue(Math.floor(Math.random() * 100), 3, true, 1);
}


