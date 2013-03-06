var config = require('./config'),
    geogoose = require('./geogoose'),
    console = require('./ext-console'),
    mongoose = require('mongoose'),
    mongooseTypes = require("mongoose-types"),
    _ = require('cloneextend'),
    util = require('util');

var useTimestamps = function (schema, options) {
    schema.add({
        createdAt: Date
      , updatedAt: Date
    });
    schema.pre('save', function (next) {    
      if (!this.createdAt) {
        this.createdAt = this.updatedAt = new Date;
      } else {
        this.updatedAt = new Date;
      }
      next();
    });
};

mongooseTypes.loadTypes(mongoose);
//useTimestamps = mongooseTypes.useTimestamps;

var User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: {type: mongoose.SchemaTypes.Email, required: true}   
}));

User.schema.plugin(useTimestamps);

var Job = mongoose.model('Job', new mongoose.Schema({
    createdAt: Date,
    updatedAt: Date,
    type: {type: String, enum: [config.JobType.IMPORT, config.JobType.REDUCE], required: true},
    status: {type: String, enum: [config.JobStatus.ACTIVE, config.JobStatus.IDLE], required: true, default: config.MapLayerType.POINTS},
}));

Job.schema.plugin(useTimestamps);

/*
var Point = mongoose.model('Point', new mongoose.Schema({
    pointCollection: { type: mongoose.Schema.ObjectId, ref: 'PointCollection', required: true, index: 1 },
    importJob: { type: mongoose.Schema.ObjectId, ref: 'Job', required: false, index: 1 },
    loc: {type: [Number], index: '2d', required: true },
    val: {type: Number, index: 1},
    label: String,
    description: String,
    url: String,
    datetime: {type: Date, index: 1},
    sourceId: {type: mongoose.Schema.Types.Mixed, index: 1},
    incField: {type: mongoose.Schema.Types.Mixed, index: 1},
    createdAt: Date,
    updatedAt: Date
}));

Point.schema.plugin(useTimestamps);
Point.schema.index({loc: '2d', pointCollection: 1})
*/

var colorMatch = /^#([a-fA-F0-9]{2}){3}$/;

var LayerOptions = mongoose.model('LayerOptions', new mongoose.Schema({
    htmlRenderer: {type: String, required: false, default: "", enum: ["", "Canvas", "SVG"]},
    enabled: {type: Boolean, required: true, default: true},
    public: {type: Boolean, required: true, default: true},
    featureType: {type: String, required: true, enum: [
        config.FeatureType.POINTS, config.FeatureType.SQUARE_TILES, config.FeatureType.BUBBLES, config.FeatureType.SHAPES]},
    colorType: {type: String, required: true, default: config.ColorType.LINEAR_GRADIENT},
    //colorPalettes: {type: [ColorPalette.schema], index: 1},
    colors: [{
        color: {type: String, required: true, match: colorMatch},
        position: {type: String, match: /^[0-9]+(\.[0-9]+)?%?$/},
        interpolation: {type: String, enum: ['lerpRGB', 'threshold', ''], required: false},
        label: String,
        description: String
    }],
    colorLabelColor: {type: String, match: colorMatch},
    strokeColor: {type: String, match: colorMatch},
    reduction: String,
    opacity: {type: Number, required: true, min: 0, max: 1},
    strokeOpacity: {type: Number, min: 0, max: 1},
    strokeWidth: {type: Number, min: config.MIN_STROKE_WIDTH, max: config.MAX_STROKE_WIDTH},
    strokeDashstyle: {type: String},
    strokeLinecap: {type: String},
    featureSizeAttr: {type: String},
    featureColorAttr: {type: String},
    numericAttr: {type: String},
    datetimeAttr: {type: String},
    featureSize: {type: Number, min: config.MIN_FEATURE_SIZE, max: config.MAX_FEATURE_SIZE},
    minFeatureSize: {type: Number, min: config.MIN_FEATURE_SIZE, max: config.MAX_FEATURE_SIZE},
    datetimeFormat: String,
    valFormat: [{
        unit: {type: String, required: true},
        eq: {type: String, required: true},
        formatString: String
    }],
    filterQuery: mongoose.Schema.Types.Mixed,
    queryOptions: mongoose.Schema.Types.Mixed,
    title: String,
    unit: String,
    description: String,
    histogram: {type: Boolean, default: true},
    itemTitle: String,
    itemTitlePlural: String,
    cropDistribution: Boolean
}));

LayerOptions.schema.path('colors').validate(function (value) {
    return value.length > 0;
}, 'At least one color is required.');

