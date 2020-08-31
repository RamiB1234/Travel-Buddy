// API keys:
let geoNamesUsername= 'ramib1234';
let weatherbitKey= '';
let pixbayKey= '';

// API URLs:
let geoNamesURL= 'http://api.geonames.org/postalCodeSearchJSON?&maxRows=10&username='+geoNamesUsername;
let weatherbitCurrentURL = 'http://api.weatherbit.io/v2.0/current?'
let weatherbitForcastURL = ' http://api.weatherbit.io/v2.0/forecast/daily?'
let pixbayURL= 'https://pixabay.com/api/?';
    
let errorOccurred = false;

let travelData={};

function resetTravelData(){
  return {
    lat:'',lng:'', city:'', countryCode:'', travelDate: '', currentTemp:0, maxTemp: 0, minTemp: 0, weatherDescription: '', imageURL:''
  }
}
    

function handleSubmit() {
  document.getElementById('travel-section').style.visibility = "hidden"; 
  document.getElementById('loading').style.visibility = "hidden"; 
  document.getElementById('error').style.visibility = "hidden"; 
    travelData = resetTravelData();

    // check what text was put into the form field
    let enteredDate = document.getElementById('travel-date').value
    let placeName = document.getElementById('distination').value

    if(enteredDate== ''){
      alert('Please enter the travel date');
      return;
    }
    if(placeName== ''){
      alert('Please enter your destination');
      return;
    }

    if(Client.checkDate(enteredDate)===true){
      travelData.travelDate= enteredDate;

      getGeoData(placeName).then(function(data){
        if(errorOccurred===true){
          return;
        }
        getapikeys('https://travel-buddy-heroku.herokuapp.com//getapikeys').then(function(data){
        //getapikeys('http://localhost:8081/getapikeys').then(function(data){
          if(errorOccurred===true){
            return;
          }
          weatherbitKey = data.weatherKey;
          pixbayKey = data.pixbayKey;

          // Call either the current weather URL or future weather forcast URL based on the entered data:
          let url = checkIfCurrentWeek(enteredDate) === true ? weatherbitCurrentURL : weatherbitForcastURL;
          getwheatherData(url,checkIfCurrentWeek(enteredDate)).then(function(){
            if(errorOccurred===true){
              return;
            }
            getImage(placeName).then(function(){
              
              // Update DOM:
              document.getElementById('city').innerText = travelData.city;
              document.getElementById('country-code').innerText = travelData.countryCode;
              document.getElementById('travel-date-lbl').innerText = travelData.travelDate;
              document.getElementById('days').innerText = calulcateDays(travelData.travelDate);
              if(travelData.imageURL!=''){
                document.getElementById('place-image').src = travelData.imageURL; 
              }
              else{
                document.getElementById('place-image').src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png'; 
              }

              // Within a week
              if(travelData.currentTemp !=0){
                document.getElementById('weather-info').innerText = `Current temp: ${travelData.currentTemp}\n${travelData.weatherDescription}`;
              }
              // Within 16 days
              else if(travelData.minTemp !=0){
                document.getElementById('weather-info').innerText = `Min temp: ${travelData.minTemp} Max temp: ${travelData.maxTemp}\n${travelData.weatherDescription}`;
              }
              else
              // After 16 days (no info)
              {
                document.getElementById('weather-info').innerText = 'No weather info is avilable';
              }
            });
          })
        });
      })
    }
    else{
        alert("Please enter a date in the future");
        document.getElementById('travel-date').value="";
    }
}

function calulcateDays(date){
  /*
    This function returns number of days (rounded) between the future date and today's data
  */
  let now = new Date();
  let difference = Date.parse(date)-now;
  return Math.round(difference/(1000*3600*24));
}

async function getapikeys(url){

  const res = await fetch(url, {
      method : "GET",
      credentials : "same-origin",
  });
  try {
    const data = await res.json();
    errorOccurred=false;
    return data;
  }  catch(error) {
    console.log(res);
    console.log("error", error);
    errorOccurred=true;
  }
}


