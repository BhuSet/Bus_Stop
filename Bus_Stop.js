const readline = require("readline-sync");
const fetch = require('node-fetch');
const FIRST_N_BUSES =5;
const NUM_NEAREST_STOPPOINTS = 2;
const RADIUS = 500;

/*const getEachStopPointArrivals = (pointid) => {
    fetch(`https://api.tfl.gov.uk/StopPoint/${pointid}/Arrivals`)
            .then(response => response.json())
            .then((json) => { 
            if (json.length === 0)  
                throw `There are no Buses running in stopID ${pointid}`;
            else
                return (getFirstNbuses(json));
            })
            .catch(console.log); 
}*/

const getFirstNbuses= (json) => {
    //console.log(json);
    json.sort((a, b) => {return (a.timeToStation > b.timeToStation) - (a.timeToStation < b.timeToStation)})
    .forEach(element => console.log(element.lineId+ "\t\t" +element.stationName+ "\t\t" +element.destinationName+ "\t\t"+ Math.ceil(element.timeToStation/60)));
}

const getBusesforEachStopPoint =(stopPoints) =>{
    console.log("Bus Number\tFrom\t\t\tDestination\tArrvial in minutes\n");
    stopPoints.forEach(stopPoint => getEachStopPointArrivals(stopPoint.id)); 
}

async function getEachStopPointArrivals(pointid)  {
    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${pointid}/Arrivals`);
    const arrivalInfo = await response.json();
    try{
        if (arrivalInfo.length === 0)  
            throw `There are no Buses running in stopID ${pointid}`;
        return (getFirstNbuses(arrivalInfo));
    }
    catch(e){console.log(e);}
}

const getAreaStopPoints = (latitude,longitude) => {
    fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&radius=${RADIUS}`)
    .then(response => response.json())
    .then((json) => {
    if (json.stopPoints.length === 0)  
        throw `There are no Bus Stops in ${RADIUS}m`;
    else
        return json.stopPoints.slice(0,NUM_NEAREST_STOPPOINTS);
    })
    .then(getBusesforEachStopPoint)
    .catch(console.log);
}

const getBusstopsTflApp = () => {
    console.log("Enter the PostCode :");
    const postcode = readline.prompt(); 

    fetch(`http://api.postcodes.io/postcodes/${postcode}`)
    .then(response => {
        if (response.status >= 200 && response.status <= 299) 
        return response.json();
        else 
        throw Error(response.status);
        
        })
    .then((json) => getAreaStopPoints(json.result.latitude,json.result.longitude))
    .catch((error) =>  {
            if (error.message == "404")
            {
                console.log("Invalid Postcode: Please enter a Valid Postcode");
                getBusstopsTflApp();

            }else
            console.log("Error")});
}

getBusstopsTflApp();