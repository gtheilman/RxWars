if (Meteor.isClient) {
    // add interest from loan shark
    Meteor.setInterval(function () {
        if (getIntervalId()) {
            if (parseFloat(TEAMDEBT) > 0) {
                var loanInterest = 0.05 * parseFloat(TEAMDEBT);
                TEAMDEBT = parseFloat(TEAMDEBT) + loanInterest;

                Transactions.insert({
                    loanInterest: loanInterest,
                    teamDebt: parseFloat(TEAMDEBT),
                    teamCash: parseFloat(TEAMCASH)
                });

                updateScoreBoard();

                sAlert.warning('You owe an additional $' + addCommas(parseInt(loanInterest)) + ' in interest to the loanshark!! Pay it off quickly ...', {
                    effect: 'scale', position: 'top-right',
                    timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
                });

            }
        }

    }, 30000);
}


Template.buysell.helpers({
    drugs: function () {

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


    enable_disable: function () {
        if (Session.get('buttonsDisabled')) {
            return ' disabled = "disabled" '
        } else {
            return ''
        }
    },

    admin: function () {
        if (Meteor.user().username == 'admin') {
            return true
        } else {
            return false
        }
    },

    teamCash: function () {

        if (!Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}})) {
            Transactions.insert({
                time: new Date,
                teamCash: 0,
                teamDebt: 0,
                drug_id: ''
            });
        }

        if (typeof TEAMCASH == 'undefined') {
            TEAMCASH = Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}}).teamCash;
        }
        //   updateScoreBoard();
        if (TEAMCASH) {
            return "$" + addCommas(parseFloat(TEAMCASH).toFixed(0))
        } else
            return "$0.00"

    },

    teamDebt: function () {

        if (!Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}})) {
            Transactions.insert({
                time: new Date,
                teamCash: 0,
                teamDebt: 0,
                drug_id: ''
            });
        }

        if (typeof TEAMDEBT == 'undefined') {
            TEAMDEBT = Transactions.findOne({team_id: Meteor.userId()}, {sort: {epoch: -1}}).teamDebt;
        }
        //   updateScoreBoard();
        if (TEAMDEBT) {
            return "$" + addCommas(parseFloat(TEAMDEBT).toFixed(0))
        } else
            return "$0.00"

    },


    enterExit: function () {
        Meteor.users.find({"status.online": true}).observe({
            added: function (id) {
                if (username != 'admin') {
                    sAlert.success(id.username + ' has joined the game.', {
                        effect: 'scale', position: 'bottom-right',
                        timeout: '4000', onRouteClose: false, stack: true, offset: '0px'
                    });
                }
            },
            removed: function (id) {
                if (username != 'admin') {
                    sAlert.error(id.username + ' has left the game.', {
                        effect: 'scale', position: 'bottom-right',
                        timeout: '4000', onRouteClose: false, stack: true, offset: '0px'
                    });
                }
                Meteor.call('removeTeam', id.username);
            }
        });
    }

});


