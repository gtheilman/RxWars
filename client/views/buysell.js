if (Meteor.isClient) {
    // add interest from loan shark
    Meteor.setInterval(function () {
        if (getIntervalId()) {
            var teamDebt = Session.get('teamDebt');

            if (teamDebt > 0) {

                var loanInterest = 0.05 * teamDebt;

                Transactions.insert({
                    loanInterest: loanInterest
                }, function (err, result) {
                    // console.log("result " + result);

                    var teamCash = updateTeamCash();
                    var teamDebt = updateTeamDebt();
                    Transactions.update({_id: result},
                        {
                            $set: {
                                teamCash: teamCash,
                                teamDebt: teamDebt
                            }
                        });
                });

                sAlert.warning('You owe money to the loanshark!! Pay it off quickly before the interest gets too high...', {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });

            }
        }

    }, 15000);
}


Template.buysell.helpers({
    drugs: function () {

        TeamBuySell.remove({});

        Drugs.find({active: true}, {sort: {name: 1}}).forEach(function (drug) {

            var transaction = Transactions.findOne({team_id: Meteor.userId(), drug_id: drug._id}, {sort: {epoch: -1}});
            if (transaction) {
                var inventory = parseInt(transaction.inventoryForward);
            } else {
                var inventory = 0;
            }

            var entry = {
                team_id: Meteor.userId(),
                drug_id: drug._id,
                name: drug.name,
                schedule: drug.schedule,
                awp: drug.awp,
                buyRisk: drug.buyRisk,
                sellRisk: drug.sellRisk,
                demandMultiplier: drug.demandMultiplier,
                price: DrugPrice.findOne({drug_id: drug._id}, {sort: {time: -1}}).price,
                inventory: inventory
            };
            TeamBuySell.insert(entry);  //local, non-permanent db
        });

        return TeamBuySell.find({});
    },
    makeUniqueID: function () {
        return "Form_" + parseInt(Math.random() * 1000000);
    },

    teamName: function () {
        return Meteor.user().username;
    },


    teamCash: function () {

        if (!Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}})) {
            Transactions.insert({
                time: new Date,
                teamCash: 0,
                teamDebt: 0,
                drug_id: ''
            });

            Session.set('teamCash', 0);
            Session.set('teamDebt', 0);
        }

        var teamCash = Session.get('teamCash');

        if (teamCash) {
            return "$" + addCommas(teamCash.toFixed(0))
        } else
            return "$0.00"

    },
    teamDebt: function () {

        if (!Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}})) {
            Transactions.insert({
                teamCash: 0,
                teamDebt: 0,
                drug_id: ''
            });
            Session.set('teamCash', 0);
            Session.set('teamDebt', 0);
        }

        var teamDebt = Session.get('teamDebt');

        if (teamDebt) {
            return "$" + addCommas(teamDebt.toFixed(0))
        } else
            return "$0.00"

    },

    enterExit: function () {
        Meteor.users.find({"status.online": true}).observe({
            added: function (id) {
                sAlert.success(id.username + ' has joined the game.', {
                    effect: 'scale', position: 'bottom-right',
                    timeout: '4000', onRouteClose: false, stack: true, offset: '0px'
                });
            },
            removed: function (id) {
                sAlert.error(id.username + ' has left the game.', {
                    effect: 'scale', position: 'bottom-right',
                    timeout: '4000', onRouteClose: false, stack: true, offset: '0px'
                });
            }
        });
    }

});


