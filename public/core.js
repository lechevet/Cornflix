var cornflix = angular.module( 'cornflix', [ 'ui.router' ] );

cornflix.config( [ '$httpProvider', '$stateProvider', '$urlRouterProvider',
    function( $httpProvider, $stateProvider, $urlRouterProvider ) {

        $stateProvider
            .state( 'meals', {
                url: '/meals',
                templateUrl: 'meals.html'
            } )
            .state( 'createMeal', {
                url: '/createMeal',
                templateUrl: 'createMeal.html'
            } );

        $urlRouterProvider.otherwise( '/createMeal' );
    }
] );

//functions here
function mainController( $scope, $http ) {
    $scope.userId = 0; /////////    A SUPPRIMER
    $scope.formData = {};
    $scope.formCreateMeal = {};
    $scope.formIngredientSearch = {};
    $scope.addedIngredients = [];
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

    /*$http.get( '/api/ingredients/count' )
        .success( function( data ) {
            $scope.nbIngredients = data;
        } )
        .error( function( data ) {
            console.log( 'Error: ' + data );
        } );*/

    //  when submitting the add form, send meal to the node api
    $scope.createMeal = function() {

        var i = [];
        for ( j in $scope.addedIngredients )  {
            i.push( $scope.addedIngredients[ j ]._id );
            console.log( "ingredients id " + j + " => " + $scope.addedIngredients[ j ]._id );
        }
        console.log( "public => " + $scope.publicMeal );
        console.log( "meal name => " + $scope.formCreateMeal.name );
        console.log( "meal description => " + $scope.formCreateMeal.description );
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

    //modifies the weight of an ingredient and refreshes the bilan
    $scope.setWeight = function (id, weight){
      //looking for the ingredient with the passed id
      for (i in $scope.addedIngredients){
        if($scope.addedIngredients[i]._id == id){
          //setting new property
          $scope.addedIngredients[i].weight = weight;
        }
      }
      //refreshes the bilan
      $scope.refreshBilan();
    };

    //refreshes the interface and updates the bilan
    $scope.refreshBilan = function(){
      console.log("Refreshing");
      //if the list of added ingredients is empty, clear the bilan
      if ($scope.addedIngredients[0] == null ){
        //for each property of the bilan
        Object.keys($scope.bilan).forEach(function(key,index) {

              //reset the property first
              $scope.bilan[key] = 0;
          });
      }
      //normal refresh
      else{
          //for each property of the bilan
          Object.keys($scope.addedIngredients[0]).forEach(function(key,index) {

                //reset the property first
                $scope.bilan[key] = 0;
                //add every ingredients property by a ratio of its weight
                for (i in $scope.addedIngredients){
                  //DEBUG
                  //console.log(key + $scope.bilan[key] + " <- " + $scope.addedIngredients[i][key]);
                  $scope.bilan[key] += Math.round( ( $scope.bilan[key] + $scope.addedIngredients[i][key] ) * 100 / 100 * $scope.addedIngredients[i].weight / 100);
                }
            });
          }
      };

    //  get ingredients by name
    $scope.searchIngredientByName = function() {
        $http.post( '/api/ingredients/search', $scope.formIngredientSearch )
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
        for ( i in $scope.addedIngredients ){
          if ($scope.addedIngredients[i]._id == id){
            return; //cancel insertion
          }
        }
        for ( i in $scope.ingredientSearchResult ) {
            if ( $scope.ingredientSearchResult[ i ]._id == id ) {
              //if there is no weight, set it to 100g by default
              if ( $scope.ingredientSearchResult[i].weight == null){
                $scope.ingredientSearchResult[i].weight = 100;
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
                $scope.addedIngredients.splice(i, 1);
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
