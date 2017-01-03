var cornflix = angular.module( 'cornflix', [ 'ui.router' ] );

var cornflix = angular.module( 'cornflix', [ 'ui.router' ] )
    .config( function( $httpProvider, $stateProvider, $urlRouterProvider, $routeProvider, $locationProvider ) {

        // Route 404
        // Si l'URL demandé n'est pas présent dans le stateProvider,
        // on retourne sur l'URL 404
        $urlRouterProvider.otherwise( '/' );

        $stateProvider
            .state( 'home', {
                url: '/',
                templateUrl: 'home.html'
            } )
            .state( 'meals', {
                url: '/meals',
                templateUrl: 'meals.html'
            } )
            .state( 'createMeal', {
                url: '/createMeal',
                templateUrl: 'createMeal.html'
            } );

        // use the HTML5 History API
        $locationProvider.html5Mode( true );
    } );

//functions here
function mainController( $scope, $http ) {
    $scope.userId = 0; /////////    A SUPPRIMER
    $scope.formData = {};
    $scope.formCreateMeal = {};
    $scope.formIngredientSearch = {};
    $scope.formMealSearch = {};
    $scope.addedIngredients = [];
    $scope.addedMeals = [];
    $scope.publicMeal = "true";

    $scope.bilan = {};

    $http.get( '/api/meals' )
        .success( function( data ) {
            $scope.meals = data;
            //console.log( data );
        } )
        .error( function( data ) {
            console.log( data );
        } );

    //  when submitting the add form, send meal to the node api
    $scope.createMeal = function() {

        var i = [];
        for ( j in $scope.addedIngredients )  {
            i.push( {
                _id: $scope.addedIngredients[ j ]._id,
                weight: $scope.addedIngredients[ j ].weight
            } );
        }
        var meal = {
            user_id: $scope.userId,
            public: $scope.publicMeal,
            name: $scope.formCreateMeal.name,
            description: $scope.formCreateMeal.description,
            ingredients: i
        }
        console.log( meal );
        $http.post( '/api/meals', JSON.stringify( meal ) )
            .success( function( data ) {
                alert( "________   Meal created !   ________" )
            } )
            .error( function( data ) {
                console.log( 'Error: ' + data );
            } );
    };

    //  delete a meal
    $scope.deleteMeal = function( id ) {
        $http.delete( '/api/meals/' + id )
            .success( function( data ) {
                $scope.meals = data;
                console.log( data );
            } )
            .error( function( data ) {
                console.log( 'Error: ' + data );
            } );
    };

    $scope.searchMealByName = function() {
        //if field empty get all
        if ( $scope.formMealSearch == "undefined" || $scope.formMealSearch.name == null || $scope.formMealSearch.name == "" ) $scope.formMealSearch.name = "";

        $http.post( '/api/meals/searchByName', $scope.formMealSearch )
            .success( function( data ) {
                $scope.formMealSearch = {};
                $scope.mealSearchResult = data;
                //console.log( data );
            } )
            .error( function( data ) {
                console.log( 'Error: ' + data );
            } );
    }

    $scope.addMeal = function( id ) {
        //cancel if their is already 2 meal
        if ( $scope.addedMeals.length > 1 ) return;

        //Check if the meal is already added
        for ( i in $scope.addedMeals ) {
            if ( $scope.addedMeals[ i ]._id == id ) {
                return; //cancel insertion
            }
        }
        console.log( "for" );
        //else
        for ( i in $scope.mealSearchResult ) {
            if ( $scope.mealSearchResult[ i ]._id == id ) {
                console.log( "meal found" );
                var meal = $scope.mealSearchResult[ i ];
                //meal.bilan = getMealBilan( meal.ingredients );
                getMealBilan( meal.ingredients, function( data ) {
                    console.log( "meal bilan end" );
                    meal.bilan = data;
                    $scope.addedMeals.push( meal );
                    console.log( "meal pushed" );
                } );
                //console.log( "meal bilan end" );
                //add to the array of added ingredients
                //$scope.addedMeals.push( meal );
                //console.log( "meal pushed" );
            }
        }
        console.log( "end for" );
    }

    function getMealBilan( ingredients, callback ) {
        console.log( "getMealBilan()" );
        var bilan = {};
        $http.post( '/api/ingredients/searchById', ingredients )
            .success( function( data ) {
                console.log( "find success" );
                var tmp = data[ 0 ];
                //var tmp = data;
                for ( i in tmp ) {
                    tmp[ i ].weight = ingredients[ i ].weight;
                }
                Object.keys( tmp[ 0 ] ).forEach( function( key, index ) {
                    //reset the property first
                    bilan[ key ] = 0;

                    //add every ingredients property by a ratio of its weight
                    for ( i in tmp ) {
                        bilan[ key ] += Math.round( ( bilan[ key ] + tmp[ i ][ key ] ) * 100 / 100 * tmp[ i ].weight / 100 );
                    }
                } );
                console.log( "return bilan" );
                callback( bilan );
            } )
            .error( function( data ) {
                console.log( 'Error : ' + data );
            } )
    };

    $scope.deleteAddedMeal = function( id ) {
        console.log( "delete meal" );
        //cycle through the ingredients
        for ( i in $scope.addedMeals ) {
            //if the selected ingredient corresponds to the lookup id
            if ( $scope.addedMeals[ i ]._id == id ) {
                $scope.addedMeals.splice( i, 1 );
                //$scope.refreshBilan();
            }
        }
        console.log( "end" );
    };

    //modifies the weight of an ingredient and refreshes the bilan
    $scope.setWeight = function( id, weight ) {
        //looking for the ingredient with the passed id
        for ( i in $scope.addedIngredients ) {
            if ( $scope.addedIngredients[ i ]._id == id ) {
                //setting new property
                $scope.addedIngredients[ i ].weight = weight;
            }
        }
        //refreshes the bilan
        $scope.refreshBilan();
    };

    //refreshes the interface and updates the bilan
    $scope.refreshBilan = function() {
        console.log( "Refreshing" );
        //if the list of added ingredients is empty, clear the bilan
        if ( $scope.addedIngredients[ 0 ] == null ) {
            //for each property of the bilan
            Object.keys( $scope.bilan ).forEach( function( key, index ) {

                //reset the property first
                $scope.bilan[ key ] = 0;
            } );
        }
        //normal refresh
        else {
            //for each property of the bilan
            Object.keys( $scope.addedIngredients[ 0 ] ).forEach( function( key, index ) {

                //reset the property first
                $scope.bilan[ key ] = 0;
                //add every ingredients property by a ratio of its weight
                for ( i in $scope.addedIngredients ) {
                    //DEBUG
                    //console.log(key + $scope.bilan[key] + " <- " + $scope.addedIngredients[i][key]);
                    $scope.bilan[ key ] += Math.round( ( $scope.bilan[ key ] + $scope.addedIngredients[ i ][ key ] ) * 100 / 100 * $scope.addedIngredients[ i ].weight / 100 );
                }
            } );
        }
    };

    //  get ingredients by name
    $scope.searchIngredientByName = function() {
        //if field empty get all
        if ( $scope.formIngredientSearch == "undefined" || $scope.formIngredientSearch.name == null || $scope.formIngredientSearch.name == "" ) $scope.formIngredientSearch.name = "";

        $http.post( '/api/ingredients/searchByName', $scope.formIngredientSearch )
            .success( function( data ) {
                $scope.formIngredientSearch = {};
                $scope.ingredientSearchResult = data;
                //console.log( data );
            } )
            .error( function( data ) {
                console.log( 'Error: ' + data );
            } );
    };

    //adds the ingredient : from ingredientSearchResult to addedIngredients
    $scope.addIngredient = function( id ) {
        //DEBUG
        console.log( "add ingredient" );
        //check if ingredient is already in the array
        for ( i in $scope.addedIngredients ) {
            if ( $scope.addedIngredients[ i ]._id == id ) {
                return; //cancel insertion
            }
        }
        for ( i in $scope.ingredientSearchResult ) {
            if ( $scope.ingredientSearchResult[ i ]._id == id ) {
                //if there is no weight, set it to 100g by default
                if ( $scope.ingredientSearchResult[ i ].weight == null ) {
                    $scope.ingredientSearchResult[ i ].weight = 100;
                }

                //add to the array of added ingredients
                $scope.addedIngredients.push( $scope.ingredientSearchResult[ i ] );
                //refresh interface
                $scope.refreshBilan();
            }
        }
        //console.log( "end" );
    };

    //removes an ingredient from the addedingredients array and refresh display
    $scope.deleteAddedIngredient = function( id ) {
        console.log( "delete ingredient" );
        //cycle through the ingredients
        for ( i in $scope.addedIngredients ) {
            //if the selected ingredient corresponds to the lookup id
            if ( $scope.addedIngredients[ i ]._id == id ) {
                $scope.addedIngredients.splice( i, 1 );
                $scope.refreshBilan();
            }
        }
        console.log( "end" );
    };


    //sets the scope to public
    $scope.setPublic = function() {
        if ( $scope.publicMeal == "true" ) $scope.publicMeal = "false";
        else $scope.publicMeal = "true";
        console.log( $scope.publicMeal );
    };

}
