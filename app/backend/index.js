const express = require('express');
const path = require('path');
const cors = require('cors');

const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const db = require('./db');

const app = express();
const frontEndPath = path.join(__dirname, '..', 'frontend', 'build')

app.use(cors());
app.use(express.json());
app.use(express.static(frontEndPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.cookie_parser_secret))

function myAuthorizer(username, password, cb) {
    db.query('SELECT * FROM users', (err, result) => {
        if (!err) {
            let authenticated = false;
            result.forEach(element => {
                const userMatches = basicAuth.safeCompare(username, element.username)
                const passwordMatches = basicAuth.safeCompare(password, element.password)
        
                if (userMatches & passwordMatches) {
                    authenticated = true;
                }
            });
            return cb(null, authenticated);
        }
        else {
            console.log(err);
        }
    })
}

const auth = basicAuth({
    authorizer: myAuthorizer,
    authorizeAsync: true
});

const checkAuthentication = (req, res, next) => {
    next()                                                     // <---------- REMOVE THIS ONCE LOGIN IS BUILT
    /*if (req.signedCookies.name === 'user') {
        next()
    }
    else {
        res.status(401).send('Unauthorised');
    }*/
}

app.get('/authenticate', auth, (req, res) => {
    const options = {
        httpOnly: true,
        signed: true
    }
  
    if (req.auth.user === 'user') {
        res.cookie('name', 'user', options).send('user');
    }
});
  
app.get('/read-cookie', (req, res) => {
    if (req.signedCookies.name === 'user') {
        res.send('user');
    } else {
        res.send('auth');
    }
});

app.get('/clear-cookie', (req, res) => {
    res.clearCookie('name').end();
});

//app.use(checkAuthentication);

app.get('/api', checkAuthentication, (req, res) => {
    res.send('Hello from the API!')
})

const customersRoutes = require('./routes/customersRoutes');
app.use('/api/customers', checkAuthentication, customersRoutes);

const instrumentsRoutes = require('./routes/instrumentsRoutes');
app.use('/api/instruments', checkAuthentication, instrumentsRoutes);

const repairersRoutes = require('./routes/repairersRoutes');
app.use('/api/repairers', checkAuthentication, repairersRoutes);

const repairsRoutes = require('./routes/repairsRoutes');
app.use('/api/repairs', checkAuthentication, repairsRoutes);

const assessmentsRoutes = require('./routes/assessmentsRoutes');
app.use('/api/assessments', checkAuthentication, assessmentsRoutes);

const calendarEventsRoutes = require('./routes/calendarEventsRoutes');
app.use('/api/calendarEvents', checkAuthentication, calendarEventsRoutes);

const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/settings', checkAuthentication, settingsRoutes);

app.get('/*', (req, res) => {
    res.sendFile(path.join(frontEndPath, 'index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log('Running on port', PORT);
});