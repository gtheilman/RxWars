if (Meteor.isClient) {

    Template.scoreboard.helpers({
        teamScores: function () {

            ScoreBoard.remove({});

            // https://github.com/mizzao/meteor-user-status
            Meteor.users.find({"status.online": true}).forEach(function (team) {
                if (team.username != 'admin') {
                    var player = team;
                    Meteor.call('getTeamScores', team._id, function (error, result) {
                        if (result) {
                            console.log("GetTeamScores:");
                            console.log(result);
                            if (result < 0) {
                                var teamNet = "-$" + addCommas(-1 * result);
                            } else {
                                var teamNet = "$" + addCommas(result);
                            }

                            ScoreBoard.insert({
                                team_id: player._id,
                                username: player.username,
                                teamNet: teamNet
                            });
                        } else {
                            console.log("GetTeamScoresError:");
                            console.log(error);
                        }

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