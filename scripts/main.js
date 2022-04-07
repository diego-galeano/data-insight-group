const members = data.results[0].members;

const tbody = document.querySelector('tbody');
const form = document.querySelector('form');
const checkbox = document.querySelectorAll('input[type="checkbox"]')
const select = document.querySelector('select');


form.addEventListener('change', () => {

    tbody.innerHTML = '';

    let partysArr = getInputChecked()


    let stateSelect = select.value;

    let byParty = selectedByParty(partysArr)
    console.log(byParty);
    let byState = filterByState(members, stateSelect)

    let byPartyAndState = filterByState(byParty, stateSelect)


    if (byParty.length != 0 && stateSelect != 'Select by State')
        buildTr(byPartyAndState)
    else if (stateSelect.length > 3)
        buildTr(byParty)
    else if (stateSelect.length < 3)
        buildTr(byState)
    if (byParty.length == 0 && stateSelect.length > 3)
        buildTr(members)


})
/*
------------------------------------
Table Builders 
-----------------------------------
*/
buildTr(members)

function buildTr(membersData) {
    let count = 1;

    membersData.forEach(member => {
        let year = (member.seniority == 1) ? 'year' : 'years';
        const tr = document.createElement('tr');
        tr.appendChild(buildTd(count, "fw-bolder"))
        tr.appendChild(buildTd(`<a href= "${member.url}">${member.last_name}, ${member.first_name} ${member.middle_name != null ? member.middle_name : ''}</a>`));
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
-----------------------------------
*/
selectBuilder(getStates())

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
function getStates() {
    let states = [];
    members.forEach(member => !states.includes(member.state) && states.push(member.state));
    return states.sort()
}
/*
-------------------------
Filters
-------------------------
*/
function filterByParty(senatorParty) {
    return members.filter(sen => sen.party === senatorParty);
}

function filterByState(senators, senatorState) {
    return senators.filter(sen => sen.state === senatorState);
}

function selectedByParty(partys) {

    let senators = [];
    partys.forEach(party => {
        senators.push(filterByParty(party))

    })
    let byParty = concat(senators);
    return byParty
}
// prueba--------------
let democrats = filterByParty('D')
let independents = filterByParty('ID')
let republicans = filterByParty('R')
// console.log(democrats);
let democratsVotWithParty = getVotedWithParty(democrats)
// console.log(democratsVotWithParty);
let indepVotWithParty = getVotedWithParty(independents)
let repubVotWithParty = getVotedWithParty(republicans)

let numberOfDemocrats = democrats.length;
let numberOfRepublicans = republicans.length;
let numberOfIndependents = independents.length;


let allVotWithParty = getVotedWithParty(members)
// console.log(members.length);
// console.log(average(allVotWithParty));

// console.log(numberOfDemocrats);
// console.log(average(democratsVotWithParty))
// console.log('');
// console.log(numberOfIndependents);
// console.log(average(indepVotWithParty));
// console.log('');
// console.log(numberOfRepublicans);
// console.log(average(repubVotWithParty));


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
    senByParty.forEach(member => votes.push(member.votes_with_party_pct));
    return votes;
}
function getMissedVotes(members, input) {
    let i = input

    let votes = [];
    members.forEach(member => votes.push(member.this.i))
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
    let result = (percent / 100) * num;
    return Math.round(result)
}

function average(arr) {
    let sum = arr.reduce((a, b) => a + b, 0);
    return sum / arr.length;
}

let votesBySenators = []

members.forEach(member => votesBySenators.push({ senator: `${member.last_name}, ${member.first_name} ${member.middle_name != null ? member.middle_name : ''} `, missed: member.missed_votes, missed_pct: member.missed_votes_pct, with_party_pct: member.votes_with_party_pct, against_party: member.votes_against_party_pct }));
console.log(votesBySenators);



let topMissed_pct =  votesBySenators.sort((a, b) => {
    if (a.missed_pct > b.missed_pct) {
        return 1;
    }
    if (a.missed_pct < b.missed_pct) {
        return -1
    }
    return 0;
})



let percent10 = calculatePercent(10, votesBySenators.length)
console.log(percent10);

let top10Attendance = topMissed_pct.slice(topMissed_pct.length - percent10, topMissed_pct.length)
top10Attendance.sort((a,b)=> {
    if(a.missed_pct < b.missed_pct) {
        return 1;
    }
    if(a.missed_pct > b.missed_pct){
        return -1
    }
    return 0;
})
let bottom10Attendance = votesBySenators.slice(0, percent10)
console.log(bottom10Attendance);


console.log(top10Attendance);

function desc(a, b) {
    if (a < b) {
        return 1;
    }
    if (a > b) {
        return -1
    }
    return 0;
}
members.sort((a, b) => {
    if (a.votes_against_party_pct > b.votes_against_party_pct) {
        return 1;
    }
    if (a.votes_against_party_pct < b.votes_against_party_pct) {
        return -1
    }
    return 0;
})
console.log(members);