if (!Meteor.isClient) {
} else {

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
        console.log("TeamCash: " + teamCash);
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
        });
        console.log("teamDebt: " + teamDebt);
        Session.set('teamDebt', teamDebt);
        return teamDebt
    };

    Template.registerHelper('updateTeamDebt', updateTeamDebt);


}