async function getGeoData(placename){
  document.getElementById('loading').style.visibility = "visible"; 
  const res = await fetch(geoNamesURL+'&placename='+placename)
  try {
    const data = await res.json();

    travelData.lat= data.postalCodes[0].lat;
    travelData.lng= data.postalCodes[0].lng;
    travelData.countryCode= data.postalCodes[0].countryCode;
    
    document.getElementById('loading').style.visibility = "hidden"; 
    document.getElementById('error').style.visibility = "hidden"; 
    errorOccurred = false;
    return data;
  }  catch(error) {
    console.log("error", error);
    document.getElementById('loading').style.visibility = "hidden"; 
    document.getElementById('error').style.visibility = "visible"; 
    errorOccurred = true;
  }
}

async function getwheatherData(url, currentWeek){
  /*
    - if travel date is within a week, fetch current weather using current weather API
    - if travel date is after a week, but less than 16 days, show that specifc day weather using forcast weather API
    - If travel date is after 16 days, no weather data to be fetched

  */
  document.getElementById('loading').style.visibility = "visible"; 

  const res = await fetch(url+'&key='+weatherbitKey+'&lat='+travelData.lat+'&lon='+travelData.lng)
  try {
    const data = await res.json();
    document.getElementById('loading').style.visibility = "hidden"; 
    if(currentWeek){

      // fetch crrent wheather data:
      travelData.city = data.data[0].city_name;
      travelData.currentTemp = data.data[0].temp;
      travelData.weatherDescription = data.data[0].weather.description;
    }
    else{
      for(let i=0; i< data.data.length; i++){
       
        // if it's not after and not before, it's the same day.. 
        // I used this trick because I couldnt compare dates with === :)
        if(new Date(data.data[i].datetime).getDate() > new Date(travelData.travelDate).getDate()=== false &&
        new Date(data.data[i].datetime).getDate() < new Date(travelData.travelDate).getDate()=== false && 
        new Date(data.data[i].datetime).getMonth() > new Date(travelData.travelDate).getMonth()=== false &&
        new Date(data.data[i].datetime).getMonth() < new Date(travelData.travelDate).getMonth()=== false &&
        new Date(data.data[i].datetime).getFullYear() > new Date(travelData.travelDate).getFullYear()=== false &&
        new Date(data.data[i].datetime).getFullYear() < new Date(travelData.travelDate).getFullYear()=== false){
          
          travelData.maxTemp = data.data[i].max_temp;
          travelData.minTemp = data.data[i].min_temp;
          travelData.weatherDescription = data.data[i].weather.description;
          break;
        }
      }
      travelData.city = data.city_name;
      document.getElementById('error').style.visibility = "hidden"; 

    }
    errorOccurred = false;
  }  catch(error) {
    console.log("error", error);
    document.getElementById('loading').style.visibility = "hidden"; 
    document.getElementById('error').style.visibility = "visible"; 
    errorOccurred = true;
  }
}

async function getImage(enteredPlace){
  document.getElementById('loading').style.visibility = "visible"; 

  // Replace spaces with '+'
  let searchTerms = enteredPlace.replace(/ /g, "+");

  const res = await fetch(pixbayURL+'&key='+pixbayKey+'&q='+searchTerms+'&image_type=photo')
  try {
    const data = await res.json();
    
    travelData.imageURL= data.hits[0].userImageURL;

    document.getElementById('loading').style.visibility = "hidden"; 
    document.getElementById('error').style.visibility = "hidden"; 
    document.getElementById('travel-section').style.visibility = "visible"; 
    return data;
  }  catch(error) {
    console.log("error", error);
    document.getElementById('loading').style.visibility = "hidden"; 
    document.getElementById('error').style.visibility = "visible"; 
    document.getElementById('travel-section').style.visibility = "hidden"; 
  }
}

function checkIfCurrentWeek(enteredDate){
  /*
    This function checks if the entered week is within a week or not,
    if yes, returns true, otherwise it returns false
  */
  let withinWeek = new Date();
  withinWeek.setDate(withinWeek.getDate() + 7);
  if(Date.parse(enteredDate) < withinWeek){
    return true;
  }
  else{
    return false;
  }
}

function removeTravelInfo(){
  event.preventDefault();

  document.getElementById('travel-date').value="";
  document.getElementById('distination').value="";
  travelData = resetTravelData();
  document.getElementById('travel-section').style.visibility = "hidden"; 

}

export { handleSubmit, getapikeys, removeTravelInfo }
