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
        });

        if (teamCash < 0) {
            teamCash = 0;
        } else {
            teamCash = parseInt(teamCash);
        }
        //console.log("TeamCash: " + teamCash);
        Session.set('teamCash', teamCash);
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


        if (teamDebt < 0) {
            teamDebt = 0;
        } else {
            teamDebt = parseInt(teamDebt);
        }
        // console.log("teamDebt: " + teamDebt);
        Session.set('teamDebt', teamDebt);
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

}