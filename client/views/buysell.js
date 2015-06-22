if (Meteor.isClient) {
    // add interest from loan shark
    Meteor.setInterval(function () {
        if (getIntervalId()) {


            if (Session.get('teamDebt') > 0) {
                var loanInterest = 0.05 * Session.get('teamDebt');
                Session.set('teamDebt', Session.get('teamDebt') + loanInterest);

                Transactions.insert({
                    loanInterest: loanInterest,
                    teamDebt: Session.get('teamDebt'),
                    teamCash: Session.get('teamCash')
                });

                sAlert.warning('You owe money to the loanshark!! Pay it off quickly before the interest gets too high...', {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });

            }
        }

    }, 30000);
}


Template.buysell.helpers({
    drugs: function () {

        // if no cash debt in session, create it

        if (!Session.get('teamCash')) {
            Meteor.call('updateTeamCash', function (error, result) {
                if (result) {
                    Session.set('teamCash', result);
                } else {
                    Session.set('teamCash', 0);
                }
            });
        }

        if (!Session.get('teamDebt')) {
            Session.set('teamDebt', 0);
        }

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

        var teamCash = Math.floor(Session.get('teamCash'));

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


        if (Session.get('teamDebt')) {
            return "$" + addCommas(Session.get('teamDebt').toFixed(0))
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
        Session.set('teamCash', Session.get('teamCash') + loanAmount);
        Session.set('teamDebt', Session.get('teamDebt') + loanAmount);


        Transactions.insert({
            loanAmount: loanAmount,
            teamDebt: Session.get('teamDebt'),
            teamCash: Session.get('teamCash')
        });

        $('#loanAmount').val('');


    },


    "submit #repayForm": function (event, template) {
        event.preventDefault();

        if (!event.target.loanPayment.value) {
            return
        }

        var loanPayment = parseInt(event.target.loanPayment.value);


        // trying to return more than they borrowed
        if (Session.get('teamDebt') < loanPayment) {
            var loanPayment = Session.get('teamDebt');
        }

        Session.set('teamCash', Session.get('teamCash') - loanPayment);
        Session.set('teamDebt', Session.get('teamDebt') - loanPayment);

        Transactions.insert({
            loanPayment: loanPayment,
            teamDebt: Session.get('teamDebt'),
            teamCash: Session.get('teamCash')

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

        console.log("loanpayment: " + loanPayment);

        Session.set('teamCash', Session.get('teamCash') - loanPayment);
        Session.set('teamDebt', Session.get('teamDebt') - loanPayment);

        Transactions.insert({
            loanPayment: loanPayment,
            teamDebt: Session.get('teamDebt'),
            teamCash: Session.get('teamCash')
        });

    },


    "submit .buyForm": function (event, template) {
        event.preventDefault();


        var buyPrice = parseInt(event.target.buyPrice.value * 100) / 100;

        var drug_id = event.target.drug_id.value;


        var maxPurchase = Math.floor(Session.get('teamCash') / buyPrice);

        if (!event.target.buyQuantity.value) {
            // Buy as much as the money they have
            var buyQuantity = maxPurchase;
            console.log("Not:" + buyQuantity);
        } else if (parseInt(event.target.buyQuantity.value) == NaN) {
            // Buy as much as the money they have
            console.log("NaN");
            return
            console.log("NaN:" + buyQuantity);
        } else if (event.target.buyQuantity.value > maxPurchase) {
            // asked to buy more than the money they had.  REduce quantity bought
            var buyQuantity = maxPurchase;
            console.log("Reduce quantity:" + buyQuantity);
        } else {
            // buy what they asked for
            var buyQuantity = parseInt(event.target.buyQuantity.value);
        }


        console.log("buyQuantity: " + buyQuantity);

        // busted or not, you lose the money
        var totalSale = buyQuantity * buyPrice;
        Session.set('teamCash', Session.get('teamCash') - totalSale);


        var transaction = Transactions.findOne({
            team_id: Meteor.userId(),
            drug_id: drug_id
        }, {sort: {epoch: -1}});
        if (!transaction) {
            var inventory = 0;
        } else {
            var inventory = parseInt(transaction.inventoryForward);
        }


        // Busted?

        var calculatedBuyRisk = buyRisk(buyQuantity, drug_id);
        console.log("Buy Risk: " + calculatedBuyRisk);


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



        if (diceRoll < calculatedBuyRisk) {
            // busted
            var legalFees = parseInt(totalSale * buyQuantity / 100 * Math.random() * 10);

            if (legalFees < 1000) {
                legalFees = 1000;
            } else if (legalFees == NaN) {
                legalFees = 1000;
            }

            if (legalFees > Session.get('teamCash')) {
                Session.set('teamDebt', legalFees - Session.get('teamCash'));
                Session.set('teamCash', 0);
            } else {
                Session.set('teamCash', Session.get('teamCash') - legalFees);
            }


            Transactions.insert({
                drug_id: drug_id,
                buyQuantity: 0,
                buyPrice: buyPrice,
                inventoryForward: inventory,
                legalFees: legalFees,
                loanAmount: loanAmount,
                teamDebt: Session.get('teamDebt'),
                teamCash: Session.get('teamCash')
            });

            alert("Busted Buying.  LegalFees = $" + addCommas(legalFees));


        } else {
            var buySummary = {
                drug_id: drug_id,
                buyQuantity: buyQuantity,
                buyPrice: buyPrice,
                inventoryForward: inventory + buyQuantity,
                teamDebt: Session.get('teamDebt'),
                teamCash: Session.get('teamCash')
            };

            console.log(buySummary);

            Transactions.insert(buySummary);
        }

    },


    "submit .sellForm": function (event, template) {
        event.preventDefault();

        var drug_id = event.target.drug_id.value;
        var sellPrice = parseInt(event.target.sellPrice.value * 100) / 100;

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

        var transaction = Transactions.findOne({
            team_id: Meteor.userId(),
            drug_id: drug_id
        }, {sort: {epoch: -1}});

        if (!transaction) {
            var inventory = 0;
        } else {
            var inventory = parseInt(transaction.inventoryForward);
        }


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

        var sellRisk = parseInt(event.target.sellRisk.value);
        if (diceRoll < sellRisk) {
            // busted

            //lose the money you were trying to spend
            var totalSale = sellQuantity * sellPrice;
            Session.set('teamCash', Session.get('teamCash') - totalSale);

            var legalFees = parseInt(totalSale * sellQuantity / 100 * Math.random() * 10);

            if (legalFees < 1000) {
                legalFees = 1000;
            } else if (legalFees == NaN) {
                legalFees = 1000;
            }

            if (legalFees > Session.get('teamCash')) {
                Session.set('teamDebt', legalFees - Session.get('teamCash'));
                Session.set('teamCash', 0);
            } else {
                Session.set('teamCash', Session.get('teamCash') - legalFees);
            }


            Transactions.insert({
                drug_id: drug_id,
                sellQuantity: 0,
                sellPrice: sellPrice,
                inventoryForward: inventory - sellQuantity,
                legalFees: legalFees,
                loanAmount: loanAmount,
                teamCash: Session.get('teamCash'),
                teamDebt: Session.get('teamDebt')
            });
            alert("Busted Selling.  LegalFees = $" + addCommas(legalFees));


        } else {
            var totalSale = sellQuantity * sellPrice;
            Session.set('teamCash', Session.get('teamCash') + totalSale);

            Transactions.insert({
                drug_id: drug_id,
                sellQuantity: sellQuantity,
                sellPrice: sellPrice,
                inventoryForward: inventory - sellQuantity,
                teamCash: Session.get('teamCash'),
                teamDebt: Session.get('teamDebt')
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

