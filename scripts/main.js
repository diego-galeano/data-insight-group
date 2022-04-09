const members = data.results[0].members;

const tbody = document.querySelector('tbody');
const form = document.querySelector('main');
const checkbox = document.querySelectorAll('input[type="checkbox"]')
const select = document.querySelector('select');

buildTr(members)
form.addEventListener('change', () => {

    tbody.innerHTML = '';

    let partysArr = getInputChecked()
    console.log(partysArr.length);

    let stateSelect = select.value;

    let byParty = selectedByParty(partysArr)
    console.log(byParty.length);
    let byState = filterByState(members, stateSelect)

    let byPartyAndState = filterByState(byParty, stateSelect)
    
    
    if (byParty.length != 0 && stateSelect != 'Select by State')
        buildTr(byPartyAndState)
    else if (partysArr.length != 0 && byParty == 0)
        tbody.innerHTML ='';
    else if (stateSelect.length > 3)
        buildTr(byParty)
     else if (stateSelect.length < 3)
        buildTr(byState)
    if (partysArr.length == 0 && stateSelect == 'Select by State')
    buildTr(members)


})
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
---------------------------------
*/
if(select)
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









