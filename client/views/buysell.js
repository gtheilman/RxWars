Template.buysell.helpers({
    drugs: function () {

        TeamBuySell.remove({});

        Drugs.find({active: true}).forEach(function (drug) {
            var inventoryForward = 0; // Transactions.find({team_id: Meteor.userId(), drug_id: drug._id }).sort({time: -1 }).limit(1).inventoryForward;
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
        var borrowAmount = event.target.borrowAmount.value;

        var current = Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}});

        var teamCash = current.teamCash + parseInt(borrowAmount);
        var teamDebt = current.teamDebt + parseInt(borrowAmount);

        Transactions.insert({
            teamCash: teamCash,
            teamDebt: teamDebt
        });
    },
    "submit #repayForm": function (event, template) {
        event.preventDefault();
        var repayAmount = parseInt(event.target.repayAmount.value);

        var current = Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}});

        if (repayAmount > current.teamCash) {
            repayAmount = current.teamCash;
        }
        if (repayAmount > current.teamDebt) {
            repayAmount = current.teamDebt;
        }

        var teamCash = current.teamCash - parseInt(repayAmount);
        var teamDebt = current.teamDebt - parseInt(repayAmount);

        Transactions.insert({
            teamCash: teamCash,
            teamDebt: teamDebt
        });
    },

    "click #repayAllButton": function (event, template) {
        event.preventDefault();


        var current = Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}});

        if (current.teamDebt > current.teamCash) {
            var repayAmount = current.teamCash;
        } else {
            var repayAmount = current.teamDebt;
        }

        var teamCash = current.teamCash - parseInt(repayAmount);
        var teamDebt = current.teamDebt - parseInt(repayAmount);

        Transactions.insert({
            teamCash: teamCash,
            teamDebt: teamDebt
        });
    }

});

