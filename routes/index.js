var ingredientsRoutes = require('./ingredients');
var apiMeals = require('./apiMeals');
var apiIngredients = require('./apiIngredients');
var express = require( 'express' );
var router = express().Router;

router.use('/ingredients', ingredientsRoutes);
router.use('/api/meals', apiMeals);
router.use('/api/ingredients/', apiIngredients);

router.post( '/api/profile/searchByEmail', function( req, res ) {
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

router.post( '/api/feedbacks', function( req, res ) {
    Feedback.create( req.body,
        function( err, feedback ) {
            if ( err ) {
                console.log( err );
                return res.send( err );
            }
            res.send( feedback );
        } );
} )

module.exports = router;