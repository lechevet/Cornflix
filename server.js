//  SET UP
var express = require( 'express' );
var stormpath = require( 'express-stormpath' ); //Gestion des comptes utilisateur
var app = express();
var routes = require('./routes/index');

app.use( stormpath.init( app, {
    apiKey: {
        id: '4MIUE5CPOB6KEDF4UM71NAR6Z',
        secret: 'VmkWcyZ3qmfSaInhXIFrz/8Y3sQDi1GV1dTGhoYCsZk'
    },
    application: {
        href: `https://api.stormpath.com/v1/applications/5UuMr81z2fnECInr8cuxUj`
    }
} ) );

app.on( 'stormpath.ready', function() {

    console.log("Application ready on 8080");
} );

var morgan = require( 'morgan' ); //log requests to the console
var bodyParser = require( 'body-parser' ); //pull information from HTML POST
var methodeOverride = require( 'method-override' ); //simulate DELETE and PUT
/*
app.get('/email', stormpath.loginRequired, function (req, res) {
  res.send('Your email address is: ' + req.user.email);
});
*/
app.post( '/api/userData',stormpath.getUser, function( req, res ) {
  if (req.hasOwnProperty("user")){
    console.log("POST /userData : " + req.user.fullName + " is connected");
    res.send(JSON.stringify(req.user));
  }
} );


//fin du test Stormpath

//  CONFIGURATION


app.use( express.static( __dirname + '/public' ) );
app.use( morgan( 'dev' ) );
app.use( bodyParser.urlencoded( { 'extended': 'true' } ) );
app.use( bodyParser.json() );
app.use( bodyParser.json( { type: 'application/vnd.api+json' } ) );
app.use( methodeOverride() );

// LISTENING PORT
app.listen( 8080 );
console.log( "App listening on port 8080" );

//  ROUTES





//  FILES ROUTES
/*app.get( '/createMeal', function( req, res ) {
    res.sendfile( './public/createMeal.html' );
} );*/

app.get( '*', function( req, res ) {
    res.sendfile( './public/index.html' );
} );

//  MONGO MODELS