Template.buysell.events({
    "submit #borrowForm": function (event, template) {
        event.preventDefault();

        var loanAmount = parseInt(event.target.loanAmount.value);

        Transactions.insert({
            loanAmount: loanAmount
        }, function (err, result) {
            var teamCash = updateTeamCash();
            var teamDebt = updateTeamDebt();
            Transactions.update({_id: result},
                {
                    $set: {
                        teamCash: teamCash,
                        teamDebt: teamDebt
                    }
                });
        });
        $('#loanAmount').val('');


    },


    "submit #repayForm": function (event, template) {
        event.preventDefault();

        var loanPayment = parseInt(event.target.loanPayment.value);

        if (Session.get('teamDebt') < loanPayment) {
            var loanPayment = Session.get('teamDebt');
        }


        Transactions.insert({
            loanPayment: loanPayment
        }, function (err, result) {
            // console.log("result " + result);

            var teamCash = updateTeamCash();
            var teamDebt = updateTeamDebt();
            // console.log("teamCash" + teamCash);
            // console.log("teamDebt" + teamDebt);

            Transactions.update({_id: result},
                {
                    $set: {
                        teamCash: teamCash,
                        teamDebt: teamDebt
                    }
                });

        });

        $('#loanPayment').val('');


    },


    "click #repayAllButton": function (event, template) {
        event.preventDefault();


        if (Session.get('teamDebt') > Session.get('teamCash')) {
            var loanPayment = Session.get('teamCash');
        } else {
            var loanPayment = Session.get('teamDebt');
        }

        Transactions.insert({
            loanPayment: loanPayment
        }, function (err, result) {
            // console.log("result " + result);

            var teamCash = updateTeamCash();
            var teamDebt = updateTeamDebt();
            // console.log("teamCash" + teamCash);
            // console.log("teamDebt" + teamDebt);

            Transactions.update({_id: result},
                {
                    $set: {
                        teamCash: teamCash,
                        teamDebt: teamDebt
                    }
                });

        });

    },


    "submit .buyForm": function (event, template) {
        event.preventDefault();

        var calculatedBuyRisk = parseInt(event.target.buyRisk.value);

        var snitch = Snitches.findOne({});
        if (snitch) {
            var diceRoll = -1;
            Snitches.remove({_id: snitch._id});
            sAlert.error('Someone snitched on you!', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
        } else {
            var diceRoll = parseInt(Math.random() * 100);
        }

        var purchasePrice = parseInt(event.target.buyPrice.value * 100) / 100;

        var teamCash = updateTeamCash();

        var maxPurchase = Math.floor(teamCash / purchasePrice);

        if (!event.target.buyQuantity.value) {
            var purchaseQuantity = maxPurchase;
            calculatedBuyRisk = buyRisk(purchaseQuantity, event.target.drug_id.value);
        } else if (event.target.buyQuantity.value > maxPurchase) {
            var purchaseQuantity = maxPurchase;
        } else {
            var purchaseQuantity = parseInt(event.target.buyQuantity.value);
        }

        var totalSale = purchaseQuantity * purchasePrice;

        var teamCash = Session.get('teamCash') - totalSale;

        var transaction = Transactions.findOne({
            team_id: Meteor.userId(),
            drug_id: event.target.drug_id.value
        }, {sort: {epoch: -1}});
        if (!transaction) {
            var inventory = 0;
        } else {
            var inventory = parseInt(transaction.inventoryForward);
        }


        if (diceRoll < calculatedBuyRisk) {
            // busted
            var legalFees = parseInt(totalSale * purchaseQuantity / 100 * Math.random() * 10);

            if (legalFees < 1000) {
                legalFees = 1000;
            } else if (legalFees == NaN) {
                legalFees = 1000;
            }

            if (legalFees > teamCash) {
                var loanAmount = parseInt(legalFees) - parseInt(teamCash);
            } else {
                var loanAmount = 0;
            }

            Transactions.insert({
                drug_id: event.target.drug_id.value,
                buyQuantity: 0,
                buyPrice: purchasePrice,
                inventoryForward: inventory,
                legalFees: legalFees,
                loanAmount: loanAmount
            }, function (err, result) {
                // console.log("result " + result);
                var teamCash = updateTeamCash();
                var teamDebt = updateTeamDebt();
                // console.log("teamCash" + teamCash);
                // console.log("teamDebt" + teamDebt);

                Transactions.update({_id: result},
                    {
                        $set: {
                            teamCash: teamCash,
                            teamDebt: teamDebt
                        }
                    });

                alert("Busted Buying.  LegalFees = $" + addCommas(legalFees));

            });


        } else {
            Transactions.insert({
                drug_id: event.target.drug_id.value,
                buyQuantity: purchaseQuantity,
                buyPrice: purchasePrice,
                inventoryForward: inventory + purchaseQuantity
            }, function (err, result) {
                // console.log("result " + result);
                var teamCash = updateTeamCash();
                var teamDebt = updateTeamDebt();
                // console.log("teamCash" + teamCash);
                // console.log("teamDebt" + teamDebt);

                Transactions.update({_id: result},
                    {
                        $set: {
                            teamCash: teamCash,
                            teamDebt: teamDebt
                        }
                    });

            });
        }

    },


    "submit .sellForm": function (event, template) {
        event.preventDefault();

        var sellRisk = parseInt(event.target.sellRisk.value);
        var snitch = Snitches.findOne({});
        if (snitch) {
            var diceRoll = -1;
            Snitches.remove({_id: snitch._id});
            sAlert.error('Someone snitched on you!', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
        } else {
            var diceRoll = parseInt(Math.random() * 100);
        }


        var sellPrice = parseInt(event.target.sellPrice.value * 100) / 100;

        var teamCash = updateTeamCash();


        console.log("Inventory: " + parseInt(event.target.inventory.value));


        if (!parseInt(event.target.sellQuantity.value)) {
            var sellQuantity = parseInt((event.target.inventory.value));
        }
        else if (parseInt(event.target.sellQuantity.value) > parseInt(event.target.inventory.value)) {
            // console.log("oversell");
            var sellQuantity = parseInt((event.target.inventory.value));
        } else {
            // console.log("undersell");
            var sellQuantity = parseInt(event.target.sellQuantity.value);
        }

        var totalSale = sellQuantity * sellPrice;

        var teamCash = Session.get('teamCash') + totalSale;

        var transaction = Transactions.findOne({
            team_id: Meteor.userId(),
            drug_id: event.target.drug_id.value
        }, {sort: {epoch: -1}});

        if (!transaction) {
            var inventory = 0;
        } else {
            var inventory = parseInt(transaction.inventoryForward);
        }
        if (diceRoll < sellRisk) {
            // busted

            var legalFees = parseInt(totalSale * sellQuantity / 100 * Math.random() * 10);

            if (legalFees < 1000) {
                legalFees = 1000;
            } else if (legalFees == NaN) {
                legalFees = 1000;
            }

            if (legalFees > teamCash) {
                var loanAmount = parseInt(legalFees) - parseInt(teamCash);
            } else {
                var loanAmount = 0;
            }

            Transactions.insert({
                drug_id: event.target.drug_id.value,
                sellQuantity: 0,
                sellPrice: sellPrice,
                inventoryForward: inventory - sellQuantity,
                legalFees: legalFees,
                loanAmount: loanAmount
            }, function (err, result) {
                // console.log("result " + result);
                var teamCash = updateTeamCash();
                var teamDebt = updateTeamDebt();
                // console.log("teamCash" + teamCash);
                // console.log("teamDebt" + teamDebt);

                Transactions.update({_id: result},
                    {
                        $set: {
                            teamCash: teamCash,
                            teamDebt: teamDebt
                        }
                    });
                alert("Busted Selling.  LegalFees = $" + addCommas(legalFees));

            });


        } else {
            Transactions.insert({
                drug_id: event.target.drug_id.value,
                sellQuantity: sellQuantity,
                sellPrice: sellPrice,
                inventoryForward: inventory - sellQuantity
            }, function (err, result) {
                // console.log("result " + result);
                var teamCash = updateTeamCash();
                var teamDebt = updateTeamDebt();
                // console.log("teamCash" + teamCash);
                // console.log("teamDebt" + teamDebt);

                Transactions.update({_id: result},
                    {
                        $set: {
                            teamCash: teamCash,
                            teamDebt: teamDebt
                        }
                    });

            });
        }

    },


    'keyup input.buyQuantityInput': function (event, template) {

        var drug_id = event.currentTarget.id.replace('buyQuantity_', '');

        var buyQuantity = parseInt(event.currentTarget.value);

        var calculatedBuyRisk = buyRisk(buyQuantity, drug_id);


        $('#calculatedBuyRisk_' + drug_id).text(calculatedBuyRisk.toFixed(0) + "%");
        $('#buyRisk_' + drug_id).val(calculatedBuyRisk.toFixed(0));

    }

});

