// const caseDayStat = document.getElementById("case__day__stat");
// const caseWeekStat = document.getElementById("case__week__stat");
// const caseMonthStat = document.getElementById("case__month__stat");
// const caseTotalStat = document.getElementById("case__total__stat");
const caseRefreshStatsButton = document.getElementById("case__refresh__stats__button");



const markupstatsCaseUpdateController = async (caseTotalNumber, caseMonthNumber, caseWeekNumber, caseTodayNumber, time) => {
    let caseStatsHtmlMarkup = `
<div class="uk-child-width-1-4@m uk-grid-small uk-grid-match" uk-grid
style="margin-bottom: 10px; margin-right: 10; margin-left: 10;">
<div>
    <div class="uk-card uk-card-primary uk-card-hover">
        <div class="uk-card-header">
            <div class="uk-card-badge uk-label">updated: ${time}</div>
        </div>
        <div class="uk-card-body">
            <h3 class="uk-card-title uk-text-center"> Total Anonymous Cases on Site</h3>
            <center>
                <h3 id="case__total__stat">${caseTotalNumber}</h3>
            </center>
        </div>
        <div class="uk-card-footer"></div>
    </div>
</div>
<div>
    <div class="uk-card uk-card-primary uk-card-hover">
        <div class="uk-card-header">
            <div class="uk-card-badge uk-label">updated: ${time}</div>
        </div>
        <div class="uk-card-body">
            <h3 class="uk-card-title uk-text-center"> Cases this month on Site</h3>
            <center>
                <h3 id="case__month__stat">${caseMonthNumber}</h3>
            </center>
        </div>
        <div class="uk-card-footer"></div>
    </div>
</div>
<div>
    <div class="uk-card uk-card-primary uk-card-hover">
        <div class="uk-card-header">
            <div class="uk-card-badge uk-label">updated: ${time}</div>
        </div>
        <div class="uk-card-body">
            <h3 class="uk-card-title uk-text-center">Cases this Week on Site</h3>
            <center>
                <h3 id="case__week__stat">${caseWeekNumber}</h3>
            </center>
        </div>
        <div class="uk-card-footer"></div>
    </div>
</div>
<div>
    <div class="uk-card uk-card-primary uk-card-hover">
        <div class="uk-card-header">
            <div class="uk-card-badge uk-label">updated: ${time}</div>
        </div>
        <div class="uk-card-body">
            <h3 class="uk-card-title uk-text-center">Cases Today on Site</h3>
            <center>
                <h3 id="case__day__stat">${caseTodayNumber}</h3>
            </center>
        </div>
        <div class="uk-card-footer"></div>
    </div>
</div>
</div>
`
    document.getElementById('case__stats__results').insertAdjacentHTML('beforeend', caseStatsHtmlMarkup)
}

const queryResults = async (url, method) => {
    let response = await fetch(url, {
        method: method
    })
    let data = await response.json();
    return data;
}

const clearExistingResults = () => {
    document.getElementById('case__stats__results').innerHTML = '';
}


const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}





const statsCaseUpdateController = async () => {

    // clear results
    clearExistingResults();

    //render spinner again
    const spinner = '<center><span id="case_results_spinner" class="uk-margin-small" uk-spinner="ratio: 3"></span></center>'
    document.getElementById('case__stats__results').insertAdjacentHTML('beforeend', spinner)

    //render results
    try {
        const spinnerDOM = document.getElementById('case_results_spinner');

        //make all the API calls
        let caseTotalNumber = await queryResults(`http://localhost:3000/API/Cases/renderCases/caseResults/statsQuery/?statsType=4`, 'get');
        let caseMonthNumber = await queryResults(`http://localhost:3000/API/Cases/renderCases/caseResults/statsQuery/?statsType=3`, 'get');
        let caseWeekNumber = await queryResults(`http://localhost:3000/API/Cases/renderCases/caseResults/statsQuery/?statsType=2`, 'get');
        let caseTodayNumber = await queryResults(`http://localhost:3000/API/Cases/renderCases/caseResults/statsQuery/?statsType=1`, 'get');

        let time = formatAMPM(new Date)

        //insert the markup to HTML
        markupstatsCaseUpdateController(caseTotalNumber.data, caseMonthNumber.data, caseWeekNumber.data, caseTodayNumber.data, time)


        //clear spinner
        if (spinnerDOM) {
            spinnerDOM.parentElement.removeChild(spinnerDOM);
        }
    } catch (err) {
        console.log(err)
    }
}


//rendering cases on Page Load
statsCaseUpdateController();


caseRefreshStatsButton.addEventListener('click', e => {
    statsCaseUpdateController();
    console.log("ran refresh")
})