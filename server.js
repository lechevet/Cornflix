//  SET UP
var express = require( 'express' );
var app = express();
var mongoose = require( 'mongoose' );
var morgan = require( 'morgan' ); //log requests to the console
var bodyParser = require( 'body-parser' ); //pull information from HTML POST
var methodeOverride = require( 'method-override' ); //simulate DELETE and PUT

//  CONFIGURATION
mongoose.connect( 'mongodb://localhost:27017/food' );

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
app.get( '/api/ingredients', function( req, res ) {
    console.log( "Ingredient => find()" );
    Ingredient.find( function( err, ingredients ) {
        if ( err ) res.send( err );
        console.log( ingredients );
        res.json( ingredients );
    } );
} );

app.get( '/api/ingredients/:ingredient_name', function( req, res ) {
    console.log( "search result : " );
    Ingredient.find( {
        name: req.params.ingredient_name
    }, function( err, ingredients ) {
        if ( err ) console.log( err );
        else {
            console.log( ingredients );
            res.json( ingredients );
        }
    } );
} );

app.get( '/api/meals', function( req, res ) {
    Meal.find( function( err, meals ) {
        //if ( err ) res.send( err );
        if ( !err ) res.json( meals );
    } );
} );

app.post( '/api/meals', function( req, res ) {
    console.log( req.body );
    Meal.create( req.body,
        function( err, meal ) {
            if ( err ) res.send( err );
            else res.send( meal );
        } );
} );

app.delete( '/api/meals/:meal_id', function( req, res ) {
    Meal.remove( {
        _id: req.params.meal_id
    }, function( err, result ) {
        if ( err ) res.send( err );

        Meal.find( function( err, meals ) {
            if ( err ) res.send( err )
            res.json( meals );
        } );
    } );
} );

app.post( '/api/ingredients/search', function( req, res ) {
    Ingredient.find( {
        name: { "$regex": req.body.name, "$options": "i" }
    }, function( err, ingredients ) {
        if ( err ) res.send( err );
        res.json( ingredients );
    } );
} )

//  FILES ROUTES
/*app.get( '/createMeal', function( req, res ) {
    res.sendfile( './public/createMeal.html' );
} );*/

app.get( '*', function( req, res ) {
    res.sendfile( './public/index.html' );
} );

//  MONGO MODELS
var Meal = mongoose.model( 'meals', {
    user_id: String,
    public: Boolean,
    name: String,
    description: String,
    ingredients: [ String ]
} );

var Ingredient = mongoose.model( 'ingredients', {
    category: String,
    name: String,
    weight: Number,
    sodium_mg: Number,
    magnesium_mg: Number,
    phosphore_mg: Number,
    potassium_mg: Number,
    calcium_mg: Number,
    manganese_mg: Number,
    fer_mg: Number,
    cuivre_mg: Number,
    zinc_mg: Number,
    selenium_microg: Number,
    iode_microg: Number,
    proteine_g: Number,
    proteine_brute_g: Number,
    glucide_g: Number,
    sucre_g: Number,
    energie_kj: Number,
    energie_kcal: Number,
    amidon_g: Number,
    energie_jones_kj: Number,
    energie_jones_kcal: Number,
    polyols_g: Number,
    fibre_g: Number,
    eau_g: Number,
    lipide_g: Number,
    acide_gras_sature_g: Number,
    beta_carotene_microg: Number,
    vitamine_d_microg: Number,
    vitamine_e_mg: Number,
    vitamine_k1_microg: Number,
    vitamine_k2_microg: Number,
    vitamine_c_mg: Number,
    vitamine_b1_mg: Number,
    vitamine_b2_mg: Number,
    vitamine_b3: Number,
    vitamine_b5_mg: Number,
    vitamine_b6_mg: Number,
    vitamine_b12_microg: Number,
    vitamine_b9_microg: Number,
    alcool_g: Number,
    cholesterol_mg: Number
} );
