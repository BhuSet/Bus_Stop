const readline = require("readline-sync");
const fetch = require('node-fetch')

console.log("Enter the Stop Code :");
const Stop_id = readline.prompt();

function getNextfivebuses(json)
{
    json.sort(function(a, b)
    {
        return (a.timeToStation > b.timeToStation) - (a.timeToStation < b.timeToStation);
    });
    console.log("Bus Number\t\tTowards\t\t\t\t\t\tDestination\t\tArrvial in minutes")
    for(var i=0; i<5;i++)
        console.log(json[i].lineId+ "\t\t" +json[i].towards+ "\t" +json[i].destinationName+ "\t\t"+ Math.ceil(json[i].timeToStation/60));
}

fetch(`https://api.tfl.gov.uk/StopPoint/${Stop_id}/Arrivals`)
    .then(response => response.json())
    .then(getNextfivebuses);