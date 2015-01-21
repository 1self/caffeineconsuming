if (Meteor.isClient) {
    var config = {
        appId: "app-id-82df18710e9f27239f6fbc8ec24dd10b",
        appSecret: "app-secret-6276d01389e65bf354730945380f874bd8f6bed70aa03e2370bf290ae6333b08",
        "appName": "CaffieneConsuming",
        "appVersion": "0.0.1"
    };

	var lib1self = new Lib1self(config, "production");

Meteor.startup(function () {
        var isStreamRegistered = function () {
            return window.localStorage.streamId !== undefined;
        };
        var storeStreamDetails = function (stream) {
            window.localStorage.streamId = stream.streamid;
            window.localStorage.readToken = stream.readToken;
            window.localStorage.writeToken = stream.writeToken;
        };

        if (!isStreamRegistered()) {
            console.info("registering stream.");
            lib1self.registerStream(function (stream) {
                storeStreamDetails(stream);
            });
        }
    });

Template.logging.events({
        'click #coffee': function () {

            var coffeeEvent = {
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["caffeine", "coffee"],
                "actionTags": ["drink"],
                "properties": {
                    "amount": 1
                }
            };
            
            lib1self.sendEvent(coffeeEvent , window.localStorage.streamId, window.localStorage.writeToken, function(){});
          
            console.log("Coffee Event sent:");
            console.log(coffeeEvent);
        },


       'click #tea': function () {

            var teaEvent = {
                "source": config.appName,
                "version": config.appVersion,
                "objectTags": ["caffeine", "tea"],
                "actionTags": ["drink"],
                "properties": {
                    "amount": 1
                }
            };
            
            lib1self.sendEvent(teaEvent , window.localStorage.streamId, window.localStorage.writeToken, function(){});
          
            console.log("Tea Event sent:");
            console.log(teaEvent);
        }

    });

    Template.footer.events({
        'click #displayLogActivityTemplate': function () {
            $(".logActivityTemplate").show();
            $(".showVizTemplate").hide();
        },
        'click #displaySelectVizTemplate': function () {
            $(".showVizTemplate").show();
            $(".logActivityTemplate").hide();
        }
    });

    Template.selectVisualizations.events({
        'click #teaViz': function () {
            var url = lib1self.visualize(window.localStorage.streamId, window.localStorage.readToken)
                .objectTags(["caffeine", "tea"])
                .actionTags(["drink"])
                .sum("amount")
                .barChart()
                .backgroundColor("fbefac")
                .url();
            console.info(url);
            $(".logActivityTemplate").hide();
            window.open(url, "_system", "location=no");
        },
  	'click #coffeeViz': function () {
            var url = lib1self.visualize(window.localStorage.streamId, window.localStorage.readToken)
                .objectTags(["caffeine", "coffee"])
                .actionTags(["drink"])
                .sum("amount")
                .barChart()
                .backgroundColor("d0c05d")
                .url();
            console.info(url);
            $(".logActivityTemplate").hide();
            window.open(url, "_system", "location=no");
        }
    });

}
