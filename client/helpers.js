if (!Meteor.isClient) {
} else {

    this.addCommas = function (nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    };
    Template.registerHelper('addCommas', addCommas);


    this.updateTeamCash = function () {

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
        console.log("TeamCash: " + teamCash);
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
        teamCash = parseInt(teamCash);
        console.log("TeamCash: " + teamCash);
        TEAMCASH = teamCash;
        return teamCash
    };

    Template.registerHelper('updateTeamCash', updateTeamCash);


    this.updateTeamDebt = function () {

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


        if (teamDebt < 0 && teamDebt > -1) {
            teamDebt = 0;
        } else {
            teamDebt = parseInt(teamDebt);
        }
        // console.log("teamDebt: " + teamDebt);
        TEAMDEBT = teamDebt;
        return teamDebt
    };

    Template.registerHelper('updateTeamDebt', updateTeamDebt);

    this.getIntervalId = function () {
        var serverSession = ServerSession.findOne({});
        if (serverSession.setIntervalId) {
            return serverSession.setIntervalId
        } else {
            return false
        }
    };

    Template.registerHelper('getIntervalId', getIntervalId);

    Template.registerHelper('dollarFormat', function (amount) {
        return "$" + amount.toFixed(2)
    });

    this.buyRisk = function (buyQuantity, drug_id) {

        var buyRisk = Drugs.findOne({_id: drug_id}).buyRisk;

        if (buyQuantity <= 100) {
            var calculatedBuyRisk = buyQuantity / 100 * buyRisk;
        } else {
            var calculatedBuyRisk = buyQuantity / 100 * buyRisk * buyQuantity / 100;
        }
        if (calculatedBuyRisk > 99) {
            calculatedBuyRisk = 99;
        }

        if (calculatedBuyRisk < 1) {
            calculatedBuyRisk = 1;
        }


        if (isNaN(calculatedBuyRisk)) {
            calculatedBuyRisk = buyRisk;
        }
        return calculatedBuyRisk

    };

    this.updateScoreBoard = function () {
        if (Meteor.user().username != 'admin') {
            if (parseFloat(TEAMCASH) < 0) {
                TEAMCASH = 0;
            } else if (parseFloat(TEAMDEBT) < 0) {
                TEAMDEBT = 0;
            }

            var teamNet = parseFloat(TEAMCASH) - parseFloat(TEAMDEBT);
            Meteor.call('updateScoreBoard', teamNet);
        }
    };

    Template.registerHelper('updateScoreBoard', updateScoreBoard);

    this.disableButtons = function (seconds) {
        Session.set('buttonsDisabled', true);
        Meteor.setTimeout(function () {
            Session.set('buttonsDisabled', false);
        }, seconds * 1000);
    }
}

