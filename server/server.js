if (Meteor.isServer) Meteor.methods({


    'updatePrices': function () {
        Drugs.find({active: true}).forEach(function (drug) {
            var numberAvailable = 1;
            var numberPlayers = 0;
            var price = 0;
            console.log("Drug:  " + drug);
            // https://github.com/mizzao/meteor-user-status
            Meteor.users.find({"status.online": true}).forEach(function (player) {
                if (player.username != 'admin') {

                    console.log(player.username);
                    numberPlayers = numberPlayers + 1;

                    var transaction = Transactions.findOne({
                        team_id: player._id,
                        drug_id: drug._id
                    }, {sort: {epoch: -1}});

                    if (transaction) {
                        numberAvailable = numberAvailable + parseInt(transaction.inventoryForward);
                    }
                }
            });

            price = parseFloat(drug.awp) * parseFloat(drug.demandMultiplier) * 200 * numberPlayers / numberAvailable;

            if (price < (1.1 * parseFloat(drug.awp))) {
                price = 1.1 * parseFloat(drug.awp);
            }
            if (price > (40 * parseFloat(drug.awp))) {
                price = 40 * parseFloat(drug.awp);
            }

            entry = {
                time: new Date(),
                drug_id: drug._id,
                price: price,
                numberAvailable: numberAvailable
            };
            DrugPrice.insert(entry);


        });
    }

});

