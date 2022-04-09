const members = data.results[0].members;


const tbodySenateGlance = document.querySelector('#tbody-senate-glance');

const tbodyLeastEgaged = document.querySelector('#least-engaged')

let democrats = filterByParty('D')
let independents = filterByParty('ID')
let republicans = filterByParty('R')
let percent10 = calculatePercent(10, members.length)


let statisticsData = []


members.forEach(member => { if(member.total_votes != 0){

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
    )}
});



// Most Engaged

statisticsData.sort((a, b) => {
    if (a.missed_pct > b.missed_pct) {
        return 1;
    }
    if (a.missed_pct < b.missed_pct) {
        return -1
    }
    return 0;
})

let most10pctEngaged = statisticsData.slice(0, percent10)

//  Least Engaged
statisticsData.sort((a, b) => {
    if (a.missed_pct < b.missed_pct) {
        return 1;
    }
    if (a.missed_pct > b.missed_pct) {
        return -1
    }
    return 0;
})
let least10pctEngaged = statisticsData.slice(0, percent10)
// Least Loyalty
statisticsData.sort((a, b) => {
        if (a.with_party_pct > b.with_party_pct) {
                return 1;
            }
            if (a.with_party_pct < b.with_party_pct) {
                    return -1
                }
                return 0;
            })
            
            let leastLoyalty = statisticsData.slice(0, percent10)
            
  //  Mosts Loyaltys          
            statisticsData.sort((a, b) => {
                if (a.with_party_pct < b.with_party_pct) {
                    return 1;
                }
                if (a.with_party_pct > b.with_party_pct) {
                    return -1
                }
                return 0;
            })
            
let mostLoyalty = statisticsData.slice(0, percent10)





// Functions

function senateGlaceBuilder (partyName, arrMembers){
    const tr = document.createElement('tr');
    tr.appendChild(buildTd(partyName, 'fw-bolder'))
    tr.appendChild(buildTd(arrMembers.length))
    tr.appendChild(buildTd(average(getVotedWithParty(arrMembers))))
    tbodySenateGlance.appendChild(tr)
}
senateGlaceBuilder( 'Democrats' ,democrats);
senateGlaceBuilder('Republicans', republicans);
senateGlaceBuilder('Independents', independents);

function engagedBuilder (arrMembers, tbodyID){
    const tbody = document.querySelector(`${tbodyID}`) 
    
      
    arrMembers.forEach(member => {
    const tr = document.createElement('tr');
    tr.appendChild(buildTd(`<a href= "${member.url}">${member.senator}</a>`, 'fw-bolder'));
    tr.appendChild(buildTd(member.missed))
    tr.appendChild(buildTd(member.missed_pct))
    tbody.appendChild(tr)
})}

function loyaltyBuilder (arrMembers, tbodyID){
    const tbody = document.querySelector(`${tbodyID}`)
    
    arrMembers.forEach(member => {
    
        const tr = document.createElement('tr');
        tr.appendChild(buildTd(`<a href= "${member.url}">${member.senator}</a>`, 'fw-bolder'));
        tr.appendChild(buildTd(member.party_votes))
        tr.appendChild(buildTd(member.with_party_pct))
        tbody.appendChild(tr)
   
})}

if(document.querySelector('#bottom10Loyalty')){
    loyaltyBuilder(mostLoyalty, '#top10Loyalty')
    loyaltyBuilder(leastLoyalty, '#bottom10Loyalty')
}else{

    engagedBuilder(least10pctEngaged, '#bottom10Attendance')
    engagedBuilder( most10pctEngaged, '#top10' )
}


function buildTd(textTd, style) {
    const td = document.createElement('td');
    td.className = style;
    td.innerHTML = textTd;
    return td;
}


function filterByParty(senatorParty) {
    return members.filter(sen => sen.party === senatorParty);
}

function calculatePercent(percent, num) {
    let result = (percent / 100) * num;
    return Math.round(result)
}
function getVotedWithParty(senByParty) {
    let votes = [];
    if(senByParty.length == 0){
        votes = 0;
    }else{
        senByParty.forEach(member => votes.push(member.votes_with_party_pct));
    }
    return votes;
}
function average(arr) {
    let average = 0;
    if(arr != 0){
        let sum = arr.reduce((a, b) => a + b, 0);
        average = Math.round(sum / arr.length);
    }
    return average;
}