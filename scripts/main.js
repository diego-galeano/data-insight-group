let chamber = document.querySelector('#senate-table') ? 'senate' : 'house';

let UrlAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`;
let init = {
    method: "GET",
    headers: {
        "X-API-Key": "kWVPZhF3VXLv9JMbY4H8AHU5gztZN5MkHyhZ3Yhs"
    }

}

fetch(UrlAPI, init)
    .then(res => res.json())
    .then(data => {
        const members = data.results[0].members;
        if (document.querySelector('#tbody-congress')) buildTr(members)

        form && form.addEventListener('change', () => {

            tbody.innerHTML = '';

            drawTable(members)

        })
        let percent10 = calculatePercent(10, members.length)

        if (document.querySelector('select')) {
            selectBuilder(getStates(members))
        }
        let votesBySenators = statisticsVotes(members)
        //     // Most Engaged
        votesBySenators.sort((a, b) => a.missed_pct - b.missed_pct)

        let most10pctEngaged = votesBySenators.slice(0, percent10)

        // //  Least Engaged

        votesBySenators.sort((a, b) => b.missed_pct - a.missed_pct)
        let least10pctEngaged = votesBySenators.slice(0, percent10)
        // // Least Loyalty


        votesBySenators.sort((a, b) => a.with_party_pct - b.with_party_pct)
        let leastLoyalty = votesBySenators.slice(0, percent10)


        //   //  Mosts Loyaltys          

        votesBySenators.sort((a, b) => b.with_party_pct - a.with_party_pct)
        let mostLoyalty = votesBySenators.slice(0, percent10)

        if (document.querySelector('#tbody-senate-glance')) {
            senateGlaceBuilder('Democrats', members, 'D');
            senateGlaceBuilder('Republicans', members, 'R');
            senateGlaceBuilder('Independents', members, 'ID');
        }
        if (document.querySelector('#bottom10Loyalty')) {
            loyaltyBuilder(mostLoyalty, '#top10Loyalty')
            loyaltyBuilder(leastLoyalty, '#bottom10Loyalty')
        }

        if (document.querySelector('#bottom10Attendance')) {

            engagedBuilder(least10pctEngaged, '#bottom10Attendance')
            engagedBuilder(most10pctEngaged, '#top10')
        }
    })
    .catch(error => console.log(error.message))

const tbody = document.querySelector('#tbody-congress');
const form = document.querySelector('form');
const checkbox = document.querySelectorAll('input[type="checkbox"]')
const select = document.querySelector('select');


function drawTable(members) {
    let partysArr = getInputChecked()
    let stateSelect = select.value;
    let byParty = selectedByParty(members, partysArr)
    let byState = filterByState(members, stateSelect)
    let byPartyAndState = filterByState(byParty, stateSelect)
    if (byParty.length != 0 && stateSelect != 'Select by State')
        buildTr(byPartyAndState)
    else if (partysArr.length != 0 && byParty == 0)
        tbody.innerHTML = '';
    else if (stateSelect.length > 3)
        buildTr(byParty)
    else if (stateSelect.length < 3)
        buildTr(byState)
    if (partysArr.length == 0 && stateSelect == 'Select by State')
        buildTr(members)
}
/*
------------------------------------
Table Builders 
-----------------------------------
*/
function buildTr(membersData) {
    let count = 1;

    membersData.forEach(member => {
        let year = (member.seniority == 1) ? 'year' : 'years';
        const tr = document.createElement('tr');
        tr.appendChild(buildTd(count, "fw-bolder"))
        tr.appendChild(buildTd(`<a href= "${member.url}">${member.last_name}, ${member.first_name} ${member.middle_name || ''}</a>`));
        tr.appendChild(buildTd(member.state));
        tr.appendChild(buildTd(member.party));
        tr.appendChild(buildTd(`${member.seniority} ${year}`));
        tr.appendChild(buildTd(`${member.votes_with_party_pct} %`));
        tbody.appendChild(tr);
        count++;

    })
}

function buildTd(textTd, style) {
    const td = document.createElement('td');
    td.className = style;
    td.innerHTML = textTd;
    return td;
}

/*
------------------------------------
Select Builders
---------------------------------
*/

function selectBuilder(options) {
    options.forEach(option => {
        select.appendChild(buildOptions(option))
    })
}
function buildOptions(info) {
    const option = document.createElement('option')
    option.value = info;
    option.textContent = info;
    return option;
}
// ---States getter
function getStates(members) {
    let states = [];
    members.forEach(member => !states.includes(member.state) && states.push(member.state));
    return states.sort()
}
/*
-------------------------
Filters
-------------------------
*/
function filterByParty(members, senatorParty) {
    return members.filter(member => member.party === senatorParty);
}

function filterByState(senators, senatorState) {
    return senators.filter(sen => sen.state === senatorState);
}

function selectedByParty(members, partys) {

    let senators = [];
    partys.forEach(party => {
        senators.push(filterByParty(members, party))

    })
    let byParty = concat(senators);
    return byParty
}
/*
-------------------------
CheckBox Getter
-------------------------
*/

function getInputChecked() {
    let partySelected = [];
    checkbox.forEach(input => input.checked && partySelected.push(input.value))
    return partySelected;
}
/*
-------------------------
Vote w/ Party Getter
-------------------------
*/
function getVotedWithParty(senByParty) {
    let votes = [];
    if (senByParty.length == 0) {
        votes = 0;
    } else {
        senByParty.forEach(member => votes.push(member.votes_with_party_pct));
    }
    return votes;
}

/*
--------------------------
Statistics Function Builders
--------------------------
*/


function statisticsVotes(members) {
    let statisticsData = []
    members.forEach(member => {
        if (member.total_votes != 0) {

            statisticsData.push(
                {
                    senator: `${member.last_name}, ${member.first_name} ${member.middle_name != null ? member.middle_name : ''} `,
                    url: member.url, missed: member.missed_votes,
                    votes: member.total_votes - member.missed_votes,
                    missed_pct: member.missed_votes_pct,
                    with_party_pct: member.votes_with_party_pct,
                    gainst_party: member.votes_against_party_pct,
                    party_votes: calculatePercent(member.votes_with_party_pct, member.total_votes - member.missed_votes)
                }
            )
        }
    });
    return statisticsData;
}

function senateGlaceBuilder(partyName, arrMembers, party) {
    const tbodySenateGlance = document.querySelector('#tbody-senate-glance');
    let members = filterByParty(arrMembers, party)
    const tr = document.createElement('tr');
    tr.appendChild(buildTd(partyName, 'fw-bolder'))
    tr.appendChild(buildTd(members.length))
    tr.appendChild(buildTd(average(getVotedWithParty(members))))
    tbodySenateGlance.appendChild(tr)
}


function engagedBuilder(arrMembers, tbodyID) {
    const tbody = document.querySelector(`${tbodyID}`)
    arrMembers.forEach(member => {
        const tr = document.createElement('tr');
        tr.appendChild(buildTd(`<a href= "${member.url}">${member.senator}</a>`, 'fw-bolder'));
        tr.appendChild(buildTd(member.missed))
        tr.appendChild(buildTd(member.missed_pct))
        tbody.appendChild(tr)
    })
}

function loyaltyBuilder(arrMembers, tbodyID) {

    const tbody = document.querySelector(`${tbodyID}`)
    arrMembers.forEach(member => {

        const tr = document.createElement('tr');
        tr.appendChild(buildTd(`<a href= "${member.url}">${member.senator}</a>`, 'fw-bolder'));
        tr.appendChild(buildTd(member.party_votes))
        tr.appendChild(buildTd(member.with_party_pct))
        tbody.appendChild(tr)

    })
}

/*
-------------------------
Utilitys
-------------------------
*/

function concat(arr) {
    let sen = []
    for (i of arr) {
        i.forEach(item => sen.push(item))
    };

    return sen;
}

function calculatePercent(percent, num) {
    let result = 0;
    if (percent != 0) {

        result = (percent / 100) * num;
    }
    return Math.round(result)
}

function average(arr) {
    let average = 0;
    if (arr != 0) {
        let sum = arr.reduce((a, b) => a + b, 0);
        average = Math.round(sum / arr.length);
    }
    return average;
}
