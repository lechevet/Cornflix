var routes = require('./index');
var model = require('../models/index');
var express = require('express');
var router = express.Router();
var Ingredient = new model.Ingredient();

router.get( '/', function( req, res ) {
    Ingredient.find( function( err, ingredients ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
        res.json( ingredients );
    } );
} );

router.get( '/:ingredient_name', function( req, res ) {
    Ingredient.find( {
        name: req.params.ingredient_name
    }, function( err, ingredients ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
            res.json( ingredients );
    } );
} );

module.exports = router;