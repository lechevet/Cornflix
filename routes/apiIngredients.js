var routes = require('./index');
var model = require('../models/index');
var express = require('express');
var router = express.Router();

router.post( '/searchById', function( req, res ) {
    var ingredients = [];
    var i = 0;
    for ( var j = 0; j < req.body.length; j++ ) {
        Ingredient.findOne( {
            _id: req.body[ j ]._id
        }, function( err, ingredient ) {
            if ( err ) {
                console.log( err );
            }
            i++;
            ingredients.push( ingredient );
            if ( i >= req.body.length ) {
                res.json( ingredients );
            }
        } );
    }
} )

router.post( '/searchByName', function( req, res ) {
    Ingredient.find( {
        name: { "$regex": req.body.name, "$options": "i" }
    }, function( err, ingredients ) {
        if ( err ) {
            console.log( err );
            return res.send( err );
        }
        res.json( ingredients );
    } );
} )

module.exports = router;