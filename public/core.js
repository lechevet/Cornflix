var cornflix = angular.module('cornflix', ['ui.router'])
  .config(function($httpProvider, $stateProvider, $urlRouterProvider, $routeProvider, $locationProvider) {

    // Route 404
    // Si l'URL demandé n'est pas présent dans le stateProvider,
    // on retourne sur l'URL 404
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'home.html'
        })
        .state('meals', {
            url: '/meals',
            templateUrl: 'meals.html'
        })
        .state( 'createMeal', {
            url: '/createMeal',
            templateUrl: 'createMeal.html'
        });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});

function mainController( $scope, $http ) {
    $scope.formData = {};
    $scope.formIngredientSearch = {};
    $scope.addedIngredients = [];

    $http.get( '/api/meals' )
        .success( function( data ) {
            $scope.meals = data;
            console.log( data );
        } )
        .error( function( data ) {
            console.log( data );
        } );

    $http.get( '/api/ingredients/count' )
        .success( function( data ) {
            console.log( 'test' );
            $scope.nbIngredients = data;
        } )
        .error( function( data ) {
            console.log( 'Error: ' + data );
        } );

    //  when submitting the add form, send meal to the node api
    $scope.createMeal = function() {
        $http.post( '/api/meals', $scope.formData )
            .success( function( data ) {
                $scope.formData = {};
                $scope.meals = data;
                console.log( data );
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

    $scope.addIngredient = function( id ) {
        for ( i in $scope.ingredientSearchResult ) {
            if ( $scope.ingredientSearchResult[ i ]._id == id ) {
                $scope.addedIngredients.push( $scope.ingredientSearchResult[ i ] );
                console.log( "add" );
            }
        }
    };

    $scope.deleteAddedIngredient = function( id ) {
        for ( i in $scope.addedIngredients ) {
            if ( $scope.addedIngredients[ i ]._id == id ) {
                $scope.addedIngredients.splice( i, 1 );
                console.log( "rmv" );
            }
        }
    }

}
