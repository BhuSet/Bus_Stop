const readline = require("readline-sync");
const fetch = require('node-fetch');
const FIRST_N_BUSES =5;
const NUM_NEAREST_STOPPOINTS = 2;
const RADIUS = 500;

const getEachStopPointArrivals =(pointid) =>{
    fetch(`https://api.tfl.gov.uk/StopPoint/${pointid}/Arrivals`)
            .then(response => response.json())
            .then((json) => {
            if (json.length === 0)  
                throw `There are no Buses running in stopID ${pointid}`;
            else
                return json;
            })
            .then(getFirstNbuses)
            .catch((error) => console.log(error)); 
}

const getFirstNbuses= (json) => {
    //console.log(json);
    json.sort((a, b) => {return (a.timeToStation > b.timeToStation) - (a.timeToStation < b.timeToStation)});
    
    for(var i=0; i< FIRST_N_BUSES && i < json.length;i++)
        console.log(json[i].lineId+ "\t\t" +json[i].stationName+ "\t\t" +json[i].destinationName+ "\t\t"+ Math.ceil(json[i].timeToStation/60));
}


var stoppointids= [];

const getNearestStopPointId = (json) =>{
    
    for(var i = 0; i<json.stopPoints.length && stoppointids.length< NUM_NEAREST_STOPPOINTS /*&& json.stopPoints[i].lines.length !=0*/; i++)
        stoppointids.push(json.stopPoints[i].id);
    console.log(stoppointids);
}

const getBusesforEachStopPoint =(json) =>{
    console.log("Bus Number\tFrom\t\t\tDestination\tArrvial in minutes\n");
    stoppointids.forEach(getEachStopPointArrivals); 
}

const getAreaStopPoints = (json) => {
    fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${json.result.latitude}&lon=${json.result.longitude}&stopTypes=NaptanPublicBusCoachTram&radius=${RADIUS}`)
    .then(response => response.json())
    .then((json) => {
    if (json.stopPoints.length === 0)  
        throw `There are no Bus Stops in ${RADIUS}m`;
    else
        return json;
    })
    .then(getNearestStopPointId)
    .then(getBusesforEachStopPoint);
}

console.log("Enter the PostCode :");
const Post_code = readline.prompt();

fetch(`http://api.postcodes.io/postcodes/${Post_code}`)
.then(response => {
    if (response.status >= 200 && response.status <= 299) 
      return response.json();
    else 
      throw Error(response.status);
    
  })
.then(getAreaStopPoints)
.catch((Error) =>  {
                    (Error.message == "404") ? console.log("Invalid Postcode"):console.log("Network Error")
                    });