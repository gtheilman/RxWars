if (Meteor.isClient) {

    Template.scoreboard.helpers({
        teamScores: function () {
            return ScoreBoard.find({}, {sort: {username: 1}})
        },

        teamNetFormatted: function (teamNet) {
            if (teamNet < 0) {
                var text = "-$" + addCommas(-1 * teamNet);
            } else {
                var text = "$" + addCommas(teamNet);
            }
            return text
        },


        profitLoss: function (teamNet) {
            if (teamNet < 0) {
                var text = "-$" + addCommas(teamNet);
            } else {
                var text = "$" + addCommas(teamNet);
            }


            if (text.indexOf("-") == -1) {
                return "netPositive"
            } else {
                return "netNegative"
            }
        }
    });

    Template.scoreboard.events({
        "click .snitchButton": function (event, template) {

            team_id = event.target.id.replace("snitchButton_", "");
            snitchTeam = Meteor.users.findOne({_id: team_id});
            Snitches.insert({
                team_id: team_id
            });
            var snitchFee = 5000;


            if (snitchFee > parseFloat(TEAMCASH)) {
                alert("You don't have enough money to pay the snitch.");
                return
            } else {
                TEAMCASH = parseFloat(TEAMCASH) - snitchFee;
            }

            Transactions.insert({
                snitchFee: snitchFee,
                teamCash: parseFloat(TEAMCASH),
                teamDebt: parseFloat(TEAMDEBT)
            });

            alert("You paid $" + addCommas(snitchFee) + " to have someone snitch on " + Meteor.users.findOne({_id: team_id}).username + "!!");


        }
    });

}