import { checkDate } from './js/dateChecker'
import { handleSubmit, removeTravelInfo } from './js/app'

import './styles/resets.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'
import './styles/travel-info.scss'

let form = document.getElementById('my-form');
form.addEventListener('submit', function(event){

    event.preventDefault()
    handleSubmit();
});

let removeBtn = document.getElementById('remove-btn');
removeBtn.addEventListener('click', function(event){

    event.preventDefault()
    removeTravelInfo();
});

export {
    checkDate,
    handleSubmit,
    removeTravelInfo
   }
