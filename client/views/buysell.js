Template.buysell.helpers({
    drugs: function () {

        TeamBuySell.remove({});

        Drugs.find({active: true}).forEach(function (drug) {

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
    dollarFormat: function (amount) {
        return "$" + amount.toFixed(2)
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
            return "$" + teamCash.toFixed(2)
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
            return "$" + teamDebt.toFixed(2)
        } else
            return "$0.00"

    }

});


Template.buysell.events({
    "submit #borrowForm": function (event, template) {
        event.preventDefault();

        var loanAmount = parseInt(event.target.loanAmount.value);

        Transactions.insert({
            loanAmount: loanAmount
        }, function (err, result) {
            console.log("result " + result);

            var teamCash = updateTeamCash();
            var teamDebt = updateTeamDebt();
            console.log("teamCash" + teamCash);
            console.log("teamDebt" + teamDebt);

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
            console.log("result " + result);

            var teamCash = updateTeamCash();
            var teamDebt = updateTeamDebt();
            console.log("teamCash" + teamCash);
            console.log("teamDebt" + teamDebt);

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
            console.log("result " + result);

            var teamCash = updateTeamCash();
            var teamDebt = updateTeamDebt();
            console.log("teamCash" + teamCash);
            console.log("teamDebt" + teamDebt);

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

        var form = event.currentTarget;
        console.log(form.id);

        console.log(event.target);

        var purchasePrice = parseInt(event.target.buyPrice.value * 100) / 100;

        var teamCash = updateTeamCash();

        var maxPurchase = Math.floor(teamCash / purchasePrice);

        if (event.target.buyQuantity.value > maxPurchase) {
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

        Transactions.insert({
            drug_id: event.target.drug_id.value,
            buyQuantity: purchaseQuantity,
            buyPrice: purchasePrice,
            inventoryForward: inventory + purchaseQuantity
        }, function (err, result) {
            console.log("result " + result);
            var teamCash = updateTeamCash();
            var teamDebt = updateTeamDebt();
            console.log("teamCash" + teamCash);
            console.log("teamDebt" + teamDebt);

            Transactions.update({_id: result},
                {
                    $set: {
                        teamCash: teamCash,
                        teamDebt: teamDebt
                    }
                });

        });

    }


});