Template.buysell.events({
    "submit #borrowForm": function (event, template) {
        event.preventDefault();

        var loanAmount = parseInt(event.target.loanAmount.value);

        if (!loanAmount) {
            sAlert.info('You have to specify how much you want to borrow...', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
            return
        }

        TEAMCASH = parseFloat(TEAMCASH) + loanAmount;
        TEAMDEBT = parseFloat(TEAMDEBT) + loanAmount;


        Transactions.insert({
            loanAmount: loanAmount,
            teamDebt: parseFloat(TEAMDEBT),
            teamCash: parseFloat(TEAMCASH)
        });

        updateScoreBoard();

        $('#loanAmount').val('');

        var randomalert = Math.floor(Math.random() * 4) + 1;

        if (randomalert == 1) {
            alert('Big John loaned you $' + addCommas(loanAmount) + '  The interest rate is astronomical.   You need to make a big sale in a hurry so you can pay him back.');
        } else if (randomalert == 2) {
            alert('Against your better judgement, you borrow $' + addCommas(loanAmount) + ' from the loan shark.  If you do not pay him back soon, he is going to break your legs.  Keep an eye on your debt and pay it back as soon you can.');
        } else if (randomalert == 3) {
            alert('You promised Larry the Lizard you would have his $' + addCommas(loanAmount) + ' repaid as soon as you make your first sale.   He looked skeptical and told you to take your time.  He probably wants you to run up as much in interest charges as possible.');
        } else {
            alert('You have borrowed $' + addCommas(loanAmount) + ' from the loan shark.  The interest rate is very high.   Keep an eye on your debt and pay it back as soon as possible.');
        }

    },


    "submit #repayForm": function (event, template) {
        event.preventDefault();

        var loanPayment = parseInt(event.target.loanPayment.value);

        if (!loanPayment) {
            sAlert.info('You have to specify how much you want to repay...', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
            return
        }


        // trying to return more than they borrowed
        if (parseFloat(TEAMDEBT) < loanPayment) {
            var loanPayment = parseFloat(TEAMDEBT);
        }

        TEAMCASH = parseFloat(TEAMCASH) - loanPayment;
        TEAMDEBT = parseFloat(TEAMDEBT) - loanPayment;

        Transactions.insert({
            loanPayment: loanPayment,
            teamDebt: parseFloat(TEAMDEBT),
            teamCash: parseFloat(TEAMCASH)

        });
        updateScoreBoard();


        $('#loanPayment').val('');


    },


    "click #repayAllButton": function (event, template) {
        event.preventDefault();


        if (parseFloat(TEAMDEBT) > parseFloat(TEAMCASH)) {
            var loanPayment = parseFloat(TEAMCASH);
            TEAMCASH = 0;
            TEAMDEBT = parseFloat(TEAMDEBT) - loanPayment;
        } else {
            var loanPayment = parseFloat(TEAMDEBT);
            TEAMCASH = parseFloat(TEAMCASH) - loanPayment;
            TEAMDEBT = 0;
        }

        //  console.log("loanpayment: " + loanPayment);


        Transactions.insert({
            loanPayment: loanPayment,
            teamDebt: parseFloat(TEAMDEBT),
            teamCash: parseFloat(TEAMCASH)
        });

        updateScoreBoard();

    },


    "submit .buyForm": function (event, template) {
        event.preventDefault();

        if (Session.get('buttonsDisabled')) {
            return
        }


        disableButtons(5);


        var buyPrice = parseInt(event.target.buyPrice.value * 100) / 100;

        var drug_id = event.target.drug_id.value;
        var drug_name = event.target.name.value;


        var maxPurchase = Math.floor(parseFloat(TEAMCASH) / buyPrice);

        if (!event.target.buyQuantity.value) {
            sAlert.info('You need to indicate how many you wish to buy.', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
            return
            //   console.log("Not:" + buyQuantity);
        } else if (isNaN(parseInt(event.target.buyQuantity.value))) {
            sAlert.info('You need to indicate how many you wish to buy...', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
            return
            //     console.log("NaN:" + buyQuantity);
        } else if (event.target.buyQuantity.value > maxPurchase) {
            // asked to buy more than the money they had.  REduce quantity bought
            var buyQuantity = maxPurchase;

            sAlert.info('You only have enough money to buy ' + buyQuantity + ' ' + drug_name + '.', {
                effect: 'scale', position: 'top-right',
                timeout: '8000', onRouteClose: false, stack: true, offset: '0px'
            });
            //  console.log("Reduce quantity:" + buyQuantity);
        } else {
            // buy what they asked for
            var buyQuantity = parseInt(event.target.buyQuantity.value);
        }


        //  console.log("buyQuantity: " + buyQuantity);

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
        //  console.log("Buy Risk: " + calculatedBuyRisk);


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
            //  console.log("legalFees1: " + legalFees);


            if (legalFees < 1000) {
                legalFees = 1000;
                //      console.log("legalFees2: " + legalFees);
            } else if (isNaN(legalFees)) {
                legalFees = 1000;
                //    console.log("legalFees3: " + legalFees);
            } else if (legalFees > 1.5 * TEAMCASH) {
                //   console.log("legalFees4A: " + legalFees);
                //   console.log("TEAMCASH4A: " + TEAMCASH);
                legalFees = 1.5 * TEAMCASH;
                //     console.log("legalFees4: " + legalFees);
            }


            // busted or not, you lose the money
            var totalSale = buyQuantity * buyPrice;
            TEAMCASH = parseFloat(TEAMCASH) - totalSale;


            if (legalFees > parseFloat(TEAMCASH)) {
                var loanAmount = legalFees - parseFloat(TEAMCASH);
                //  console.log("loanAmount1: " + loanAmount);
                TEAMDEBT = parseFloat(TEAMDEBT) + legalFees - parseFloat(TEAMCASH);
                //   console.log("TEAMDEBT1: " + TEAMDEBT);
                TEAMCASH = 0;
                //   console.log("TEAMCASH1: " + TEAMCASH);

            } else {
                var loanAmount = 0;
                TEAMCASH = parseFloat(TEAMCASH) - legalFees;
                //  console.log("TEAMCASH2: " + TEAMCASH);
            }


            Transactions.insert({
                drug_id: drug_id,
                buyQuantity: 0,
                buyPrice: buyPrice,
                inventoryForward: inventory,
                legalFees: legalFees,
                loanAmount: loanAmount,
                teamDebt: parseFloat(TEAMDEBT),
                teamCash: parseFloat(TEAMCASH)
            });

            var randomalert = Math.floor(Math.random() * 5) + 1;

            var fine = addCommas(parseInt(legalFees));
            var saleLoss = addCommas(parseInt(totalSale));

            if (randomalert == 1) {
                alert('The police were waiting for your buyer when they left the pharmacy with the ' + drug_name + '. They confiscated the $' + saleLoss + ' you were trying to spend.  Your legal costs were $' + fine);
            } else if (randomalert == 2) {
                alert('The pharmacist was suspicious of a prescription for so many ' + drug_name + '.   The police confiscated the $' + saleLoss + ' you were trying to spend.   After you got lawyered-up, your legal costs were $' + fine);
            } else if (randomalert == 3) {
                alert('The Board of Pharmacy had sent out an alert about the stolen prescription pad you were using to get ' + drug_name + '.  The pharmacist noticed it and called the police.  They confiscated the $' + saleLoss + ' you were trying to spend.  Your legal costs were $' + fine);
            } else if (randomalert == 4) {
                alert('Your buyer acted very nervous and the pharmacist became suspicious.   When the buyer could not explain what the ' + drug_name + ' was for, the police were alerted.  You lose the $' + saleLoss + ' you were trying to spend.  Your legal costs were $' + fine);
            } else if (randomalert == 5) {
                alert('The pharmacist recognized your buyer as someone who had come in earlier in the month with a different prescription for ' + drug_name + '.  The police were called and an arrest was made.  They confiscated the $' + saleLoss + ' you were trying to spend.  Your legal costs were $' + fine);
            } else {
                alert('Your minion was arrested while trying to pass a fake prescription for ' + drug_name + ' at the pharmacy.  In an attempt to hide the evidence, he swallowed the $' + saleLoss + ' you gave him.  Your legal costs were $' + fine);
            }

        } else {

            var totalSale = buyQuantity * buyPrice;
            TEAMCASH = parseFloat(TEAMCASH) - totalSale;


            var buySummary = {
                drug_id: drug_id,
                buyQuantity: buyQuantity,
                buyPrice: buyPrice,
                inventoryForward: inventory + buyQuantity,
                teamDebt: parseFloat(TEAMDEBT),
                teamCash: parseFloat(TEAMCASH)
            };


            Transactions.insert(buySummary);

        }
        updateScoreBoard();

    },


    "submit .buyMaxForm": function (event, template) {
        event.preventDefault();

        if (Session.get('buttonsDisabled')) {
            return
        }


        disableButtons(5);


        var buyPrice = parseInt(event.target.buyPrice.value * 100) / 100;

        var drug_id = event.target.drug_id.value;
        var drug_name = event.target.name.value;


        var maxPurchase = Math.floor(parseFloat(TEAMCASH) / buyPrice);

        var buyQuantity = maxPurchase;

        //  console.log("buyQuantity: " + buyQuantity);

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
        //  console.log("Buy Risk: " + calculatedBuyRisk);


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
            //  console.log("legalFees1: " + legalFees);


            if (legalFees < 1000) {
                legalFees = 1000;
                //      console.log("legalFees2: " + legalFees);
            } else if (isNaN(legalFees)) {
                legalFees = 1000;
                //    console.log("legalFees3: " + legalFees);
            } else if (legalFees > 1.5 * TEAMCASH) {
                //   console.log("legalFees4A: " + legalFees);
                //   console.log("TEAMCASH4A: " + TEAMCASH);
                legalFees = 1.5 * TEAMCASH;
                //     console.log("legalFees4: " + legalFees);
            }


            // busted or not, you lose the money
            var totalSale = buyQuantity * buyPrice;
            TEAMCASH = parseFloat(TEAMCASH) - totalSale;


            if (legalFees > parseFloat(TEAMCASH)) {
                var loanAmount = legalFees - parseFloat(TEAMCASH);
                //  console.log("loanAmount1: " + loanAmount);
                TEAMDEBT = parseFloat(TEAMDEBT) + legalFees - parseFloat(TEAMCASH);
                //   console.log("TEAMDEBT1: " + TEAMDEBT);
                TEAMCASH = 0;
                //   console.log("TEAMCASH1: " + TEAMCASH);

            } else {
                var loanAmount = 0;
                TEAMCASH = parseFloat(TEAMCASH) - legalFees;
                //  console.log("TEAMCASH2: " + TEAMCASH);
            }


            Transactions.insert({
                drug_id: drug_id,
                buyQuantity: 0,
                buyPrice: buyPrice,
                inventoryForward: inventory,
                legalFees: legalFees,
                loanAmount: loanAmount,
                teamDebt: parseFloat(TEAMDEBT),
                teamCash: parseFloat(TEAMCASH)
            });

            var randomalert = Math.floor(Math.random() * 5) + 1;

            var fine = addCommas(parseInt(legalFees));
            var saleLoss = addCommas(parseInt(totalSale));

            if (randomalert == 1) {
                alert('The police were waiting for your buyer when they left the pharmacy with the ' + drug_name + '. They confiscated the $' + saleLoss + ' you were trying to spend.  Your legal costs were $' + fine);
            } else if (randomalert == 2) {
                alert('The pharmacist was suspicious of a prescription for so many ' + drug_name + '.   The police confiscated the $' + saleLoss + ' you were trying to spend.   After you got lawyered-up, your legal costs were $' + fine);
            } else if (randomalert == 3) {
                alert('The Board of Pharmacy had sent out an alert about the stolen prescription pad you were using to get ' + drug_name + '.  The pharmacist noticed it and called the police.  They confiscated the $' + saleLoss + ' you were trying to spend.  Your legal costs were $' + fine);
            } else if (randomalert == 4) {
                alert('Your buyer acted very nervous and the pharmacist became suspicious.   When the buyer could not explain what the ' + drug_name + ' was for, the police were alerted.  You lose the $' + saleLoss + ' you were trying to spend.  Your legal costs were $' + fine);
            } else if (randomalert == 5) {
                alert('The pharmacist recognized your buyer as someone who had come in earlier in the month with a different prescription for ' + drug_name + '.  The police were called and an arrest was made.  They confiscated the $' + saleLoss + ' you were trying to spend.  Your legal costs were $' + fine);
            } else {
                alert('Your minion was arrested while trying to pass a fake prescription for ' + drug_name + ' at the pharmacy.  In an attempt to hide the evidence, he swallowed the $' + saleLoss + ' you gave him.  Your legal costs were $' + fine);
            }

        } else {

            var totalSale = buyQuantity * buyPrice;
            TEAMCASH = parseFloat(TEAMCASH) - totalSale;


            var buySummary = {
                drug_id: drug_id,
                buyQuantity: buyQuantity,
                buyPrice: buyPrice,
                inventoryForward: inventory + buyQuantity,
                teamDebt: parseFloat(TEAMDEBT),
                teamCash: parseFloat(TEAMCASH)
            };


            Transactions.insert(buySummary);

        }
        updateScoreBoard();

    },


    "submit .sellForm": function (event, template) {
        event.preventDefault();

        if (Session.get('buttonsDisabled')) {
            return
        }

        disableButtons(5);


        var drug_name = event.target.name.value;
        var drug_id = event.target.drug_id.value;
        var sellPrice = parseInt(event.target.sellPrice.value * 100) / 100;

        //  console.log("Inventory: " + parseInt(event.target.inventory.value));

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
            // console.log("Legal Fees" + legalFees);

            if (legalFees < 1000) {
                legalFees = 1000;
            } else if (isNaN(legalFees)) {
                legalFees = 1000;
            } else if (legalFees > 1.5 * TEAMCASH) {
                legalFees = 1.5 * TEAMCASH
            }


            if (legalFees > parseFloat(TEAMCASH)) {
                TEAMDEBT = parseFloat(TEAMDEBT) + legalFees - parseFloat(TEAMCASH);
                var loanAmount = legalFees - parseFloat(TEAMCASH);
                TEAMCASH = 0;
            } else {
                TEAMCASH = parseFloat(TEAMCASH) - legalFees;
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
                teamCash: parseFloat(TEAMCASH),
                teamDebt: parseFloat(TEAMDEBT)
            };

            // console.log(sellSummary);

            Transactions.insert(sellSummary);
            updateScoreBoard();

            var randomalert = Math.floor(Math.random() * 5) + 1;

            var fine = addCommas(parseInt(legalFees));

            if (randomalert == 1) {
                alert('A rival pill mill tipped the police off and they caught you trying to sell the ' + drug_name + '.  Your legal costs were $' + fine);
            } else if (randomalert == 2) {
                alert('An customer ratted you out to the police in return for immunity from prosecution.  They took away your ' + drug_name + ' and fined you $' + fine);
            } else if (randomalert == 3) {
                alert('Your courier was mugged!   They stole the ' + drug_name + ' as well as the $' + fine + ' that he was carrying.');
            } else if (randomalert == 4) {
                alert('Your minion took some of the ' + drug_name + ' you told him to sell.   While tripping, he tried to sell the rest to a uniformed police officer.  It cost $' + fine + ' to get him out of jail.');
            } else if (randomalert == 5) {
                alert('Your not-very-bright minion tried to sell the ' + drug_name + ' back to the pharmacist who dispensed it.  The police were called and bail was set at $' + fine);
            } else {
                alert('Your minion was caught while trying to sell ' + drug_name + ' to an undercover police officer.  Your legal costs were $' + fine);
            }


        } else {
            var totalSale = sellQuantity * sellPrice;
            TEAMCASH = parseFloat(TEAMCASH) + totalSale;

            Transactions.insert({
                drug_id: drug_id,
                sellQuantity: sellQuantity,
                sellPrice: sellPrice,
                inventoryForward: inventory - sellQuantity,
                teamCash: parseFloat(TEAMCASH),
                teamDebt: parseFloat(TEAMDEBT)
            });
            updateScoreBoard();

        }

    }
    ,


    'keyup input.buyQuantityInput': function (event, template) {

        var drug_id = event.currentTarget.id.replace('buyQuantity_', '');

        var buyQuantity = parseInt(event.currentTarget.value);

        var calculatedBuyRisk = buyRisk(buyQuantity, drug_id);


        $('#calculatedBuyRisk_' + drug_id).text(calculatedBuyRisk.toFixed(0) + "%");
        $('#buyRisk_' + drug_id).val(calculatedBuyRisk.toFixed(0));

    }

})
;
