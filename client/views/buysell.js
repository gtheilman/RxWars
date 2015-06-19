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


});

Template.buysell.events({});




