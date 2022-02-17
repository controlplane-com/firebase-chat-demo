// Application is based on the sample project from:
// https://auth0.com/blog/developing-real-time-apps-with-firebase-and-firestore/

const express = require('express');
const path = require('path');

const app = express();

app.use(function (req, res, next) {
    var loc = process.env.CPLN_LOCATION || 'None' ;

    if (loc.indexOf('/') > -1) {
        loc = loc.substring(loc.lastIndexOf('/') + 1);
        
    }
    res.cookie('cpln_location', loc);
    next();
});

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(8080, () => console.log('Server running on localhost:8080'));
