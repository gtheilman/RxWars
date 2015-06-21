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

            price = parseFloat(drug.awp) * parseFloat(drug.demandMultiplier) * 150 * numberPlayers / numberAvailable;

            if (price < (1.1 * parseFloat(drug.awp))) {
                price = 1.1 * parseFloat(drug.awp);
            }

            entry = {
                time: new Date(),
                drug_id: drug._id,
                price: price,
                numberAvailable: numberAvailable
            };
            DrugPrice.insert(entry);


        });
    },
    'increaseScheduleIIBuyRisk': function () {
        var buyRisk = Drugs.findOne({schedule: 'II'}).buyRisk;
        Drugs.update({schedule: 'II'},
            {
                $set: {
                    buyRisk: buyRisk + 5
                }
            },
            {multi: true});

        return buyRisk + 5;
    },

    'decreaseScheduleIIBuyRisk': function () {
        var buyRisk = Drugs.findOne({schedule: 'II'}).buyRisk;
        Drugs.update({schedule: 'II'},
            {
                $set: {
                    buyRisk: buyRisk - 5
                }
            },
            {multi: true});

        return buyRisk - 5;
    },
    'increaseScheduleIII_VBuyRisk': function () {
        var buyRisk = Drugs.findOne({schedule: 'III'}).buyRisk;
        if (!buyRisk) {
            var buyRisk = Drugs.findOne({schedule: 'IV'}).buyRisk;
        }
        if (!buyRisk) {
            var buyRisk = Drugs.findOne({schedule: 'V'}).buyRisk;
        }

        Drugs.update({schedule: 'III'},
            {
                $set: {
                    buyRisk: buyRisk + 5
                }
            },
            {multi: true});
        Drugs.update({schedule: 'IV'},
            {
                $set: {
                    buyRisk: buyRisk + 5
                }
            },
            {multi: true});
        Drugs.update({schedule: 'V'},
            {
                $set: {
                    buyRisk: buyRisk + 5
                }
            },
            {multi: true});

        return buyRisk + 5;
    },

    'decreaseScheduleIII_VBuyRisk': function () {
        var buyRisk = Drugs.findOne({schedule: 'III'}).buyRisk;
        if (!buyRisk) {
            var buyRisk = Drugs.findOne({schedule: 'IV'}).buyRisk;
        }
        if (!buyRisk) {
            var buyRisk = Drugs.findOne({schedule: 'V'}).buyRisk;
        }

        Drugs.update({schedule: 'III'},
            {
                $set: {
                    buyRisk: buyRisk - 5
                }
            },
            {multi: true});
        Drugs.update({schedule: 'IV'},
            {
                $set: {
                    buyRisk: buyRisk - 5
                }
            },
            {multi: true});
        Drugs.update({schedule: 'V'},
            {
                $set: {
                    buyRisk: buyRisk - 5
                }
            },
            {multi: true});

        return buyRisk - 5;
    },

    'decriminalize': function () {
        Drugs.update({},
            {
                $set: {
                    demandMultiplier: 0.0001
                }
            }, {multi: true})
    },

    'resetMarket': function () {
        Transactions.remove({});
        DrugPrice.remove({});
    },

    'resetDrugs': function () {

        Drugs.remove({});

        Drugs.insert({
            name: 'alprazolam',
            schedule: 'IV',
            awp: 2,
            buyRisk: 10,
            sellRisk: 20,
            demandMultiplier: 1,
            active: true
        });

        Drugs.insert({
            name: 'amphetamine',
            schedule: 'II',
            awp: 2,
            buyRisk: 25,
            sellRisk: 20,
            demandMultiplier: 1,
            active: true
        });
        Drugs.insert({
            name: 'hydrocodone',
            schedule: 'II',
            awp: 8.5,
            buyRisk: 25,
            sellRisk: 20,
            demandMultiplier: 2,
            active: true
        });

        Drugs.insert({
            name: 'oxandrolone',
            schedule: 'III',
            awp: 1,
            buyRisk: 10,
            sellRisk: 20,
            demandMultiplier: 0.5,
            active: true
        });
        Drugs.insert({
            name: 'oxycodone',
            schedule: 'II',
            awp: 8.5,
            buyRisk: 25,
            sellRisk: 20,
            demandMultiplier: 3,
            active: true
        });

        Drugs.insert({
            name: 'trazodone',
            schedule: 'N/A',
            awp: 1,
            buyRisk: 5,
            sellRisk: 5,
            demandMultiplier: 0.5,
            active: true
        });


    },
    'resetPlayers': function () {
        Meteor.users.remove({username: {$not: /^admin.*/}});
    }


});

