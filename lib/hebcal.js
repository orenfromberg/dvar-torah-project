const request = require('request-promise');

const fetchUpcomingParashot = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    let currentYearOptions = {
        uri: 'http://www.hebcal.com/hebcal/',
        qs: {
            v: 1,
            cfg: 'json',
            year: currentYear,
            month: 'x',
            s: 'on'
        },
        json: true
    };
    
    let nextYearOptions = {
        uri: 'http://www.hebcal.com/hebcal/',
        qs: {
            v: 1,
            cfg: 'json',
            year: nextYear,
            month: 'x',
            s: 'on'
        },
        json: true
    };

    return Promise.all([ request(currentYearOptions), request(nextYearOptions)])
    .then(([ currentYearParashot, nextYearParashot ]) => {
        let parashot = [];
        parashot = [...parashot, ...currentYearParashot.items];
        parashot = [...parashot, ...nextYearParashot.items];
        
        // filter parashot
        const now = new Date();
        let upcoming = parashot.filter((parasha) => (new Date(parasha.date) > now))

        // get 54 max parashot
        let cappedUpcoming = upcoming.slice(0, 54);

        return cappedUpcoming;
    })
}

module.exports = {
    fetchUpcomingParashot
}