const express = require('express');
var moment = require('moment');
const app = express();
const port = 3002;

app.get('/getdatesfromdays', (req, res) => {
    try {
        // ----- get date from one day earlier ---- //

        // var start_date = new Date();
        // var days = (req.query.hasOwnProperty('days')) ? parseInt(req.query.days, 10) : 1;
        // start_date.setDate(start_date.getDate() - days);
        // start_date.setHours(0, 0, 0, 0);

        // var end_date = new Date();
        // end_date.setDate(end_date.getDate() + 0);
        // end_date.setHours(0, 0, 0, 0);


        // ----- get date from current date ---- //
        var start_date = new Date();
        var days = (req.query.hasOwnProperty('days')) ? parseInt(req.query.days, 10) : 1;
        start_date.setUTCDate(start_date.getUTCDate() - days);
        start_date.setUTCHours(0, 0, 0, 0);
        var end_date = new Date();
        end_date.setUTCDate(end_date.getUTCDate() + 0);
        end_date.setUTCHours(0, 0, 0, 0);

        res.status(200).json({
            start_date: start_date.toISOString(),
            end_date: end_date.toISOString()
        });
    } catch (error) {
        console.error('Error processing date range:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


function isCurrentFutureDate(dateText) {
    const dateFormat = 'DD-MM-YYYY';
    const parsedDate = moment(dateText, dateFormat, true);
    if (parsedDate.isValid() && parsedDate.format(dateFormat) === dateText) {
        if (parsedDate.isSameOrAfter(moment(), 'day')) {
            return true;
        }
    }
    return false;
}


app.get('/checkcurrentfuturedate', (req, res) => {
    try {
        const dateToCheck = req.query.date;

        if (!dateToCheck) {
            return res.status(400).json({ error: 'Date parameter is missing' });
        }
        const isValidDate = isCurrentFutureDate(dateToCheck);
        if (isValidDate) {
            res.status(200).json({ message: 'The selected date is current or future.' });
        } else {
            res.status(200).json({ message: 'The selected date is in the past.' });
        }
    } catch (error) {
        console.error('Error checking current/future date:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/checkdifferenceofdate', (req, res) => {
    try {
        const startDate = req.query.start;
        const endDate = req.query.end;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start and/or end date parameters are missing' });
        }

        const startMoment = moment(startDate, 'DD-MM-YYYY', true);
        const endMoment = moment(endDate, 'DD-MM-YYYY', true);

        if (!startMoment.isValid() || !endMoment.isValid()) {
            return res.status(400).json({ error: 'Invalid date format. Expected format: DD-MM-YYYY' });
        }

        const yearsDiff = endMoment.diff(startMoment, 'years');
        const monthsDiff = endMoment.diff(startMoment, 'months') % 12;
        const monthsDiff1 = yearsDiff * 12 + monthsDiff;
        const daysDiff = endMoment.diff(startMoment, 'days');

        res.status(200).json({
            start_date: startMoment.format('DD-MM-YYYY'),
            end_date: endMoment.format('DD-MM-YYYY'),
            years_difference: `${yearsDiff}.${monthsDiff}`,
            months_difference: monthsDiff1,
            days_difference: daysDiff,
        });
    } catch (error) {
        console.error('Error calculating date difference:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
