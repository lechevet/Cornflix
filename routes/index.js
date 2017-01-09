var ingredientsRoutes = require('./ingredients');
var apiMeals = require('./apiMeals');
var apiIngredients = require('./apiIngredients');
var express = require( 'express' );
var app = express();

app.use('/ingredients', ingredientsRoutes);
app.use('/api/meals', apiMeals);
app.use('/api/ingredients/', apiIngredients);

app.post( '/api/profile/searchByEmail', function( req, res ) {
    console.log("on est dedans");
    console.log(JSON.parse(req.body.email));
    Meal.find( {
        user_id: { "$regex": JSON.parse(req.body.email), "$options": "i" }
    }, function( err, meals ) {
        if ( err ) res.send( err );
        console.log(meals);
        res.json( meals );
    } );
} )

app.post( '/api/feedbacks', function( req, res ) {
    Feedback.create( req.body,
        function( err, feedback ) {
            if ( err ) {
                console.log( err );
                return res.send( err );
            }
            res.send( feedback );
        } );
} )