const readline = require("readline-sync");
const fetch = require('node-fetch')

/*console.log("Enter the Stop Code :");
const Stop_id = readline.prompt();

fetch(`https://api.tfl.gov.uk/StopPoint/${Stop_id}/Arrivals`)
    .then(response => response.json())
    .then(getNextfivebuses);
*/

function getNextfivebuses(json)
{
    //console.log(json);
    json.sort((a, b) => {return (a.timeToStation > b.timeToStation) - (a.timeToStation < b.timeToStation)});
    
    for(var i=0; i<5 && i < json.length;i++)
        console.log(json[i].lineId+ "\t\t" +json[i].stationName+ "\t\t" +json[i].destinationName+ "\t\t"+ Math.ceil(json[i].timeToStation/60));
}


var stoppointids= [];

function getNearestStopPointId(json)
{
    
    for(var i = 0; i<json.stopPoints.length && stoppointids.length<2 && json.stopPoints[i].lines.length !=0; i++)
        stoppointids.push(json.stopPoints[i].id);
    console.log(stoppointids);
    console.log("Bus Number\tFrom\t\t\tDestination\tArrvial in minutes\n");
    stoppointids.forEach(stoppointid =>
            fetch(`https://api.tfl.gov.uk/StopPoint/${stoppointid}/Arrivals`)
            .then(response => response.json())
            .then(getNextfivebuses)); 
}

function getAreaStopPoints(json)
{
    fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${json.result.latitude}&lon=${json.result.longitude}&stopTypes=NaptanPublicBusCoachTram`)
    .then(response => response.json())
    .then(getNearestStopPointId);
}

console.log("Enter the PostCode :");
const Post_code = readline.prompt();

fetch(`http://api.postcodes.io/postcodes/${Post_code}`)
.then(response => response.json())
.then(getAreaStopPoints);