require("mysql");

const db = require("../routes/db_connection");

exports.getEvents=(date)=>{
    // let date='2023-04-28';
    console.log('the date was'+date);
    let sqlquery=`SELECT * FROM quiz_calender WHERE date = ?`;
    db.query(sqlquery,[date],(err,results)=>{
        if(err){
            console.log(err);
            console.log(results);
        }else {
            console.log(results);
            let events=JSON.parse(results[0].events);
            for(let i=0;i<events.length;i++){
                let eventQuery=`SELECT * FROM events WHERE id = ?`;
                db.query(eventQuery,[events[i]],(err,results)=>{
                    if(err){
                        console.log('event error'+results);
                    }else{
                        console.log(results);

                    }
                })
            }
            
        }
        // res.status(200).redirect("/");
    })

}