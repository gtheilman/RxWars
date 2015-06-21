if (Meteor.isClient) {

    Template.scoreboard.helpers({
        teamScores: function () {

            ScoreBoard.remove({});

            // https://github.com/mizzao/meteor-user-status
            Meteor.users.find({"status.online": true}).forEach(function (player) {
                if (player.username != 'admin') {


                    var transaction = Transactions.findOne({
                        team_id: player._id
                    }, {sort: {epoch: -1}});

                    if (transaction) {
                        var teamNet = parseInt(transaction.teamCash) - parseInt(transaction.teamDebt);
                    } else {
                        var teamNet = 0;
                    }

                    // console.log(player._id);
                    // console.log(player.username);
                    // console.log(teamNet);

                    ScoreBoard.insert({
                        team_id: player._id,
                        username: player.username,
                        teamNet: teamNet
                    });
                }
            });
            console.log(ScoreBoard);
            return ScoreBoard.find({}, {sort: {teamNet: -1}})
        },


        profitLoss: function (teamNet) {
            if (teamNet >= 0) {
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

            var teamCash = updateTeamCash();


            if (snitchFee > teamCash) {
                var loanAmount = parseInt(snitchFee) - parseInt(teamCash);
            } else {
                var loanAmount = 0;
            }

            Transactions.insert({
                snitchFee: snitchFee,
                loanAmount: loanAmount
            }, function (err, result) {
                console.log("result " + result);
                var teamCash = updateTeamCash();
                var teamDebt = updateTeamDebt();

                Transactions.update({_id: result},
                    {
                        $set: {
                            teamCash: teamCash,
                            teamDebt: teamDebt
                        }
                    });

                alert("You paid $" + addCommas(snitchFee) + " to have someone snitch on " + Meteor.users.findOne({_id: team_id}).username + "!!");


            });
        }
    });

}