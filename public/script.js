const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signupBtn = document.querySelector("#signup"),
  loginBtn = document.querySelector("#login"),
  pwShowHide = document.querySelectorAll(".pw_hide");
  const daysTag = document.querySelector(".days"),
  currentDate = document.querySelector(".current-date"),
  prevNextIcon = document.querySelectorAll(".icons span");

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));


// calender event functions
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
      // var data=xhr.responseText;
      // Use the response data here
      // console.log(data);
      callback(data);
    } else {
      // Handle errors here
      console.error(xhr.statusText);
    }
  };

  // Send the request
  xhr.send();
}

// function getDetails(listofEvents){
//   for(let i=0;i)
// }

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

function renderFrontEnd(listofEvents){
  // getting new date, current year and month
  let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();

  // storing full name of all months in array
  const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

  function showPopUp(day,eventDetails) {  
      const popUp = document.createElement("div");
      popUp.classList.add("pop-up");
      for(let i=0;i<eventDetails.length;i++){
        console.log(eventDetails[i].imageUrl);
        popUp.innerHTML = `<div>
                            <h2>${months[currMonth]} ${day}, ${currYear}</h2>
                          <p>${eventDetails[i].name}</p>
                          <img src=${eventDetails[i].imageUrl}>
                          <p>${eventDetails[i].masters}</p>
                          <button class="close-btn">Close</button>
                              <div/>`;
        // Close the pop-up window when the close button is clicked
        popUp.querySelector(".close-btn").addEventListener("click", () => {
            popUp.remove();
        });
      }
      document.body.appendChild(popUp);
  }

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
          console.log(listofEvents[i-1]);
          var isToday;
          if(listofEvents[i-1].date!='null'){
            isToday="active";
          }else{
            isToday="";
          }
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
              if(listofEvents[day-1]["date"]!='null'){
                // console.log(listofEvents[day-1]["date"]);
                showPopUp(day,JSON.parse(listofEvents[day-1]["events"]));  
              }
                
          });
          i++;
        
      }); 
  }
  renderCalendar();

  prevNextIcon.forEach(icon => {
      // getting prev and next icons
      icon.addEventListener("click", () => { // adding click event on both icons
          // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
          currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

          if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
              // creating a new date of current year & month and pass it as date value
              date = new Date(currYear, currMonth, new Date().getDate());
              currYear = date.getFullYear(); // updating current year with new date year
              currMonth = date.getMonth(); // updating current month with new date month
          } else {
              date = new Date(); // pass the current date as date value
          }
          renderCalendar(); // calling renderCalendar function
      });
  });
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
