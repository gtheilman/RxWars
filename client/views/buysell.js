Template.buysell.helpers({
    drugs: function () {

        TeamBuySell.remove({});

        Drugs.find({active: true}).forEach(function (drug) {
            var inventoryForward = 0;
            if (inventoryForward) {
                var inventory = inventoryForward;
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
            TeamBuySell.insert(entry);
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
        }
        var teamCash = Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}}).teamCash;

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
        }
        var teamDebt = Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}}).teamDebt;

        if (teamDebt) {
            return "$" + teamDebt.toFixed(2)
        } else
            return "$0.00"

    }

});


Template.buysell.events({
    "submit #borrowForm": function (event, template) {
        event.preventDefault();

        Transactions.insert({
            loanAmount: parseInt(event.target.loanAmount.value)
        });
    },


    "submit #repayForm": function (event, template) {
        event.preventDefault();
        var loanPayment = parseInt(event.target.loanPayment.value);

        var current = Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}});

        if (loanPayment > current.teamCash) {
            loanPayment = current.teamCash;
        }
        if (loanPayment > current.teamDebt) {
            loanPayment = current.teamDebt;
        }

        Transactions.insert({
            loanPayment: loanPayment
        });
    },


    "click #repayAllButton": function (event, template) {
        event.preventDefault();

        var current = Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}});

        if (current.teamDebt > current.teamCash) {
            var loanPayment = current.teamCash;
        } else {
            var loanPayment = current.teamDebt;
        }

        Transactions.insert({
            loanPayment: loanPayment
        });
    }

});

