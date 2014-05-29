require("famous-polyfills"); // Add polyfills
require("famous/core/famous"); // Add the default css file

Meteor.startup(function () {
    var Engine = require("famous/core/Engine");
    var AppView = require('AppView');

    var mainContext = Engine.createContext();
    var appView = new AppView();
    mainContext.add(appView);
});


