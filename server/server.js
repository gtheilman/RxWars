if (Meteor.isServer) Meteor.methods({


    'updatePrices': function () {
        this.unblock;
        Drugs.find({active: true}).forEach(function (drug) {
            var numberAvailable = 1;
            var numberPlayers = 0;
            var price = 0;
            //  console.log("Drug:  " + drug);
            // https://github.com/mizzao/meteor-user-status
            Meteor.users.find({"status.online": true}).forEach(function (player) {
                if (player.username != 'admin') {

                    //  console.log(player.username);
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
    },

    'updateTeamCash': function () {
        var teamCash = 0;
        Transactions.find({team_id: Meteor.userId()}, {sort: {epoch: 1}}).forEach(function (transaction) {
            if (transaction.buyPrice) {
                teamCash = teamCash - (transaction.buyPrice * transaction.buyQuantity);
            }
            if (transaction.sellPrice) {
                teamCash = teamCash + (transaction.sellPrice * transaction.sellQuantity);
            }
            if (transaction.loanPayment) {
                teamCash = teamCash - transaction.loanPayment;
            }
            if (transaction.loanAmount) {
                teamCash = teamCash + transaction.loanAmount;
            }
            if (transaction.legalFees) {
                teamCash = teamCash - transaction.legalFees;
            }
            if (transaction.snitchFee) {
                teamCash = teamCash - transaction.snitchFee;
            }
        });

        teamCash = Math.floor(parseInt(teamCash));

        Meteor.users.update({_id: Meteor.userId()},
            {
                $set: {
                    teamCash: teamCash
                }
            }
        );


        return teamCash

    },


    'updateTeamDebt': function () {
        var teamDebt = 0;
        Transactions.find({team_id: Meteor.userId()}, {sort: {epoch: 1}}).forEach(function (transaction) {
            if (transaction.loanAmount) {
                teamDebt = teamDebt + transaction.loanAmount;
            }
            if (transaction.loanPayment) {
                teamDebt = teamDebt - transaction.loanPayment;
            }
            if (transaction.loanInterest) {
                teamDebt = teamDebt + transaction.loanInterest;
            }
        });

        teamDebt = Math.floor(parseInt(teamDebt));

        Meteor.users.update({_id: Meteor.userId()},
            {
                $set: {
                    teamDebt: teamDebt
                }
            }
        );

        return teamDebt


    },

    'getTeamScores': function (team_id) {
        this.unblock;
        var transaction = Transactions.findOne({
            team_id: team_id
        }, {sort: {epoch: -1}});

        if (transaction) {
            var teamNet = parseInt(transaction.teamCash) - parseInt(transaction.teamDebt);
        } else {
            var teamNet = 0;
        }


        return teamNet
    },
    'updateScoreBoard': function (teamNet) {
        this.unblock;
        ScoreBoard.update({team_id: Meteor.userId()}, {
                $set: {
                    team_id: Meteor.userId(),
                    teamNet: parseInt(teamNet),
                    username: Meteor.user().username
                }
            }, {upsert: true}
        )
    },
    'removeTeam': function (username) {
        ScoreBoard.remove({username: username});
    },

    'drugPriceTrends': function () {
        var data = [];

        Drugs.find({active: true}, {sort: {name: 1}}).forEach(function (drug) {
            var element = {};
            element.name = drug.name;
            element.data = [];
            var time = 0;
            var price = 0;

            DrugPrice.find({drug_id: drug._id}, {sort: {epoch: 1}}).forEach(function (pricePoint) {
                if (pricePoint.time != '' && pricePoint.price != '' && pricePoint.price > 1 && pricePoint.price < 100) {
                    time = parseInt(moment(pricePoint.time).subtract(5, "hours").format('x'));
                    price = Math.round(parseFloat(pricePoint.price) * 100) / 100;
                    element.data.push([time, price]);
                }
            });
            data.push(element);
        });

        return data

    },


    'drugVolumeTrends': function () {
        var data = [];

        Drugs.find({active: true}, {sort: {name: 1}}).forEach(function (drug) {
            var element = {};
            element.name = drug.name;
            element.data = [];
            var quantity = 0;
            var time = 0;
            /*

             Transactions.find({
             drug_id: drug._id, epoch: {
             $gte: parseInt(moment().subtract(301, "minutes").format('x')),
             $lte: parseInt(moment().subtract(300, "minutes").format('x'))
             }
             }).forEach(function (transaction) {
             if (transaction.sellQuantity != '') {
             quantity = quantity + transaction.sellQuantity;
             time = parseInt(moment().subtract(5, "hours").format('x'));
             element.data.push([time, quantity]);
             }
             });

             */

            Transactions.aggregate(
                {
                    $group: {
                        _id: {day: {$dayOfYear: "$time"}, hour: {$hour: "$time"}, minute: {$minute: "$time"}},
                        quantity: {$sum: "$sellQuantity"}
                    }
                }, {
                    $sort: {
                        '_id.day': 1,
                        '_id.hour': 1,
                        '_id.minute': 1
                    }
                }).forEach(function (transaction) {

                    console.log("Transaction ");
                    console.log(transaction);

                    quantity = transaction.quantity;
                    time = parseInt(moment('1970-01-01 ' + transaction._id.hour + ':' + transaction._id.minute).format('x'));
                    element.data.push([time, quantity]);

                });


            console.log("Element ");
            console.log(element);


            data.push(element);
        });


        return data

    },

    'keepAlive': function () {

        var restURL = "http://gis.ncdc.noaa.gov/arcgis/rest/services/cdo/precip_15/MapServer?f=pjson";

        var result = Meteor.http.get(restURL);


        if (result.statusCode == 200) {
            return 1;
        } else {
            return 0;
        }
    }
    ,
    'resetServer': function () {
        //reset server
        if (Roles.userIsInRole(this.userId, 'admin')) {

            Meteor.setTimeout(function () {
                process.exit();
            }, 1000);

            return true

        }

    }


})
;

