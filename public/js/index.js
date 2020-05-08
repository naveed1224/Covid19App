import googleSearchApi from '/js/models/googleMapsInit.js'
// start loaderloader
//fetch all the results posts of results from the database as lat and lang
//load google maps & all autocompletes
const mapsInit = new googleSearchApi();
mapsInit.initAutocomplete()
//document.getElementById('spinner__main__parent').remove()
//clear loader

const lat = document.getElementById('lat__case_submit');
const lng = document.getElementById('lng__case_submit');
const userEmail = document.getElementById('email__case');
const caseDescription = document.getElementById('case__description');
const address = document.getElementById("autocomplete");

const elements = {};



const submitCase = () => {
    let response_code;

    //get all elements from form
    console.log(lat.value);
    console.log(lng.value);
    console.log(userEmail.value);
    console.log(caseDescription.value);
    //front end validation of the form

    //if validation successful

    //send API fetch to save results
    response_code = fetch('http://localhost:3000/case/case-create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lat: lat.value,
                lng: lng.value,
                userEmail: userEmail.value,
                caseDescription: caseDescription.value
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log("returned Message: " + data.message)
            console.log("returned Message: " + data.case)

            //close modal
            UIkit.modal("#modal-group-1").hide();

            //clear results in form
            lat.value = "";
            lng.value = "";
            userEmail.value = "";
            caseDescription.value = "";
            address.value = "";

            //if no email provided give modal confirmation with code to delete
            UIkit.modal.confirm(JSON.stringify(data.case.uuid));

            return JSON.stringify(data.message);
        })
        .catch(err => {
            console.log(err)
        })
}

document.querySelector('#case__submit__button').addEventListener('click', e => {
    e.preventDefault;
    submitCase();
})