if (Meteor.isClient) {

    Template.scoreboard.helpers({
        teamScores: function () {

            ScoreBoard.remove({});

            // https://github.com/mizzao/meteor-user-status
            Meteor.users.find({"status.online": true}).forEach(function (player) {
                if (player.username != 'admin') {
                    Meteor.call('getTeamScores', player_id, function (error, results) {

                        ScoreBoard.insert({
                            team_id: player._id,
                            username: player.username,
                            teamNet: teamNet
                        });


                    });
                }
            });

            return ScoreBoard.find({}, {sort: {username: 1}})
        },


        profitLoss: function (teamNet) {
            if (teamNet.indexOf("-") == -1) {
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
            var snitchFee = 2500;


            if (snitchFee > Session.get('teamCash')) {
                var loanAmount = parseInt(snitchFee) - Session.get('teamCash');
            } else {
                var loanAmount = 0;
            }

            Transactions.insert({
                snitchFee: snitchFee,
                loanAmount: loanAmount,
                teamCash: Session.get('teamCash'),
                teamDebt: Session.get('teamDebt')
            });

            alert("You paid $" + addCommas(snitchFee) + " to have someone snitch on " + Meteor.users.findOne({_id: team_id}).username + "!!");


        }
    });

}