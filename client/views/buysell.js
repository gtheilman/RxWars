if (Meteor.isClient) {
    // add interest from loan shark
    Meteor.setInterval(function () {
        if (getIntervalId()) {
            if (Session.get('teamDebt') > 0) {
                var loanInterest = 0.05 * Session.get('teamDebt');
                Session.set('teamDebt', Session.get('teamDebt') + loanInterest);

                Transactions.insert({
                    loanInterest: loanInterest,
                    teamDebt: Session.get('teamDebt'),
                    teamCash: Session.get('teamCash')
                });

                updateScoreBoard();

                sAlert.warning('You owe money to the loanshark!! Pay it off quickly before the interest gets too high...', {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });

            }
        }

    }, 30000);
}


Template.buysell.helpers({
    drugs: function () {

        // if no cash debt in session, create it
        if (isNaN(Session.get('teamCash'))) {
            Meteor.call('updateTeamCash', function (error, result) {
                if (result) {
                    Session.set('teamCash', result);
                } else {
                    Session.set('teamCash', 0);
                }
            });
        }
        if (isNaN(Session.get('teamDebt'))) {
            Meteor.call('updateTeamDebt', function (error, result) {
                if (result) {
                    Session.set('teamDebt', result);
                } else {
                    Session.set('teamDebt', 0);
                }
            });
        }

        TeamBuySell.remove({});

        Drugs.find({active: true}, {sort: {name: 1}}).forEach(function (drug) {

            var transaction = Transactions.findOne({team_id: Meteor.userId(), drug_id: drug._id}, {sort: {epoch: -1}});
            if (transaction) {
                var inventory = parseInt(transaction.inventoryForward);
            } else {
                var inventory = 0;
            }

            var entry = {
                team_id: Meteor.userId(),
                drug_id: drug._id,
                name: drug.name,
                schedule: drug.schedule,
                awp: drug.awp,
                buyRisk: drug.buyRisk,
                sellRisk: drug.sellRisk,
                demandMultiplier: drug.demandMultiplier,
                price: DrugPrice.findOne({drug_id: drug._id}, {sort: {time: -1}}).price,
                inventory: inventory
            };
            TeamBuySell.insert(entry);  //local, non-permanent db
        });

        return TeamBuySell.find({});
    },
    makeUniqueID: function () {
        return "Form_" + parseInt(Math.random() * 1000000);
    },

    teamName: function () {
        return Meteor.user().username;
    },


    teamCash: function () {

        if (!Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}})) {
            Transactions.insert({
                time: new Date,
                teamCash: 0,
                teamDebt: 0,
                drug_id: ''
            });

            Session.set('teamCash', 0);
            Session.set('teamDebt', 0);
            updateScoreBoard();
        }

        var teamCash = Math.floor(Session.get('teamCash'));

        if (teamCash) {
            return "$" + addCommas(teamCash.toFixed(0))
        } else
            return "$0.00"

    },
    teamDebt: function () {

        if (!Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}})) {
            Transactions.insert({
                teamCash: 0,
                teamDebt: 0,
                drug_id: ''
            });
            Session.set('teamCash', 0);
            Session.set('teamDebt', 0);
            updateScoreBoard();
        }


        if (Session.get('teamDebt')) {
            return "$" + addCommas(Session.get('teamDebt').toFixed(0))
        } else
            return "$0.00"

    },

    enterExit: function () {
        Meteor.users.find({"status.online": true}).observe({
            added: function (id) {
                sAlert.success(id.username + ' has joined the game.', {
                    effect: 'scale', position: 'bottom-right',
                    timeout: '4000', onRouteClose: false, stack: true, offset: '0px'
                });
            },
            removed: function (id) {
                sAlert.error(id.username + ' has left the game.', {
                    effect: 'scale', position: 'bottom-right',
                    timeout: '4000', onRouteClose: false, stack: true, offset: '0px'
                });
                Meteor.call('removeTeam', id.username);
            }
        });
    }

});


