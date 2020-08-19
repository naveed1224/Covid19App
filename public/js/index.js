//signup DOMS
const userSignupEmail = document.getElementById('email__signup__address');
const userSignupPhone = document.getElementById('phone__signup__address');
const userSignupNeighborhood = document.getElementById('neibhorhood__signup__address');
const userSignupCity = document.getElementById('city__signup__address');
const userSignupButton = document.getElementById('email__signup__send');
//case Submission DOMS
const lat = document.getElementById('lat__case_submit');
const lng = document.getElementById('lng__case_submit');
const userEmail = document.getElementById('email__case');
const case_neighborhood = document.getElementById('neigbborhood__case__name');
const case_city = document.getElementById('city__case__name');
const case_province = document.getElementById('province__case__name');
const case_country = document.getElementById('country__case__name');
const address = document.getElementById("autocomplete");
const caseSubmitButton = document.querySelector('#case__submit__button')
//Email Inform DOM
const emailInform = document.getElementById('email__inform__address');
const emailInformBody = document.getElementById('email__inform__body');
const emailInformSendButton = document.getElementById('email__inform__send');

const elements = {};
const base_url = '' //'http://localhost:3000'


const notifyUser = () => {
    let response_code;
    if (emailInform.value) {
        response_code = fetch(`${base_url}/email/anonymousEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailInform: emailInform.value,
                    emailInformBody: emailInformBody.value
                })
            })
            .then(response => {
                return response.json()
            })
            .then(data => {
                if (data.status === 'duplicate') {
                    UIkit.modal("#modal-group-2").hide();
                    emailInform.value = '';
                    emailInformBody.value = '';
                    UIkit.notification({
                        message: `<span uk-icon=\'icon: close\'></span> ${data.data.email} has already been informed.`,
                        status: 'danger'
                    });
                } else {
                    UIkit.modal("#modal-group-2").hide();
                    emailInform.value = '';
                    emailInformBody.value = '';
                    UIkit.notification({
                        message: '<span uk-icon=\'icon: check\'></span> Anonymous Email Sent!',
                        status: 'success'
                    });
                }
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        UIkit.notification({
            message: '<span uk-icon=\'icon: close\'></span> Please enter email.',
            status: 'danger'
        });
    }
}



const submitCase = () => {
    let response_code;
    let userEmailCheck = false;

    if (userEmail.value !== '') {
        userEmailCheck = true;
    }

    //get all elements from form

    //front end validation of the form

    //if validation successful


    //send API fetch to save results
    response_code = fetch(`${base_url}/case/case-create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lat: 'testingjsdfjsdkljksldj'
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            //close modal
            UIkit.modal("#modal-group-1").hide();

            //clear results in form
            lat.value = "";
            lng.value = "";
            userEmail.value = "";
            case_city.value = "";
            case_neighborhood.value = "";
            case_country.value = "";
            address.value = "";

            //if no email provided give modal confirmation with code to delete
            if (userEmailCheck === false) {
                UIkit.modal.confirm(`Successfully Submitted your case, Case Delete #ID: ${data.case.uuid}`);
            } else {
                UIkit.notification({
                    message: '<span uk-icon=\'icon: check\'></span> Case Successfully Submit. Email outbound Successful!',
                    status: 'success'
                });

            }

            return JSON.stringify(data.message);
        })
        .catch(err => {
            console.log(err)
        })
}

const UserSignUp = () => {
    let response_code;
    let userEmailCheck = false;
    let userPhoneCheck = false;

    if (userSignupEmail.value) {
        userEmailCheck = true;
    }
    if (userSignupPhone.value) {
        userPhoneCheck = true;
    }

    if (userEmailCheck === true && userPhoneCheck === true) {
        response_code = fetch(`${base_url}/notifications/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userSignupEmail: userSignupEmail.value,
                    userSignuPhone: userSignupPhone.value,
                    SignupNeighborhood: userSignupNeighborhood.value,
                    city: userSignupCity.value
                })
            })
            .then(response => {
                return response.json();
            })
            .then(data => {


                if (data.duplicate === true) {
                    UIkit.notification({
                        message: '<span uk-icon=\'icon: close\'></span>Phone is already Registered.',
                        status: 'danger'
                    });
                } else {

                    //close modal
                    UIkit.modal("#modal-group-3").hide();

                    //clear results in form
                    userSignupEmail.value = "";
                    userSignupPhone.value = "";
                    userSignupCity.value = "";
                    userSignupNeighborhood.value = "";

                    UIkit.modal.confirm(`Successfull Signup - please confirm your Signup via text message`);

                    //if no email provided give modal confirmation with code to delete
                    return JSON.stringify(data.message);
                }
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        UIkit.notification({
            message: '<span uk-icon=\'icon: close\'></span>Email and Phone are Both Required.',
            status: 'danger'
        });
    }
}

caseSubmitButton.addEventListener('click', e => {
    e.preventDefault;
    submitCase();
})

emailInformSendButton.addEventListener('click', e => {
    e.preventDefault;
    notifyUser();
})


userSignupButton.addEventListener('click', e => {
    e.preventDefault;
    UserSignUp();
})