if (Meteor.isServer) Meteor.methods({


    'updatePrices': function () {
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
        // console.log("TeamCash: " + teamCash);

        /*
         if (teamCash < 0) {
         var loanAmount = ( -1 * teamCash);
         Transactions.insert({
         loanAmount: loanAmount
         }, function (err, result) {
         var teamCash = teamCash + loanAmount;
         var teamDebt = teamDebt + loanAmount;
         Transactions.update({_id: result},
         {
         $set: {
         teamCash: teamCash,
         teamDebt: teamDebt
         }
         });
         });
         }

         */

        teamCash = parseInt(teamCash);

        return teamCash
    },


    'getTeamScores': function (team_id) {

        var transaction = Transactions.findOne({
            team_id: team_id
        }, {sort: {epoch: -1}});

        if (transaction) {
            var teamNet = parseInt(transaction.teamCash) - parseInt(transaction.teamDebt);
        } else {
            var teamNet = 0;
        }

        if (teamNet < 0) {
            teamNet = "-$" + addCommas(-1 * teamNet);
        } else {
            teamNet = "$" + addCommas(teamNet);
        }
        return teamNet
    }


});