Template.buysell.events({
    "submit #borrowForm": function (event, template) {
        event.preventDefault();

        var loanAmount = parseInt(event.target.loanAmount.value);
        Session.set('teamCash', Session.get('teamCash') + loanAmount);
        Session.set('teamDebt', Session.get('teamDebt') + loanAmount);


        Transactions.insert({
            loanAmount: loanAmount,
            teamDebt: Session.get('teamDebt'),
            teamCash: Session.get('teamCash')
        });

        updateScoreBoard();

        $('#loanAmount').val('');

        var randomalert = Math.floor(Math.random() * 4) + 1;

        if (randomalert == 1) {
            alert('Big John loaned you $' + loanAmount + '  The interest rate is astronomical.   You need to make a big sale in a hurry so you can pay him back.');
        } else if (randomalert == 2) {
            alert('Against your better judgement, you borrow $' + loanAmount + ' from the loan shark.  If you do not pay him back soon, he is going to break your legs.  Keep an eye on your debt and pay it back as soon you can.');
        } else if (randomalert == 3) {
            alert('You promised Larry the Lizard you would have his $' + loanAmount + ' repaid as soon as you make your first sale.   He looked skeptical and told you to take your time.  He probably wants you to run up as much in interest charges as possible.');
        } else {
            alert('You have borrowed $' + loanAmount + ' from the loan shark.  The interest rate is very high.   Keep an eye on your debt and pay it back as soon as possible.');
        }

    },


    "submit #repayForm": function (event, template) {
        event.preventDefault();

        if (!event.target.loanPayment.value) {
            return
        }

        var loanPayment = parseInt(event.target.loanPayment.value);


        // trying to return more than they borrowed
        if (Session.get('teamDebt') < loanPayment) {
            var loanPayment = Session.get('teamDebt');
        }

        Session.set('teamCash', Session.get('teamCash') - loanPayment);
        Session.set('teamDebt', Session.get('teamDebt') - loanPayment);

        Transactions.insert({
            loanPayment: loanPayment,
            teamDebt: Session.get('teamDebt'),
            teamCash: Session.get('teamCash')

        });
        updateScoreBoard();


        $('#loanPayment').val('');


    },


    "click #repayAllButton": function (event, template) {
        event.preventDefault();


        if (Session.get('teamDebt') > Session.get('teamCash')) {
            var loanPayment = Session.get('teamCash');
            Session.set('teamCash', 0);
            Session.set('teamDebt', Session.get('teamDebt') - loanPayment);
        } else {
            var loanPayment = Session.get('teamDebt');
            Session.set('teamCash', Session.get('teamCash') - loanPayment);
            Session.set('teamDebt', 0);
        }

        console.log("loanpayment: " + loanPayment);



        Transactions.insert({
            loanPayment: loanPayment,
            teamDebt: Session.get('teamDebt'),
            teamCash: Session.get('teamCash')
        });

        updateScoreBoard();

    },


    "submit .buyForm": function (event, template) {
        event.preventDefault();


        var buyPrice = parseInt(event.target.buyPrice.value * 100) / 100;

        var drug_id = event.target.drug_id.value;
        var drug_name = event.target.name.value;


        var maxPurchase = Math.floor(Session.get('teamCash') / buyPrice);

        if (!event.target.buyQuantity.value) {
            // Buy as much as the money they have
            var buyQuantity = maxPurchase;
            console.log("Not:" + buyQuantity);
        } else if (isNaN(parseInt(event.target.buyQuantity.value))) {
            // Buy as much as the money they have
            console.log("NaN");
            return
            console.log("NaN:" + buyQuantity);
        } else if (event.target.buyQuantity.value > maxPurchase) {
            // asked to buy more than the money they had.  REduce quantity bought
            var buyQuantity = maxPurchase;
            console.log("Reduce quantity:" + buyQuantity);
        } else {
            // buy what they asked for
            var buyQuantity = parseInt(event.target.buyQuantity.value);
        }


        console.log("buyQuantity: " + buyQuantity);

        // busted or not, you lose the money
        var totalSale = buyQuantity * buyPrice;
        Session.set('teamCash', Session.get('teamCash') - totalSale);


        var transaction = Transactions.findOne({
            team_id: Meteor.userId(),
            drug_id: drug_id
        }, {sort: {epoch: -1}});
        if (!transaction) {
            var inventory = 0;
        } else {
            var inventory = parseInt(transaction.inventoryForward);
        }


        // Busted?

        var calculatedBuyRisk = buyRisk(buyQuantity, drug_id);
        console.log("Buy Risk: " + calculatedBuyRisk);


        var snitch = Snitches.findOne({});
        if (snitch) {
            var diceRoll = -1;
            Snitches.remove({_id: snitch._id});
            sAlert.error('Someone snitched on you!', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
        } else {
            var diceRoll = parseInt(Math.random() * 100);
        }



        if (diceRoll < calculatedBuyRisk) {
            // busted
            var legalFees = parseInt(buyQuantity * buyPrice * (buyQuantity / 100) * ServerSession.findOne({}).buyLegalFeeMultiplier / 10);  // very high fines were discouraging players

            if (legalFees < 1000) {
                legalFees = 1000;
            } else if (isNaN(legalFees)) {
                legalFees = 1000;
            }

            if (legalFees > Session.get('teamCash')) {
                var loanAmount = legalFees - Session.get('teamCash');
                Session.set('teamDebt', Session.get('teamDebt') + legalFees - Session.get('teamCash'));
                Session.set('teamCash', 0);
            } else {
                var loanAmount = 0;
                Session.set('teamCash', Session.get('teamCash') - legalFees);
            }


            Transactions.insert({
                drug_id: drug_id,
                buyQuantity: 0,
                buyPrice: buyPrice,
                inventoryForward: inventory,
                legalFees: legalFees,
                loanAmount: loanAmount,
                teamDebt: Session.get('teamDebt'),
                teamCash: Session.get('teamCash')
            });
            updateScoreBoard();

            var randomalert = Math.floor(Math.random() * 5) + 1;

            if (randomalert == 1) {
                alert('Someone snitched!  The police were waiting for your buyer when they left the pharmacy with the ' + drug_name + '.  Your legal costs were $' + addCommas(legalFees));
            } else if (randomalert == 2) {
                alert('The pharmacist was suspicious of a prescription for so many ' + drug_name + '.  After you got lawyered-up, your legal costs were $' + addCommas(legalFees));
            } else if (randomalert == 3) {
                alert('The Board of Pharmacy had sent out an alert about the stolen prescription pad you were using to get ' + drug_name + '.  The pharmacist noticed it and called the police.  Your legal costs were $' + addCommas(legalFees));
            } else if (randomalert == 4) {
                alert('Your buyer acted very nervous and the pharmacist became suspicious.   When the buyer could not explain what the ' + drug_name + ' was for, the police were alerted.  Your legal costs were $' + addCommas(legalFees));
            } else if (randomalert == 5) {
                alert('The pharmacist recognized your buyer as someone who had come in earlier in the month with a different prescription for ' + drug_name + '.  The police were called and an arrest was made.  Your legal costs were $' + addCommas(legalFees));
            } else {
                alert('Your minion was arrested while trying to pass a fake prescription for ' + drug_name + ' at the pharmacy.  Your legal costs were $' + addCommas(legalFees));
            }

        } else {
            var buySummary = {
                drug_id: drug_id,
                buyQuantity: buyQuantity,
                buyPrice: buyPrice,
                inventoryForward: inventory + buyQuantity,
                teamDebt: Session.get('teamDebt'),
                teamCash: Session.get('teamCash')
            };

            console.log(buySummary);

            Transactions.insert(buySummary);
            updateScoreBoard();
        }

    },


    "submit .sellForm": function (event, template) {
        event.preventDefault();
        var drug_name = event.target.name.value;
        var drug_id = event.target.drug_id.value;
        var sellPrice = parseInt(event.target.sellPrice.value * 100) / 100;

        console.log("Inventory: " + parseInt(event.target.inventory.value));

        if (!parseInt(event.target.sellQuantity.value)) {
            var sellQuantity = parseInt((event.target.inventory.value));
        }
        else if (parseInt(event.target.sellQuantity.value) > parseInt(event.target.inventory.value)) {
            // console.log("oversell");
            var sellQuantity = parseInt((event.target.inventory.value));
        } else {
            // console.log("undersell");
            var sellQuantity = parseInt(event.target.sellQuantity.value);
        }

        var transaction = Transactions.findOne({
            team_id: Meteor.userId(),
            drug_id: drug_id
        }, {sort: {epoch: -1}});

        if (!transaction) {
            var inventory = 0;
        } else {
            var inventory = parseInt(transaction.inventoryForward);
        }


        var snitch = Snitches.findOne({});
        if (snitch) {
            var diceRoll = -1;
            Snitches.remove({_id: snitch._id});
            sAlert.error('Someone snitched on you!', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
        } else {
            var diceRoll = parseInt(Math.random() * 100);
        }

        var sellRisk = parseInt(event.target.sellRisk.value);
        if (diceRoll < sellRisk) {
            // busted

            var legalFees = parseInt((sellPrice * sellQuantity) * (sellQuantity / 100) * ServerSession.findOne({}).sellLegalFeeMultiplier / 10);
            console.log("Legal Fees" + legalFees);

            if (legalFees < 1000) {
                legalFees = 1000;
            } else if (isNaN(legalFees)) {
                legalFees = 1000;
            }

            if (legalFees > Session.get('teamCash')) {
                Session.set('teamDebt', Session.get('teamDebt') + legalFees - Session.get('teamCash'));
                Session.set('teamCash', 0);
                var loanAmount = legalFees - Session.get('teamCash');
            } else {
                Session.set('teamCash', Session.get('teamCash') - legalFees);
                var loanAmount = 0;
            }


            var inventoryForward = inventory - sellQuantity;

            var sellSummary = {
                drug_id: drug_id,
                sellQuantity: 0,
                sellPrice: sellPrice,
                inventoryForward: inventoryForward,
                legalFees: legalFees,
                loanAmount: loanAmount,
                teamCash: Session.get('teamCash'),
                teamDebt: Session.get('teamDebt')
            };

            console.log(sellSummary);

            Transactions.insert(sellSummary);
            updateScoreBoard();

            var randomalert = Math.floor(Math.random() * 5) + 1;

            if (randomalert == 1) {
                alert('A rival pill mill tipped the police off and they caught you trying to sell the ' + drug_name + '.  Your legal costs were $' + addCommas(legalFees));
            } else if (randomalert == 2) {
                alert('An customer ratted you out to the police in return for immunity from prosecution.  They took away your ' + drug_name + ' and fined you $' + addCommas(legalFees));
            } else if (randomalert == 3) {
                alert('Your courier was mugged!   They stole the ' + drug_name + ' as well as the $' + addCommas(legalFees) + ' that he was carrying.');
            } else if (randomalert == 4) {
                alert('Your minion took a handfull of the ' + drug_name + ' you told him to sell.   While tripping, he tried to sell the rest to a uniformed police officer.  It cost $' + addCommas(legalFees) + ' to get him out of jail.');
            } else if (randomalert == 5) {
                alert('Your not-very-bright minion tried to sell the ' + drug_name + ' back to the pharmacist who dispensed it.  The police were called and bail was set at $' + addCommas(legalFees));
            } else {
                alert('Your minion was caught while trying to sell ' + drug_name + ' to an undercover police officer.  Your legal costs were $' + addCommas(legalFees));
            }



        } else {
            var totalSale = sellQuantity * sellPrice;
            Session.set('teamCash', Session.get('teamCash') + totalSale);

            Transactions.insert({
                drug_id: drug_id,
                sellQuantity: sellQuantity,
                sellPrice: sellPrice,
                inventoryForward: inventory - sellQuantity,
                teamCash: Session.get('teamCash'),
                teamDebt: Session.get('teamDebt')
            });
            updateScoreBoard();
        }

    },


    'keyup input.buyQuantityInput': function (event, template) {

        var drug_id = event.currentTarget.id.replace('buyQuantity_', '');

        var buyQuantity = parseInt(event.currentTarget.value);

        var calculatedBuyRisk = buyRisk(buyQuantity, drug_id);


        $('#calculatedBuyRisk_' + drug_id).text(calculatedBuyRisk.toFixed(0) + "%");
        $('#buyRisk_' + drug_id).val(calculatedBuyRisk.toFixed(0));

    }

});

