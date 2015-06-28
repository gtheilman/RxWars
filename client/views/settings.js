if (Meteor.isClient) {

    Template.settings.helpers({

        startStopMarketButton: function () {
            if (ServerSession.findOne({}).setIntervalId) {
                return "Pause Market"
            } else {
                return "Start Market"
            }
        },

        buyLegalFeesMultiplier: function () {
            return ServerSession.findOne({}).buyLegalFeeMultiplier
        },

        sellLegalFeesMultiplier: function () {
            return ServerSession.findOne({}).sellLegalFeeMultiplier
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
                    // console.log("Result: " + result);
                    sAlert.success('Transactions and Market History Reset', {
                        effect: 'scale', position: 'top-right',
                        timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                    });
                }
            });

        }
    },

    "click #startStopMarketButton": function () {
        var setIntervalId = ServerSession.findOne({}).setIntervalId;
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

    },

    "click #resetDrugsButton": function () {
        if (confirm("Are you sure you really want to reset drug list & clear all transactions and market history?")) {
            Meteor.call('resetMarket');
            Meteor.call('resetDrugs');
            sAlert.success('Drug list, transactions and market history reset', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
        }

    },

    "click #resetAllButton": function () {
        if (confirm("Are you sure you really want to reset everything except the admin account?")) {
            Meteor.call('resetMarket');
            Meteor.call('resetDrugs');
            Meteor.call('resetPlayers');
            sAlert.success('Players, drug list, transactions and market history reset', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
        }

    },

    "click #decriminalize": function () {
        if (confirm("Are you sure you really want to set demand for all drugs to near zero?")) {
            Meteor.call('decriminalize');
            sAlert.success('The illicit drug market is about to bottom out...', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
        }
    },

    "click #gangster": function () {
        if (confirm("Are you sure you really want to set risk of arrest to zero?")) {
            Meteor.call('gangster');
            sAlert.success('Law enforcement is off.', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
        }
    },


    "click #increaseScheduleIIBuyRisk": function () {

        Meteor.call('increaseScheduleIIBuyRisk', function (error, result) {
            if (result) {
                sAlert.success('Risk of being arrested when buying Schedule II drugs has been increased to ' + result + "%.", {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else {
                console.log("Error: " + error);
            }
        });


    },

    "click #decreaseScheduleIIBuyRisk": function () {

        Meteor.call('decreaseScheduleIIBuyRisk', function (error, result) {
            if (result) {
                sAlert.success('Risk of being arrested when buying Schedule II drugs has been decreased to ' + result + "%.", {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else {
                console.log("Error: " + error);
            }
        });


    },

    "click #increaseScheduleIII_VBuyRisk": function () {

        Meteor.call('increaseScheduleIII_VBuyRisk', function (error, result) {
            if (result) {
                sAlert.success('Risk of being arrested when buying Schedule III - V drugs has been increased to ' + result + "%.", {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else {
                console.log("Error: " + error);
            }
        });


    },

    "click #decreaseScheduleIII_VBuyRisk": function () {

        Meteor.call('decreaseScheduleIII_VBuyRisk', function (error, result) {
            if (result) {
                sAlert.success('Risk of being arrested when buying Schedule III - V drugs has been decreased to ' + result + "%.", {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else {
                console.log("Error: " + error);
            }
        });


    },

    "click #increaseUnscheduledBuyRisk": function () {

        Meteor.call('increaseUnscheduledBuyRisk', function (error, result) {
            if (result) {
                sAlert.success('Risk of being arrested when buying unscheduled drugs has been increased to ' + result + "%.", {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else {
                console.log("Error: " + error);
            }
        });


    },

    "click #decreaseUnscheduledBuyRisk": function () {

        Meteor.call('decreaseUnscheduledBuyRisk', function (error, result) {
            if (result) {
                sAlert.success('Risk of being arrested when buying unscheduled drugs has been decreased to ' + result + "%.", {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else {
                console.log("Error: " + error);
            }
        });


    },

    "click #increaseSellRisk": function () {

        Meteor.call('increaseSellRisk', function (error, result) {
            if (result) {
                sAlert.success('Risk of being arrested when selling drugs has been increased to ' + result + "%.", {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else {
                console.log("Error: " + error);
            }
        });


    },

    "click #decreaseSellRisk": function () {

        Meteor.call('decreaseSellRisk', function (error, result) {
            if (result) {
                sAlert.success('Risk of being arrested when selling drugs has been decreased to ' + result + "%.", {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else {
                console.log("Error: " + error);
            }
        });


    },

    "click #increaseBuyLegalFees": function () {
        var serversession = ServerSession.findOne({});
        ServerSession.update({_id: serversession._id},
            {
                $set: {
                    buyLegalFeeMultiplier: serversession.buyLegalFeeMultiplier + 1
                }
            }
        )
    },

    "click #decreaseBuyLegalFees": function () {
        var serversession = ServerSession.findOne({});
        if (serversession.buyLegalFeeMultiplier > 0) {
            ServerSession.update({_id: serversession._id},
                {
                    $set: {
                        buyLegalFeeMultiplier: serversession.buyLegalFeeMultiplier - 1
                    }
                }
            )
        }
    },

    "click #increaseSellLegalFees": function () {
        var serversession = ServerSession.findOne({});
        ServerSession.update({_id: serversession._id},
            {
                $set: {
                    sellLegalFeeMultiplier: serversession.sellLegalFeeMultiplier + 1
                }
            }
        )
    },

    "click #decreaseSellLegalFees": function () {
        var serversession = ServerSession.findOne({});
        if (serversession.sellLegalFeeMultiplier > 0) {
            ServerSession.update({_id: serversession._id},
                {
                    $set: {
                        sellLegalFeeMultiplier: serversession.sellLegalFeeMultiplier - 1
                    }
                }
            )
        }

    }


});