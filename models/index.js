var mongoose = require( 'mongoose' );

var Meal = mongoose.Schema ({
    user_id: String,
    public: Boolean,
    name: String,
    description: String,
    ingredients: [ { _id: String, name: String, weight: Number } ]
} );

var Feedback = mongoose.Schema ({
    mail: String,
    category: String,
    type: String,
    comment: String
} );

var Ingredient = mongoose.Schema ({
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

mongoose.connect( 'mongodb://localhost:27017/food' );

var Meal = mongoose.model('meals', Meal);
var Feedback = mongoose.model('feedbacks', Feedback);
var Ingredient = mongoose.model('ingredients', Ingredient);

exports.Meal = Meal;
exports.Feedback = Feedback;
exports.Ingredient = Ingredient;