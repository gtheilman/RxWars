if (Meteor.isClient) {

    Template.settings.helpers({
        startStopMarketButton: function () {
            if (Session.get('setIntervalId')) {
                return "Pause Market"
            } else {
                return "Start Market"
            }
        }
    });
}


Template.settings.events({
    "click #resetButton": function (event, template) {
        if (confirm("Are you sure you really want to clear all transactions and market history?")) {

            Meteor.call('resetMarket', function (error, result) {
                if (error) {
                    console.log("Error: " + error);
                } else {
                    console.log("Result: " + result);
                    sAlert.success('Transactions and Market History Reset', {
                        effect: 'scale', position: 'top-right',
                        timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                    });
                }
            });

        }
    },

    "click #startStopMarketButton": function () {
        var setIntervalId = ServerSession_id = ServerSession.findOne({}).setIntervalId;
        if (!setIntervalId) {
            var setIntervalId = Meteor.setInterval(function () {
                Meteor.call('updatePrices');
            }, 15000);

            Session.set('setIntervalId', setIntervalId);
            var ServerSession_id = ServerSession.findOne({})._id;
            ServerSession.update({_id: ServerSession_id},
                {
                    $set: {
                        setIntervalId: setIntervalId
                    }
                });

            sAlert.success('Market started', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });

        } else {

            Meteor.clearInterval(setIntervalId);
            var ServerSession_id = ServerSession.findOne({})._id;
            ServerSession.update({_id: ServerSession_id},
                {
                    $set: {
                        setIntervalId: ''
                    }
                });

            Session.set('setIntervalId', '');
            sAlert.warning('Market paused', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
        }


    },
    "click #goDatabasePage": function () {
        Router.go('/admin');

    }
});