define('MenuView', [], function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Timer         = require('famous/utilities/Timer');

    var StripView     = require('StripView');
    var FeaturedView  = require('FeaturedView');

    function MenuView() {
        View.apply(this, arguments);

        //_createBacking.call(this);
        _createStripViews.call(this);
        _createFeaturedView.call(this);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.DEFAULT_OPTIONS = {
        stripData: {},
        angle: -0.2,
        stripWidth: 320,
        stripHeight: 54,
        topOffset: 37,
        stripOffset: 35,
        staggerDelay: 35,
        featureOffset: 380,
        transition: {
            duration: 400,
            curve: 'easeOut'
        }
    };

    /*function _createBacking() {
        var backing = new Surface({
            properties: {
                backgroundColor: '#2B3332',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }
        });

        var backingModifier = new StateModifier({
            transform: Transform.behind
        });

        this.add(backingModifier).add(this.backing);
    }*/

    function _createStripViews() {
        this.stripModifiers = [];
        var yOffset = this.options.topOffset;

        for (var i = 0; i < this.options.stripData.length; i++) {
            var stripView = new StripView({
                iconUrl: this.options.stripData[i].iconUrl,
                title: this.options.stripData[i].title
            });

            var stripModifier = new StateModifier({
                transform: Transform.translate(0, yOffset, 0)
            });

            this.stripModifiers.push(stripModifier);
            this.add(stripModifier).add(stripView);

            yOffset += this.options.stripOffset;

            _setListener.call(this, stripView);
        }
    }

    function _setListener(stripView) {
        stripView.on('stripMenu', this.toggleStripMenu.bind(this, stripView));
    }

    MenuView.prototype.toggleStripMenu = function(stripView) {
        this._eventOutput.emit('stripMenu', stripView.options.title);
    };

    function _createFeaturedView() {
        var featuredView = new FeaturedView({ angle: this.options.angle });

        this.featuredMod = new StateModifier({
            transform: Transform.translate(0, this.options.featureOffset, 0),
            opacity: 0
        });

        this.add(this.featuredMod).add(featuredView);
    }

    MenuView.prototype.resetStrips = function() {
        for(var i = 0; i < this.stripModifiers.length; i++) {
            var initX = -this.options.stripWidth;
            var initY = this.options.topOffset
                + this.options.stripOffset * i
                + this.options.stripWidth * Math.tan(-this.options.angle);

            this.stripModifiers[i].setTransform(Transform.translate(initX, initY, 0));
        }

        this.featuredMod.setOpacity(0);
    };

    MenuView.prototype.animateStrips = function() {
        this.resetStrips();

        var transition = this.options.transition;
        var delay = this.options.staggerDelay;
        var stripOffset = this.options.stripOffset;
        var topOffset = this.options.topOffset;

        for(var i = 0; i < this.stripModifiers.length; i++) {
            Timer.setTimeout(function(i) {
                var yOffset = topOffset + stripOffset * i;

                this.stripModifiers[i].setTransform(
                    Transform.translate( 0, yOffset, 0), transition);
            }.bind(this, i), i * delay);
        }

        Timer.setTimeout((function() {
            this.featuredMod.setOpacity(1, transition);
        }).bind(this), transition.duration);
    };

    module.exports = MenuView;
});
