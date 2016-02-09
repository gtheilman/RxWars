if (Meteor.isServer) Meteor.methods({

    'increaseScheduleIIBuyRisk': function () {
        this.unblock;
        var drug = Drugs.findOne({schedule: 'II'});
        if (!drug) {
            var buyRisk = 5;
        } else {
            var buyRisk = drug.buyRisk;
        }
        Drugs.update({schedule: 'II'},
            {
                $set: {
                    buyRisk: buyRisk + 5
                }
            },
            {multi: true});

        return buyRisk + 5;
    },

    'decreaseScheduleIIBuyRisk': function () {
        this.unblock;
        var drug = Drugs.findOne({schedule: 'II'});
        if (!drug) {
            var buyRisk = 5;
        } else {
            var buyRisk = drug.buyRisk;
        }
        Drugs.update({schedule: 'II'},
            {
                $set: {
                    buyRisk: buyRisk - 5
                }
            },
            {multi: true});

        return buyRisk - 5;
    },
    'increaseScheduleIII_VBuyRisk': function () {
        this.unblock;
        var drug = Drugs.findOne({schedule: 'III'});
        if (!drug) {
            var drug = Drugs.findOne({schedule: 'IV'});
        }
        if (!drug) {
            var drug = Drugs.findOne({schedule: 'V'});
        }
        if (!drug) {
            var buyRisk = 5;
        } else {
            var buyRisk = drug.buyRisk;
        }

        Drugs.update({schedule: 'III'},
            {
                $set: {
                    buyRisk: buyRisk + 5
                }
            },
            {multi: true});
        Drugs.update({schedule: 'IV'},
            {
                $set: {
                    buyRisk: buyRisk + 5
                }
            },
            {multi: true});
        Drugs.update({schedule: 'V'},
            {
                $set: {
                    buyRisk: buyRisk + 5
                }
            },
            {multi: true});

        return buyRisk + 5;
    },

    'decreaseScheduleIII_VBuyRisk': function () {
        this.unblock;
        var drug = Drugs.findOne({schedule: 'III'});
        if (!drug) {
            var drug = Drugs.findOne({schedule: 'IV'});
        }
        if (!drug) {
            var drug = Drugs.findOne({schedule: 'V'});
        }
        if (!drug) {
            var buyRisk = 10;
        } else {
            var buyRisk = drug.buyRisk;
        }

        Drugs.update({schedule: 'III'},
            {
                $set: {
                    buyRisk: buyRisk - 5
                }
            },
            {multi: true});
        Drugs.update({schedule: 'IV'},
            {
                $set: {
                    buyRisk: buyRisk - 5
                }
            },
            {multi: true});
        Drugs.update({schedule: 'V'},
            {
                $set: {
                    buyRisk: buyRisk - 5
                }
            },
            {multi: true});

        return buyRisk - 5;
    },
    'increaseUnscheduledBuyRisk': function () {
        this.unblock;
        var drug = Drugs.findOne({schedule: 'unscheduled'});
        if (!drug) {
            var buyRisk = 5;
        } else {
            var buyRisk = drug.buyRisk;
        }
        Drugs.update({schedule: 'unscheduled'},
            {
                $set: {
                    buyRisk: buyRisk + 5
                }
            },
            {multi: true});

        return buyRisk + 5;
    },

    'decreaseUnscheduledBuyRisk': function () {
        this.unblock;
        var drug = Drugs.findOne({schedule: 'unscheduled'});
        if (!drug) {
            var buyRisk = 5;
        } else {
            var buyRisk = drug.buyRisk;
        }
        Drugs.update({schedule: 'unscheduled'},
            {
                $set: {
                    buyRisk: buyRisk - 5
                }
            },
            {multi: true});

        return buyRisk - 5;
    },
    'increaseSellRisk': function () {
        this.unblock;
        var drug = Drugs.findOne({});
        if (!drug) {
            var sellRisk = 5;
        } else {
            var sellRisk = drug.sellRisk;
        }
        Drugs.update({},
            {
                $set: {
                    sellRisk: sellRisk + 5
                }
            },
            {multi: true});

        return sellRisk + 5;
    },

    'decreaseSellRisk': function () {
        this.unblock;
        var drug = Drugs.findOne({});
        if (!drug) {
            var sellRisk = 5;
        } else {
            var sellRisk = drug.sellRisk;
        }
        Drugs.update({},
            {
                $set: {
                    sellRisk: sellRisk - 5
                }
            },
            {multi: true});

        return sellRisk - 5;
    },
    'decriminalize': function () {
        this.unblock;
        Drugs.update({},
            {
                $set: {
                    demandMultiplier: 1,
                    buyRisk: 0,
                    sellRisk: 0
                }
            }, {multi: true})
    },
    'gangster': function () {
        this.unblock;
        Drugs.update({},
            {
                $set: {
                    buyRisk: 0,
                    sellRisk: 0
                }
            }, {multi: true})
    },

    'PDMP': function () {
        this.unblock;
        Drugs.find({schedule: {$ne: 'unscheduled'}}).forEach(function (drug) {
            if (drug.buyRisk < 100) {
                if ((drug.buyRisk * 2) < 100) {
                    var buyRisk = drug.buyRisk * 2;
                } else {
                    var buyRisk = 100;
                }
                Drugs.update({_id: drug._id},
                    {
                        $set: {
                            buyRisk: buyRisk
                        }
                    });
            }

        });


        return
    },
    'increaseDemand': function () {
        this.unblock;
        Drugs.find({}).forEach(function (drug) {
            Drugs.update({_id: drug._id},
                {
                    $set: {
                        demandMultiplier: drug.demandMultiplier + (drug.demandMultiplier * 0.1)
                    }
                });
        });
        return true
    },
    'decreaseDemand': function () {
        this.unblock;
        Drugs.find({}).forEach(function (drug) {
            var basedemandMultiplier;
            if (drug.demandMultiplier < 1.1) {
                basedemandMultiplier = 1.1;
            } else {
                basedemandMultiplier = drug.demandMultiplier;
            }
            Drugs.update({_id: drug._id},
                {
                    $set: {
                        demandMultiplier: basedemandMultiplier - (drug.demandMultiplier * 0.1)
                    }
                });
        });
        return true
    },
    'controlledSubstancesAct': function () {
        this.unblock;
        Drugs.update({schedule: 'II'},
            {
                $set: {
                    buyRisk: 25,
                    sellRisk: 10
                }
            }, {multi: true});

        Drugs.update({schedule: 'III'},
            {
                $set: {
                    buyRisk: 15,
                    sellRisk: 10
                }
            }, {multi: true});

        Drugs.update({schedule: 'IV'},
            {
                $set: {
                    buyRisk: 15,
                    sellRisk: 10
                }
            }, {multi: true});


        Drugs.update({schedule: 'V'},
            {
                $set: {
                    buyRisk: 15,
                    sellRisk: 10
                }
            }, {multi: true});


        Drugs.update({schedule: 'unscheduled'},
            {
                $set: {
                    buyRisk: 5,
                    sellRisk: 10
                }
            }, {multi: true});

    },
    'resetMarket': function () {
        Transactions.remove({});
        DrugPrice.remove({});
        ScoreBoard.remove({});
    },

    'resetDrugs': function () {
        this.unblock;
        Drugs.remove({});

        Drugs.insert({
            name: 'alprazolam',
            schedule: 'IV',
            awp: 2,
            buyRisk: 10,
            sellRisk: 10,
            demandMultiplier: 150,
            active: true
        });

        Drugs.insert({
            name: 'amphetamine',
            schedule: 'II',
            awp: 2,
            buyRisk: 10,
            sellRisk: 10,
            demandMultiplier: 200,
            active: true
        });
        Drugs.insert({
            name: 'hydrocodone',
            schedule: 'II',
            awp: 8.5,
            buyRisk: 15,
            sellRisk: 10,
            demandMultiplier: 200,
            active: true
        });

        Drugs.insert({
            name: 'oxandrolone',
            schedule: 'III',
            awp: 1,
            buyRisk: 5,
            sellRisk: 5,
            demandMultiplier: 150,
            active: true
        });


        Drugs.insert({
            name: 'oxycodone',
            schedule: 'II',
            awp: 8.5,
            buyRisk: 25,
            sellRisk: 10,
            demandMultiplier: 300,
            active: true
        });


        Drugs.insert({
            name: 'trazodone',
            schedule: 'unscheduled',
            awp: 1,
            buyRisk: 5,
            sellRisk: 5,
            demandMultiplier: 100,
            active: true
        });


    },
    'resetPlayers': function () {
        this.unblock;
        Meteor.users.remove({username: {$not: /^admin.*/}});
    }


});

