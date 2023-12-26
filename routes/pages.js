const express = require("express");
const router = express.Router();
// for calender
require("mysql");
let listOfEvents = [];
const db = require("../routes/db_connection");
let date = new Date();
let i = date.getDate();
i = i - 3;
let currMonth = date.getMonth();
currMonth++;
let currYear = date.getFullYear();

async function getEvents(date) {
  // let date='2023-04-28';
  console.log("the date was" + date);
  let sqlquery = `SELECT * FROM quiz_calender WHERE date = ?`;

  db.query(sqlquery, [date], (err, results) => {
    if (err) {
      console.log(err);
      // return null;
    } else if (results.length == 0) {
      console.log("no events today bro");
      // return null;
    } else {
      if (results != null) {
        let events = JSON.parse(results[0].events);

        console.log(events);
        for (let i = 0; i < events.length; i++) {
          let eventQuery = `SELECT * FROM events WHERE id = ?`;
          db.query(eventQuery, [events[i]], (err, results) => {
            if (err) {
              console.log("events error");
            } else if (results.length != 0) {
              console.log("these are events");
              // console.log(results[0]);
              listOfEvents.push(results[0]);
              console.log(listOfEvents);
            }
          }); // listOfEvents.push('this is event results');
        }
      }
    }
  });
}
router.get("/", async (req, res) => {
  // for(let loops=0;loops<5;loops++){
  //     let date=`${currYear}-${currMonth}-${i}`;
  //     await getEvents(date);
  //     if(i==31){
  //         i=1;
  //         currMonth++;
  //     }else i++;
  // }
  res.render("index");
});

// exports.method = router;
// exports.otherMethod = listOfEvents;

module.exports = { router, listOfEvents };
