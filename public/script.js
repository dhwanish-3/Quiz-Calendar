
const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signupBtn = document.querySelector("#signup"),
  loginBtn = document.querySelector("#login"),
  pwShowHide = document.querySelectorAll(".pw_hide");
  const daysTag = document.querySelector(".days"),
   daysTag2 = document.querySelector(".days2"),
  currentDate = document.querySelector(".current-date"),
  currentDate2 = document.querySelector(".current-date2"),
  prevNextIcon = document.querySelectorAll(".icons span");

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));


//calender event functions
function getCalenderDates(callback){
  // Create a new XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Set up the request
  xhr.open('GET', 'http://localhost/events/',true);
  // Set up the callback function
  xhr.onload = function() {
    // Check if the request was successful
    if (xhr.status === 200) {
      // Parse the response as JSON
      var data = JSON.parse(xhr.responseText);
      callback(data);
    } else {
      // Handle errors here
      console.error(xhr.statusText);
    }
  };
  // Send the request
  xhr.send();
}

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});

function checkPasswords() {
  var password1 = document.getElementById("password1").value;
  var password2 = document.getElementById("password2").value;
  if (password1 != password2) {
    alert("Passwords do not match!");
    return false;
  }
  return true;
}

// rendering calender
function renderFrontEnd(listofEvents){
  // getting new date, current year and month
  let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();

  // storing full name of all months in array
  const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

  // getting color to show 
  function getColor(date){
    let eventTypes=date.event_types;
    console.log(date.event_types);
    if(eventTypes.includes("open") && eventTypes.includes("school") && eventTypes.includes("college")){
      return "active4";
    }else if(eventTypes.includes("open") && eventTypes.includes("school")){
      return "active5";
    }else if(eventTypes.includes("open") && eventTypes.includes("college")){
      return "active6";
    }else if(eventTypes.includes("school") && eventTypes.includes("college")){
      return "active7";
    }else if(eventTypes.includes("open")){
      return "active";
    }else if(eventTypes.includes("school")){
      return "active2";
    }else if(eventTypes.includes("college")){
      return "active3";
    }    
  }
  function PopupString(day,eventDetails){
    var popup=`<div class="backdrop"></div><div id="popContainer">
    <div class="in_a_row">
    <h3 class="flex h3">${months[currMonth]} ${day}, ${currYear}</h3>
    <div class="flex close-btn">&times;</div>
    </div>`;
    let i=0;
    while(i<eventDetails.length){
      let loop=`<br><img src=${eventDetails[i].imageUrl}>
      <p>Name:${eventDetails[i].name}</p>      
      <p>Venue:${eventDetails[i].venue}</p>
      <p>Quiz Masters:${eventDetails[i].masters}</p>
      <br><hr>`;
      popup=popup.concat(loop);
      i++;
    }
    popup=popup.concat(`</div`);
    return popup;
  }
  function showPopUp(day,eventDetails) {
      const popUp = document.createElement("div");
      popUp.classList.add("pop-up");
      console.log(eventDetails[0].imageUrl);
      popUp.innerHTML = PopupString(day,eventDetails);
      // Close the pop-up window when the close button is clicked
      popUp.querySelector(".close-btn").addEventListener("click", () => {
          popUp.remove();
          document.removeEventListener("click", outsideClickHandler);
          nonPopupElements.forEach((element) => {
            element.classList.remove("blur-effect");
          });
      });
      const outsideClickHandler = (event) => {
        if (!popUp.contains(event.target)&& event.target !== popUp) {
          popUp.remove();
          nonPopupElements.forEach((element) => {
            element.classList.remove("blur-effect");
          });
          document.removeEventListener("click", outsideClickHandler);
          
        }
      };
      setTimeout(() => {
        document.addEventListener("click", outsideClickHandler);
      }, 100);
      //dimming
      const nonPopupElements = document.querySelectorAll("body > *:not(.pop-up)");
      nonPopupElements.forEach((element) => {
        element.classList.add("blur-effect");
      });
      document.body.appendChild(popUp);                  
  }
  let index=0;
  let fakeIndex=0;
  const renderCalendar = () => {
      let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
      lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
      lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
      lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
      let liTag = "";

      for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
          liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
      }
      for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
          // adding active class to li if the current day, month, and year matched
          let dayToday=`${currYear}-${currMonth}-${i}`;
          console.log(listofEvents[0][i-1]["date"]);
          var isToday=listofEvents[0][i-1]["date"]=="null"?"":getColor(JSON.parse(listofEvents[0][i-1]["date"]));
          index=i;
          fakeIndex=i;
          // let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
          //             && currYear === new Date().getFullYear() ? "active" : "";          
          liTag += `<li class="${isToday}">${i}</li>`;
      }
      for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
          liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
      }
      currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
      daysTag.innerHTML = liTag;
      const dayElements = daysTag.querySelectorAll('li');
      let i=1;
      dayElements.forEach(dayElement => {
          dayElement.addEventListener('click', () => {              
              const day = dayElement.innerText;
              if(listofEvents[0][day-1]["date"]!='null'){
                // console.log(listofEvents[day-1]["date"]);
                showPopUp(day,JSON.parse(listofEvents[0][day-1]["events"]));
              }                
          });
          i++;        
      }); 
  }
  renderCalendar();
//   currMonth++;
//   const rendernextCalendar = () => {
//      firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
//     lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
//     lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
//     lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
//     let liTag = "";

//     for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
//         liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
//     }
//     for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
//         // adding active class to li if the current day, month, and year matched
//         let dayToday=`${currYear}-${currMonth}-${i}`;
//         console.log(listofEvents[1][i-1]["date"]);
//         var isToday=listofEvents[1][i-1]["date"]=="null"?"":getColor(JSON.parse(listofEvents[1][i-1]["date"]));
//         // let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
//         //             && currYear === new Date().getFullYear() ? "active" : "";          
//         liTag += `<li class="${isToday}">${i}</li>`;
//         index++;
//     }
//     for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
//         liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
//     }
//     currentDate2.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
//     daysTag2.innerHTML = liTag;
//     const dayElements = daysTag2.querySelectorAll('li');
//     dayElements.forEach(dayElement => {
//         dayElement.addEventListener('click', () => {              
//             const day = dayElement.innerText;
//             console.log(day);
//             if(listofEvents[1][day-1]["date"]!='null'){
//               // console.log(listofEvents[day-1]["date"]);
//               showPopUp(day,JSON.parse(listofEvents[1][day-1]["events"]));
//             }                
//         });     
//     }); 
// }
//   rendernextCalendar();
  // prevNextIcon.forEach(icon => {
  //     // getting prev and next icons
  //     icon.addEventListener("click", () => { // adding click event on both icons
  //         // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
  //         currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

  //         if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
  //             // creating a new date of current year & month and pass it as date value
  //             date = new Date(currYear, currMonth, new Date().getDate());
  //             currYear = date.getFullYear(); // updating current year with new date year
  //             currMonth = date.getMonth(); // updating current month with new date month
  //         } else {
  //             date = new Date(); // pass the current date as date value
  //         }
  //         renderCalendar(); // calling renderCalendar function
  //     });
  // });
}
getCalenderDates(renderFrontEnd);

// to upload events
// const formElem = document.querySelector('form');
// formElem.addEventListener('submit', async (e) => {
//     console.log("form submitted")
//   e.preventDefault();
//   await fetch('/upload', {
//     method: 'POST',
//     body: new FormData(formElem),
//   });
// });
