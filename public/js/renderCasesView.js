const nextPage = document.getElementById('page__case__next');
const previousPage = document.getElementById('page__case__previous');
const searchTypeSelect = document.getElementById('form__select__search');
const searchQueryInput = document.getElementById('search__input__query');
const searchButton = document.getElementById('case__search__query__button');
let searchButtonCheck = false;
let url, method;

let globalState = {};

const renderCaseMarkup = cases => {
    let searchResults;
    if (cases === -1) {

        searchResults = "<div><h3 style='text-align:center; vertical-align: middle; justify-content: center;'>No Cases Found...</h3></div>"
    } else {
        searchResults = `
        <tr>
                            <td>${cases._id} </td>
                            <td>${cases.neighborhood}</td>
                            <td>${cases.city}</td>
                            <td>${cases.province}</td>
                            <td>${cases.country}</td>
                            <td>${cases.lat}</td>
                            <td>${cases.lng}</td>
                            <td>${cases.createdAt}</td>
                            <td><button class="uk-button uk-button-danger" type="button">Delete</button></td>
                            </tr>
        `;
    }

    document.getElementById('caseResults').insertAdjacentHTML('beforeend', searchResults)
}

const renderingResults = cases => {
    console.log(cases.data)

    if (!cases.data) {
        renderCaseMarkup(-1)
    } else {
        if (cases.data.length === 0) {
            renderCaseMarkup(-1)
        } else {
            for (let data of cases.data) {
                renderCaseMarkup(data)
            }
        }

    }
}

const queryResults = async (url, method) => {
    let response = await fetch(url, {
        method: method
    })
    let data = await response.json();
    return data;
}

const clearExistingResults = () => {
    document.getElementById('caseResults').innerHTML = '';
}

const controllCaseResults = async () => {
    //render spinner
    const spinner = '<center><span id="case_results_spinner" class="uk-margin-small uk-position-center" uk-spinner="ratio: 3"></span></center>'
    document.getElementById('caseResults').insertAdjacentHTML('beforeend', spinner)

    //render results
    try {
        const spinnerDOM = document.getElementById('case_results_spinner');
        let cases = await queryResults('http://localhost:3000/API/Cases/renderCases/caseResults?page=1', 'POST');

        //rendering cases on page
        renderingResults(cases);


        //clear spinner
        if (spinnerDOM) {
            spinnerDOM.parentElement.removeChild(spinnerDOM);
        }
    } catch (err) {
        console.log(err)
    }
}

const pageCaseController = async (pageType) => {
    let pageNumber;

    // clear results
    clearExistingResults();

    //render spinner again
    const spinner = '<center><span id="case_results_spinner" class="uk-margin-small uk-position-center" uk-spinner="ratio: 3"></span></center>'
    document.getElementById('caseResults').insertAdjacentHTML('beforeend', spinner)

    let currentPageNumber = document.getElementById('case__page');

    if (pageType === 'next') {
        pageNumber = parseInt(currentPageNumber.value) + 1
        console.log(pageNumber);
    }

    if (pageType === 'back') {
        if (parseInt(currentPageNumber.value) === 1) {
            pageNumber = 1;
        } else {
            pageNumber = parseInt(currentPageNumber.value) - 1;
        }
        console.log(pageNumber);
    }

    //updating current page number
    currentPageNumber.value = String(pageNumber);

    //render results
    try {
        const spinnerDOM = document.getElementById('case_results_spinner');
        let cases = await queryResults(`http://localhost:3000/API/Cases/renderCases/caseResults?page=${pageNumber}`, 'POST');
        //fixed page limit issue
        if (pageNumber > Math.round(parseInt(cases.totalCases) / parseInt(cases.perPage))) {
            currentPageNumber.value = String(pageNumber - 1);
        }

        //rendering cases on page
        renderingResults(cases);


        //clear spinner
        if (spinnerDOM) {
            spinnerDOM.parentElement.removeChild(spinnerDOM);
        }
    } catch (err) {
        console.log(err)
    }

}

const SearchFunctionalityController = async (pageType, searchQueryInput, searchTypeSelect) => {
    console.log(`search Queries being sent, ${searchQueryInput} - ${searchTypeSelect}`)
    let pageNumber;

    // clear results
    clearExistingResults();

    //render spinner again
    const spinner = '<center><span id="case_results_spinner" class="uk-margin-small uk-position-center" uk-spinner="ratio: 3"></span></center>'
    document.getElementById('caseResults').insertAdjacentHTML('beforeend', spinner)

    let currentPageNumber = document.getElementById('case__page');

    if (pageType === null) {
        pageNumber = 1;
    } else {
        if (pageType === 'next') {
            pageNumber = parseInt(currentPageNumber.value) + 1
            console.log(pageNumber);
        }

        if (pageType === 'back') {
            if (parseInt(currentPageNumber.value) === 1) {
                pageNumber = 1;
            } else {
                pageNumber = parseInt(currentPageNumber.value) - 1;
            }
            console.log(pageNumber);
        }
    }

    //updating current page number
    currentPageNumber.value = String(pageNumber);

    //render results
    try {
        const spinnerDOM = document.getElementById('case_results_spinner');

        let cases = await queryResults(`http://localhost:3000/API/Cases/renderCases/caseResults/searchQuery/?searchQueryText=${searchQueryInput.value}&SearchQueryType=${searchTypeSelect.value}&page=${pageNumber}`, 'POST');
        //fixed page limit issue
        if (pageNumber > Math.round(parseInt(cases.totalCases) / parseInt(cases.perPage))) {
            currentPageNumber.value = String(pageNumber - 1);
        }

        //rendering cases on page
        renderingResults(cases);


        //clear spinner
        if (spinnerDOM) {
            spinnerDOM.parentElement.removeChild(spinnerDOM);
        }
    } catch (err) {
        console.log(err)
    }
}

const queryIntentParse = (searchQuery, searchQuerySelect, globalState) => {
    console.log(searchQuery)
    console.log(searchQuerySelect)
    if (searchQuery === '' || searchQuerySelect === '') {
        return globalState.searchButtonCheck = false;
    } else {
        return globalState.searchButtonCheck = true;
    }
}

//rendering cases on Page Load
controllCaseResults();


searchButton.addEventListener('click', e => {
    e.preventDefault();
    queryIntentParse(searchTypeSelect.value, searchQueryInput.value, globalState);
    SearchFunctionalityController(null, searchQueryInput, searchTypeSelect);
    console.log(globalState)
})
console.log(globalState.searchButtonCheck);


nextPage.addEventListener('click', e => {
    if (globalState.searchButtonCheck === true) {
        e.preventDefault();
        SearchFunctionalityController("next", searchQueryInput, searchTypeSelect);
        console.log(globalState.searchButtonCheck);
    } else {
        e.preventDefault();
        pageCaseController("next");
        console.log(globalState.searchButtonCheck);
    }
})


previousPage.addEventListener('click', e => {
    if (globalState.searchButton === true) {
        e.preventDefault();
        SearchFunctionalityController("back", searchQueryInput, searchTypeSelect);
        console.log(globalState.searchButtonCheck);
    } else {
        e.preventDefault();
        pageCaseController("back");
        console.log(globalState.searchButtonCheck);
    }
})


//user clicked search button with filter and text