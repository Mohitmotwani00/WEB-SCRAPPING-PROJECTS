let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
// series id=19322,
let count = 0;
let seriesId = process.argv[2];
let url = `https://www.espncricinfo.com/scores/series/${seriesId}/india-in-new-zealand-2019-20?view=results`;
// npm install request 
console.log("sending Request");
request(url, function (err, response, data) {
    console.log("Data Recieved");
    // console.log(response);
    if (err === null && response.statusCode === 200) {
        fs.writeFileSync("series.html", data);
        parseHTML(data);
        console.log("Processing Data");
    } else if (response.statusCode === 404) {
        console.log("Page Not found");
    } else {
        console.log(err);
        console.log(response.statusCode)
    }
})

function parseHTML(data) {
    // page => cheerio
    // load => html 
    let $ = cheerio.load(data);
    // Page=> selector pass  => text => text
    console.log("########################");
    let AllCards = $(".match-score-block");
    // console.log(AllCards.length);
    for (let i = 0; i < AllCards.length; i++) {
        let matchType = $(AllCards[i]).find("p.small.match-description").text();
        let test = matchType.includes("ODI") || matchType.includes("T20I");
        if(test==true){
            // console.log(matchType);
            // [data-hover=`Scorecard`]
            let link = $(AllCards[i]).find(".match-cta-container a").attr("href");
            // console.log(link);
            let fLink = `https://www.espncricinfo.com/${link}`;
            count++;
            matchHandler(fLink);
            
        }
    }
    console.log("########################")
    // console.log(text);
}
function matchHandler(link){
    request(link, function (err, response, data) {
        // console.log(" Match Data Recieved");
        // console.log(response);
        if (err === null && response.statusCode === 200) {
            fs.writeFileSync(`match${count}series.html`, data);
            count--;
             handleEachMatch(data);
             if(count==0)
             {
                 console.table(leaderboard);
             }
        } else if (response.statusCode === 404) {
            console.log("Page Not found");
        } else {
            console.log(err);
            console.log(response.statusCode)
        }
    })
}
function handleEachMatch(data){
    let $ = cheerio.load(data);
    let format = $(`.match-page-wrapper .desc.text-truncate`).text();
    console.log(format);
    if(format.includes("ODI")){
        format = "ODI";
    }
    else{
        format = "T20I";
    }


    //3 table => india inning, nz inning, stats
    let inningsArr = $(`.match-scorecard-table`);
    let fti = inningsArr[0];
    let sti = inningsArr[1];
    //team name
    //1st innings
    let ftiName = $(fti).find(".header-title.label").text();
    console.log(ftiName.split("Innings")[0]);
    let fInnigPlayers = $(fti).find(".table.batsman tbody tr");
    console.log(ftiName);
    for(let i = 0; i < fInnigPlayers.length; i++)
    {
        let isBatsman = $(fInnigPlayers[i]).find("td").hasClass("batsman-cell");
        if(isBatsman == true){
            let pName = $($(fInnigPlayers[i]).find("td")[0]).text();
            let runs = $($(fInnigPlayers[i]).find("td")[2]).text();
            // console.log(pName + "  "+runs);
            createLeaderBoard(pName, format, runs, ftiName);
        }
    }
    console.log("----------------------------");
    let stiName = $(sti).find(".header-title.label").text();
    let sInnigPlayers = $(sti).find(".table.batsman tbody tr");
    console.log(stiName);
    console.log(stiName.split("Innings")[0]);
    for(let i = 0; i < sInnigPlayers.length; i++)
    {
        let isBatsman = $(sInnigPlayers[i]).find("td").hasClass("batsman-cell");
        if(isBatsman == true){
            let pName = $($(sInnigPlayers[i]).find("td")[0]).text();
            let runs = $($(sInnigPlayers[i]).find("td")[2]).text();
            // console.log(pName + "  "+runs);
            createLeaderBoard(pName, format, runs, stiName);
        }
    }

}
//objexr name, run , teams , format
let leaderboard = [];
function createLeaderBoard(name, format, runs, team){
//Creating a leadorBoard

//Existing Player
//checkk if exits, player exists - update
//create new entry 
for(let i = 0; i < leaderboard.length; i++)
{
    let player = leaderboard[i];
    if(player.Name == name && player.Team == team && player.Format == format){
        player.Runs+= parseInt(runs);
    
    return;
    }
}

let pObj = {
    Name : name,
    Format : format,
    Runs : parseInt(runs),
    Team : team
}
//push to leaderBoard
leaderboard.push(pObj);
}