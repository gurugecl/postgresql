'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var pg = require('pg');
var cors = require('cors');
var PORT = 3000;

var pool = new pg.Pool({
    user: 'postgres',
    database: 'countries',
    password: 'clayton17',
    host: 'localhost',
    port: 5432,
    max: 10
});

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.delete('/api/remove/:id', function (request, response) {
    var id = request.params.id;
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        } else {
            db.query('DELETE FROM countries WHERE id = $1', [Number(id)], function (err, result) {
                done();
                if (err) {
                    return response.status(400).send(err);
                } else {
                    return response.status(200).send({ message: 'success in deleting record' });
                }
            });
        }
    });
});

//getting data back from postgres
app.get('/api/countries', function (request, respone) {
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        } else {
            db.query('SELECT * FROM countries', function (err, table) {
                done();
                if (err) {
                    return response.status(400).send(err);
                } else {
                    return response.status(200).send(table.rows);
                }
            });
        }
    });
});

//posting data to postgres
app.post('/api/new-country', function (request, response) {
    var country_name = request.body.country_name;
    var continent_name = request.body.continent_name;
    var id = request.body.id;
    var values = [country_name, continent_name, id];
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        } else {
            db.query('INSERT INTO countries (country_name, continent_name, id) VALUES($1, $2, $3)', [].concat(values), function (err, table) {
                done();
                if (err) {
                    return response.status(400).send(err);
                } else {
                    console.log('DATA INSERTED');
                    db.end();
                    response.status(201).send({ message: 'Data inserted' });
                }
            });
        }
    });
});

app.listen(PORT, function () {
    return console.log('Listening on port ' + PORT);
});
//# sourceMappingURL=server.js.map