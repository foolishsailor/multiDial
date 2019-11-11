import { multiDial } from "../src/index.js";

var elem = document.getElementsByTagName("input")[0].addEventListener("click", clickUpdateGauge)

let testGauge = new multiDial({
    container: 'boatSpeed_gauge',
    numberDials: 3,
    individualDialOpts: [
        {
            orientation: 180,
            stroke: 5,
            color: 'red',
            arc: 330
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


