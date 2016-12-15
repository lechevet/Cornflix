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

        //if ( $scope.addedIngredients.length < 1 ) return;

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
        console.log( "add ingredient" );
        for ( i in $scope.ingredientSearchResult ) {
            if ( $scope.ingredientSearchResult[ i ]._id == id ) {
                $scope.addedIngredients.push( $scope.ingredientSearchResult[ i ] );

                $scope.bilan.sodium = $scope.bilan.sodium == null ? $scope.ingredientSearchResult[ i ].sodium_mg : Math.round( ( $scope.bilan.sodium + $scope.ingredientSearchResult[ i ].sodium_mg ) * 100 ) / 100;
                $scope.bilan.magnesium = $scope.bilan.magnesium == null ? $scope.ingredientSearchResult[ i ].magnesium_mg : Math.round( ( $scope.bilan.magnesium + $scope.ingredientSearchResult[ i ].magnesium_mg ) * 100 ) / 100;
                $scope.bilan.phosphore = $scope.bilan.phosphore == null ? $scope.ingredientSearchResult[ i ].phosphore_mg : Math.round( ( $scope.bilan.phosphore + $scope.ingredientSearchResult[ i ].phosphore_mg ) * 100 ) / 100;
                $scope.bilan.potassium = $scope.bilan.potassium == null ? $scope.ingredientSearchResult[ i ].potassium_mg : Math.round( ( $scope.bilan.potassium + $scope.ingredientSearchResult[ i ].potassium_mg ) * 100 ) / 100;
                $scope.bilan.calcium = $scope.bilan.calcium == null ? $scope.ingredientSearchResult[ i ].calcium_mg : Math.round( ( $scope.bilan.calcium + $scope.ingredientSearchResult[ i ].calcium_mg ) * 100 ) / 100;
                $scope.bilan.manganese = $scope.bilan.manganese == null ? $scope.ingredientSearchResult[ i ].manganese_mg : Math.round( ( $scope.bilan.manganese + $scope.ingredientSearchResult[ i ].manganese_mg ) * 100 ) / 100;
                $scope.bilan.fer = $scope.bilan.fer == null ? $scope.ingredientSearchResult[ i ].fer_mg : Math.round( ( $scope.bilan.fer + $scope.ingredientSearchResult[ i ].fer_mg ) * 100 ) / 100;
                $scope.bilan.cuivre = $scope.bilan.cuivre == null ? $scope.ingredientSearchResult[ i ].cuivre_mg : Math.round( ( $scope.bilan.cuivre + $scope.ingredientSearchResult[ i ].cuivre_mg ) * 100 ) / 100;
                $scope.bilan.zinc = $scope.bilan.zinc == null ? $scope.ingredientSearchResult[ i ].zinc_mg : Math.round( ( $scope.bilan.zinc + $scope.ingredientSearchResult[ i ].zinc_mg ) * 100 ) / 100;
                $scope.bilan.selenium = $scope.bilan.selenium == null ? $scope.ingredientSearchResult[ i ].selenium_microg : Math.round( ( $scope.bilan.selenium + $scope.ingredientSearchResult[ i ].selenium_microg ) * 100 ) / 100;
                $scope.bilan.iode = $scope.bilan.iode == null ? $scope.ingredientSearchResult[ i ].iode_microg : Math.round( ( $scope.bilan.iode + $scope.ingredientSearchResult[ i ].iode_microg ) * 100 ) / 100;
                $scope.bilan.proteine = $scope.bilan.proteine == null ? $scope.ingredientSearchResult[ i ].proteine_g : Math.round( ( $scope.bilan.proteine + $scope.ingredientSearchResult[ i ].proteine_g ) * 100 ) / 100;
                $scope.bilan.proteine_brute = $scope.bilan.proteine_brute == null ? $scope.ingredientSearchResult[ i ].proteine_brute_g : Math.round( ( $scope.bilan.proteine_brute + $scope.ingredientSearchResult[ i ].proteine_brute_g ) * 100 ) / 100;
                $scope.bilan.glucide = $scope.bilan.glucide == null ? $scope.ingredientSearchResult[ i ].glucide_g : Math.round( ( $scope.bilan.glucide + $scope.ingredientSearchResult[ i ].glucide_g ) * 100 ) / 100;
                $scope.bilan.sucre = $scope.bilan.sucre == null ? $scope.ingredientSearchResult[ i ].sucre_g : Math.round( ( $scope.bilan.sucre + $scope.ingredientSearchResult[ i ].sucre_g ) * 100 ) / 100;
                $scope.bilan.energie_kj = $scope.bilan.energie_kj == null ? $scope.ingredientSearchResult[ i ].energie_kj : Math.round( ( $scope.bilan.energie_kj + $scope.ingredientSearchResult[ i ].energie_kj ) * 100 ) / 100;
                $scope.bilan.energie_kcal = $scope.bilan.energie_kcal == null ? $scope.ingredientSearchResult[ i ].energie_kcal : Math.round( ( $scope.bilan.energie_kcal + $scope.ingredientSearchResult[ i ].energie_kcal ) * 100 ) / 100;
                $scope.bilan.amidon = $scope.bilan.amidon == null ? $scope.ingredientSearchResult[ i ].amidon_g : Math.round( ( $scope.bilan.amidon + $scope.ingredientSearchResult[ i ].amidon_g ) * 100 ) / 100;
                $scope.bilan.energie_jones_kj = $scope.bilan.energie_jones_kj == null ? $scope.ingredientSearchResult[ i ].energie_jones_kj : Math.round( ( $scope.bilan.energie_jones_kj + $scope.ingredientSearchResult[ i ].energie_jones_kj ) * 100 ) / 100;
                $scope.bilan.energie_jones_kcal = $scope.bilan.energie_jones_kcal == null ? $scope.ingredientSearchResult[ i ].energie_jones_kcal : Math.round( ( $scope.bilan.energie_jones_kcal + $scope.ingredientSearchResult[ i ].energie_jones_kcal ) * 100 ) / 100;
                $scope.bilan.polyols = $scope.bilan.polyols == null ? $scope.ingredientSearchResult[ i ].polyols_g : Math.round( ( $scope.bilan.polyols + $scope.ingredientSearchResult[ i ].polyols_g ) * 100 ) / 100;
                $scope.bilan.fibre = $scope.bilan.fibre == null ? $scope.ingredientSearchResult[ i ].fibre_g : Math.round( ( $scope.bilan.fibre + $scope.ingredientSearchResult[ i ].fibre_g ) * 100 ) / 100;
                $scope.bilan.eau = $scope.bilan.eau == null ? $scope.ingredientSearchResult[ i ].eau_g : Math.round( ( $scope.bilan.eau + $scope.ingredientSearchResult[ i ].eau_g ) * 100 ) / 100;
                $scope.bilan.lipide = $scope.bilan.lipide == null ? $scope.ingredientSearchResult[ i ].lipide_g : Math.round( ( $scope.bilan.lipide + $scope.ingredientSearchResult[ i ].lipide_g ) * 100 ) / 100;
                $scope.bilan.acide_gras_sature = $scope.bilan.acide_gras_sature == null ? $scope.ingredientSearchResult[ i ].acide_gras_sature_g : Math.round( ( $scope.bilan.acide_gras_sature + $scope.ingredientSearchResult[ i ].acide_gras_sature_g ) * 100 ) / 100;
                $scope.bilan.beta_carotene = $scope.bilan.beta_carotene == null ? $scope.ingredientSearchResult[ i ].beta_carotene_microg : Math.round( ( $scope.bilan.beta_carotene + $scope.ingredientSearchResult[ i ].beta_carotene_microg ) * 100 ) / 100;
                $scope.bilan.vitamine_d = $scope.bilan.vitamine_d == null ? $scope.ingredientSearchResult[ i ].vitamine_d_microg : Math.round( ( $scope.bilan.vitamine_d + $scope.ingredientSearchResult[ i ].vitamine_d_microg ) * 100 ) / 100;
                $scope.bilan.vitamine_e = $scope.bilan.vitamine_e == null ? $scope.ingredientSearchResult[ i ].vitamine_e_mg : Math.round( ( $scope.bilan.vitamine_e + $scope.ingredientSearchResult[ i ].vitamine_e_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_k1 = $scope.bilan.vitamine_k1 == null ? $scope.ingredientSearchResult[ i ].vitamine_k1_microg : Math.round( ( $scope.bilan.vitamine_k1 + $scope.ingredientSearchResult[ i ].vitamine_k1_microg ) * 100 ) / 100;
                $scope.bilan.vitamine_k2 = $scope.bilan.vitamine_k2 == null ? $scope.ingredientSearchResult[ i ].vitamine_k2_microg : Math.round( ( $scope.bilan.vitamine_k2 + $scope.ingredientSearchResult[ i ].vitamine_k2_microg ) * 100 ) / 100;
                $scope.bilan.vitamine_c = $scope.bilan.vitamine_c == null ? $scope.ingredientSearchResult[ i ].vitamine_c_mg : Math.round( ( $scope.bilan.vitamine_c + $scope.ingredientSearchResult[ i ].vitamine_c_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_b1 = $scope.bilan.vitamine_b1 == null ? $scope.ingredientSearchResult[ i ].vitamine_b1_mg : Math.round( ( $scope.bilan.vitamine_b1 + $scope.ingredientSearchResult[ i ].vitamine_b1_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_b2 = $scope.bilan.vitamine_b2 == null ? $scope.ingredientSearchResult[ i ].vitamine_b2_mg : Math.round( ( $scope.bilan.vitamine_b2 + $scope.ingredientSearchResult[ i ].vitamine_b2_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_b3 = $scope.bilan.vitamine_b3 == null ? $scope.ingredientSearchResult[ i ].vitamine_b3 : Math.round( ( $scope.bilan.vitamine_b3 + $scope.ingredientSearchResult[ i ].vitamine_b3 ) * 100 ) / 100;
                $scope.bilan.vitamine_b5 = $scope.bilan.vitamine_b5 == null ? $scope.ingredientSearchResult[ i ].vitamine_b5_mg : Math.round( ( $scope.bilan.vitamine_b5 + $scope.ingredientSearchResult[ i ].vitamine_b5_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_b6 = $scope.bilan.vitamine_b6 == null ? $scope.ingredientSearchResult[ i ].vitamine_b6_mg : Math.round( ( $scope.bilan.vitamine_b6 + $scope.ingredientSearchResult[ i ].vitamine_b6_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_b12 = $scope.bilan.vitamine_b12 == null ? $scope.ingredientSearchResult[ i ].vitamine_b12_microg : Math.round( ( $scope.bilan.vitamine_b12 + $scope.ingredientSearchResult[ i ].vitamine_b12_microg ) * 100 ) / 100;
                $scope.bilan.vitamine_b9 = $scope.bilan.vitamine_b9 == null ? $scope.ingredientSearchResult[ i ].vitamine_b9_microg : Math.round( ( $scope.bilan.vitamine_b9 + $scope.ingredientSearchResult[ i ].vitamine_b9_microg ) * 100 ) / 100;
                $scope.bilan.alcool = $scope.bilan.alcool == null ? $scope.ingredientSearchResult[ i ].alcool_g : Math.round( ( $scope.bilan.alcool + $scope.ingredientSearchResult[ i ].alcool_g ) * 100 ) / 100;
                $scope.bilan.cholesterol = $scope.bilan.cholesterol == null ? $scope.ingredientSearchResult[ i ].cholesterol_mg : Math.round( ( $scope.bilan.cholesterol + $scope.ingredientSearchResult[ i ].cholesterol_mg ) * 100 ) / 100;
            }
        }
        console.log( "end" );
    };

    $scope.deleteAddedIngredient = function( id ) {
        console.log( "delete ingredient" );
        for ( i in $scope.addedIngredients ) {
            if ( $scope.addedIngredients[ i ]._id == id ) {

                $scope.bilan.sodium = Math.round( ( $scope.bilan.sodium - $scope.addedIngredients[ i ].sodium_mg ) * 100 ) / 100;
                $scope.bilan.magnesium = Math.round( ( $scope.bilan.magnesium - $scope.addedIngredients[ i ].magnesium_mg ) * 100 ) / 100;
                $scope.bilan.phosphore = Math.round( ( $scope.bilan.phosphore - $scope.addedIngredients[ i ].phosphore_mg ) * 100 ) / 100;
                $scope.bilan.potassium = Math.round( ( $scope.bilan.potassium - $scope.addedIngredients[ i ].potassium_mg ) * 100 ) / 100;
                $scope.bilan.calcium = Math.round( ( $scope.bilan.calcium - $scope.addedIngredients[ i ].calcium_mg ) * 100 ) / 100;
                $scope.bilan.manganese = Math.round( ( $scope.bilan.manganese - $scope.addedIngredients[ i ].manganese_mg ) * 100 ) / 100;
                $scope.bilan.fer = Math.round( ( $scope.bilan.fer - $scope.addedIngredients[ i ].fer_mg ) * 100 ) / 100;
                $scope.bilan.cuivre = Math.round( ( $scope.bilan.cuivre - $scope.addedIngredients[ i ].cuivre_mg ) * 100 ) / 100;
                $scope.bilan.zinc = Math.round( ( $scope.bilan.zinc - $scope.addedIngredients[ i ].zinc_mg ) * 100 ) / 100;
                $scope.bilan.selenium = Math.round( ( $scope.bilan.selenium - $scope.addedIngredients[ i ].selenium_microg ) * 100 ) / 100;
                $scope.bilan.iode = Math.round( ( $scope.bilan.iode - $scope.addedIngredients[ i ].iode_microg ) * 100 ) / 100;
                $scope.bilan.proteine = Math.round( ( $scope.bilan.proteine - $scope.addedIngredients[ i ].proteine_g ) * 100 ) / 100;
                $scope.bilan.proteine_brute = Math.round( ( $scope.bilan.proteine_brute - $scope.addedIngredients[ i ].proteine_brute_g ) * 100 ) / 100;
                $scope.bilan.glucide = Math.round( ( $scope.bilan.glucide - $scope.addedIngredients[ i ].glucide_g ) * 100 ) / 100;
                $scope.bilan.sucre = Math.round( ( $scope.bilan.sucre - $scope.addedIngredients[ i ].sucre_g ) * 100 ) / 100;
                $scope.bilan.energie_kj = Math.round( ( $scope.bilan.energie_kj - $scope.addedIngredients[ i ].energie_kj ) * 100 ) / 100;
                $scope.bilan.energie_kcal = Math.round( ( $scope.bilan.energie_kcal - $scope.addedIngredients[ i ].energie_kcal ) * 100 ) / 100;
                $scope.bilan.amidon = Math.round( ( $scope.bilan.amidon - $scope.addedIngredients[ i ].amidon_g ) * 100 ) / 100;
                $scope.bilan.energie_jones_kj = Math.round( ( $scope.bilan.energie_jones_kj - $scope.addedIngredients[ i ].energie_jones_kj ) * 100 ) / 100;
                $scope.bilan.energie_jones_kcal = Math.round( ( $scope.bilan.energie_jones_kcal - $scope.addedIngredients[ i ].energie_jones_kcal ) * 100 ) / 100;
                $scope.bilan.polyols = Math.round( ( $scope.bilan.polyols - $scope.addedIngredients[ i ].polyols_g ) * 100 ) / 100;
                $scope.bilan.fibre = Math.round( ( $scope.bilan.fibre - $scope.addedIngredients[ i ].fibre_g ) * 100 ) / 100;
                $scope.bilan.eau = Math.round( ( $scope.bilan.eau - $scope.addedIngredients[ i ].eau_g ) * 100 ) / 100;
                $scope.bilan.lipide = Math.round( ( $scope.bilan.lipide - $scope.addedIngredients[ i ].lipide_g ) * 100 ) / 100;
                $scope.bilan.acide_gras_sature = Math.round( ( $scope.bilan.acide_gras_sature - $scope.addedIngredients[ i ].acide_gras_sature_g ) * 100 ) / 100;
                $scope.bilan.beta_carotene = Math.round( ( $scope.bilan.beta_carotene - $scope.addedIngredients[ i ].beta_carotene_microg ) * 100 ) / 100;
                $scope.bilan.vitamine_d = Math.round( ( $scope.bilan.vitamine_d - $scope.addedIngredients[ i ].vitamine_d_microg ) * 100 ) / 100;
                $scope.bilan.vitamine_e = Math.round( ( $scope.bilan.vitamine_e - $scope.addedIngredients[ i ].vitamine_e_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_k1 = Math.round( ( $scope.bilan.vitamine_k1 - $scope.addedIngredients[ i ].vitamine_k1_microg ) * 100 ) / 100;
                $scope.bilan.vitamine_k2 = Math.round( ( $scope.bilan.vitamine_k2 - $scope.addedIngredients[ i ].vitamine_k2_microg ) * 100 ) / 100;
                $scope.bilan.vitamine_c = Math.round( ( $scope.bilan.vitamine_c - $scope.addedIngredients[ i ].vitamine_c_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_b1 = Math.round( ( $scope.bilan.vitamine_b1 - $scope.addedIngredients[ i ].vitamine_b1_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_b2 = Math.round( ( $scope.bilan.vitamine_b2 - $scope.addedIngredients[ i ].vitamine_b2_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_b3 = Math.round( ( $scope.bilan.vitamine_b3 - $scope.addedIngredients[ i ].vitamine_b3 ) * 100 ) / 100;
                $scope.bilan.vitamine_b5 = Math.round( ( $scope.bilan.vitamine_b5 - $scope.addedIngredients[ i ].vitamine_b5_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_b6 = Math.round( ( $scope.bilan.vitamine_b6 - $scope.addedIngredients[ i ].vitamine_b6_mg ) * 100 ) / 100;
                $scope.bilan.vitamine_b12 = Math.round( ( $scope.bilan.vitamine_b12 - $scope.addedIngredients[ i ].vitamine_b12_microg ) * 100 ) / 100;
                $scope.bilan.vitamine_b9 = Math.round( ( $scope.bilan.vitamine_b9 - $scope.addedIngredients[ i ].vitamine_b9_microg ) * 100 ) / 100;
                $scope.bilan.alcool = Math.round( ( $scope.bilan.alcool - $scope.addedIngredients[ i ].alcool_g ) * 100 ) / 100;
                $scope.bilan.cholesterol = Math.round( ( $scope.bilan.cholesterol - $scope.addedIngredients[ i ].cholesterol_mg ) * 100 ) / 100;

                $scope.addedIngredients.splice( i, 1 );
            }
        }
        console.log( "end" );
    };

    $scope.setPublic = function() {
        if ( $scope.publicMeal == "true" ) $scope.publicMeal = "false";
        else $scope.publicMeal = "true";
        console.log( $scope.publicMeal );
    };

}
