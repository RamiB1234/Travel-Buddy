function checkDate(enteredDate) {

  let now = new Date();
  if(Date.parse(enteredDate)<now){
    return false;
  }
  else{
    return true;
  }
}

export { checkDate }
