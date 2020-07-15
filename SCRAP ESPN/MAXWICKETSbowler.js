let request =require("request");
let cheerio =require("cheerio");
let fs= require("fs");

// series id=19322,1187684
seriesId=process.argv[2];
commentaryId=process.argv[3];

let url=`https://www.espncricinfo.com/series/${seriesId}/scorecard/${commentaryId}/new-zealand-vs-india-3rd-odi-india-in-new-zealand-2019-20`

console.log("Sending request");
request(url,function(err,response,data){
    console.log("process statrted");
    if(err===null && response.statusCode===200){
        console.log("data recived");
        fs.writeFileSync("index.txt",data);
        // DATA KO PRSE KRNEGE CHEERIO SE
        Parsedata(data);
    }else if(response.statusCode===404){
        console.log("page not found")
    }else{
        console.log(err);
        console.log(response.statusCode);
    }

})
console.log("we can do other things till then");

// DATA KO LOAD KRKE DISPLAY MEI HELP KREGHA
function  Parsedata(data){
    // PAGE==>CHEERIO
        let $ = cheerio.load(data);
    // SELECTOR SE SELECT THING ==> .TEXT()==> gIVE CONCATENATED STRING OF SELECTED TAG
        // let text=$("title").text();
    // GIVE THE ARRAY OF WHOLE LASS MATCHES    
            
           let bowlersArr=$(".table.bowler tbody tr ");
           fs.writeFileSync("bowler.html",bowlersArr)
            var Maxname="";
            var Maxwickets=0;
           for(var i=0;i<bowlersArr.length;i++){

            let name=$($(bowlersArr[i]).find("td")[0]).text();
            let Wickets=$($(bowlersArr[i]).find("td")[4]).text();
            if(Wickets>Maxwickets){
                Maxwickets=Wickets;
                Maxname=name;
            }
            console.log(name + "-> " + Wickets);
            console.log("BAMASH ->" +Maxname +"="+ Maxwickets );
           }
        
    }