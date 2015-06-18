if (Meteor.isServer) Meteor.methods({


    'updatePrices': function () {
        Drugs.find().forEach(function (drug) {
            entry = {
                time: new Date(),
                drug_id: drug._id,
                price: Math.round(drug.awp * Math.random() * 100) / 100,
                numberAvailable: parseInt(1000 * Math.random())
            };
            DrugPrice.insert(entry);
        })
    }
});