/*
PointCollection = mongoose.model('PointCollection', new mongoose.Schema({
    title: String,
    description: String,
    source: String,
    unit: String,
    isNumeric: {type: Boolean, default: true},
    maxVal: Number,
    minVal: Number,
    maxIncField: { type: mongoose.Schema.Types.Mixed, index: 1 },
    importParams: mongoose.Schema.Types.Mixed,
    timebased: Boolean,
    gridSize: Number,
    defaults: { type: mongoose.Schema.ObjectId, ref: 'LayerOptions', index: 1 },
    active: Boolean,
    status: String,
    progress: Number,
    numBusy: Number,
    reduce: Boolean,
    maxReduceZoom: Number,
    sync: Boolean,
    cropDistribution: Boolean,
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', index: 1 },
    modifiedBy: { type: mongoose.Schema.ObjectId, ref: 'User', index: 1 },
    createdAt: Date,
    updatedAt: Date,
    lastReducedAt: Date,
    linkedPointCollection: { type: mongoose.Schema.ObjectId, ref: 'PointCollection', required: false, index: 1 },
}));

PointCollection.schema.plugin(useTimestamps);
*/

var MapLayerSchema = new mongoose.Schema({
 //   _id: { type: mongoose.Schema.ObjectId },
    featureCollection: { type: mongoose.Schema.ObjectId, ref: 'GeoFeatureCollection', index: 1 },
    layerOptions: { type: mongoose.Schema.ObjectId, ref: 'LayerOptions', index: 1 },
    type: {type: String, enum: [config.MapLayerType.POINTS, config.MapLayerType.SHAPES], required: true, default: config.MapLayerType.POINTS},
    position: Number
});


var Map = mongoose.model('Map', new mongoose.Schema({
    active: {type: Boolean, default: true},
    title: {type: String, required: true},
    description: String,
    author: String,
    linkURL: String,
    linkTitle: String,
    twitter: String,
    displayInfo: Boolean,
    adminslug: {type: String, required: true, index: {unique: true}},
    publicslug: {type: String, required: true, index: {unique: true}},
    host: {type: String, required: false, index: {unique: true, sparse: true}},
    featured: {type: Number, default: 0}, 
    initialArea: {
        center: [Number, Number],
        zoom: Number
    },
    viewOptions: {
        viewName: String,
        viewBase: String,
        viewStyle: String
    },
    // TODO: Enforce privacy (currently unused because no user login required)
    status: {type: String, enum: [config.MapStatus.PRIVATE, config.MapStatus.PUBLIC], required: true, default: config.MapStatus.PUBLIC},
    layers: [MapLayerSchema],
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', index: 1 },
    modifiedBy: { type: mongoose.Schema.ObjectId, ref: 'User', index: 1 },
    createdAt: Date,
    updatedAt: Date,
    tour: {
        steps: [{
        layers: [Number],
        title: String,
        body: String
        }]
    }
}));

Map.schema.plugin(useTimestamps);


var GeoFeatureSchema = new geogoose.models.GeoFeatureSchema({
    geocoded: {type: Boolean, default: false, required: true},
    incrementor: mongoose.Schema.Types.Mixed,
    source: mongoose.Schema.Types.Mixed,
    count: Number   
});

GeoFeatureSchema.plugin(useTimestamps);


var GeoFeatureCollectionSchema = new geogoose.models.GeoFeatureCollectionSchema({
    title: String,
    description: String,
    source: String,
    unit: String,
    isNumeric: {type: Boolean, default: true},
    extremes: { type: mongoose.Schema.Types.Mixed, index: 1, default: {} },
    importParams: mongoose.Schema.Types.Mixed,
    timebased: Boolean,
    gridSize: Number,
    defaults: { type: mongoose.Schema.ObjectId, ref: 'LayerOptions', index: 1 },
    active: Boolean,
    status: String,
    progress: Number,
    numBusy: Number,
    reduce: Boolean,
    maxReduceZoom: Number,
    sync: Boolean,
    cropDistribution: Boolean,
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', index: 1 },
    modifiedBy: { type: mongoose.Schema.ObjectId, ref: 'User', index: 1 },
    createdAt: Date,
    updatedAt: Date,
    lastReducedAt: Date,
    datetimeAttr: String,
    numericAttr: String
}, GeoFeatureSchema);

GeoFeatureCollectionSchema.plugin(useTimestamps);

var GeoFeatureCollection = mongoose.model('GeoFeatureCollection', GeoFeatureCollectionSchema);


module.exports = {
    User: User, 
    Job: Job, 
    LayerOptions: LayerOptions, 
    Map: Map,
    GeoFeatureCollection: GeoFeatureCollection,
    adHocModel: geogoose.util.adHocModel
    //GeoFeature: GeoFeature,
};

