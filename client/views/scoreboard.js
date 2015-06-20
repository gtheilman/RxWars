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
            return ScoreBoard.find({});
        },
        profitLoss: function (teamNet) {
            if (teamNet >= 0) {
                return "netPositive"
            } else {
                return "netNegative"
            }
        }
    });
}