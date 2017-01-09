var routes = require('./index');
var model = require('../models/index');

var Meal = new model.Meal();
var express = require('express');
var router = express.Router();

router.get( '/', function( req, res ) {
    Meal.find( function( err, meals ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
        res.json( meals );
    } );
} );

router.post( '/', function( req, res ) {
    Meal.create( req.body,
        function( err, meal ) {
            if ( err ) {
                console.log( err );
                return res.send( err );
            }
            res.send( meal );
        } );
} );

router.delete( '/:meal_id', function( req, res ) {
    Meal.remove( {
        _id: req.params.meal_id
    }, function( err, result ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
        Meal.find( function( err, meals ) {
            if ( err ) {
                console.log( err );
                return res.send( err );
            }
            res.json( meals );
        } );
    } );
} );

router.post( '/searchByName', function( req, res ) {
    Meal.find( {
        name: { "$regex": req.body.name, "$options": "i" }
    }, function( err, meals ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
        res.json( meals );
    } );
} )

module.exports = router;