// Define the schema

Schemas = {};


Drugs = new Mongo.Collection("drugs");

Schemas.Drug = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    schedule: {
        type: String,
        allowedValues: [
            "II",
            "III",
            "IV",
            "V",
            "unscheduled"
        ],
        optional: false,
        label: "Schedule"
    },

    awp: {
        type: Number,
        label: "AWP (dollars)",
        decimal: true,
        min: 0
    },
    buyRisk: {
        type: Number,
        label: "Buy Risk Percent",
        min: 0,
        defaultValue: 10
    },
    sellRisk: {
        type: Number,
        label: "Sell Risk Percent",
        min: 0
    },
    demandMultiplier: {
        type: Number,
        label: "Demand Multiplier",
        min: 0,
        decimal: true,
        defaultValue: 1
    },
    active: {
        type: Boolean,
        label: "Active",
        defaultValue: true

    }
});

Drugs.attachSchema(Schemas.Drug);


DrugPrice = new Mongo.Collection("drugprice");

Schemas.DrugPrice = new SimpleSchema({
    time: {
        type: Date,
        label: "Time",
        autoValue: function () {
            return new Date;
        }
    },
    drug_id: {
        type: String,
        label: "Drug ID"
    },

    price: {
        type: Number,
        label: "Street Price",
        decimal: true,
        min: 0
    },
    numberAvailable: {
        type: Number,
        label: "Total Number Available",
        min: 0
    }
});

DrugPrice.attachSchema(Schemas.DrugPrice);

DrugPrice.helpers({
    drugName: function () {
        return Drugs.findOne({_id: this.drug_id}).name;
    }
});


Transactions = new Mongo.Collection("transactions");

Schemas.Transactions = new SimpleSchema({
    time: {
        type: Date,
        label: "Time",
        autoValue: function () {
            return new Date;
        }
    },
    epoch: {
        type: Number,
        label: "Epoch",
        autoValue: function () {
            return Date.parse(new Date);
        }
    },
    team_id: {
        type: String,
        label: "Team ID",
        autoValue: function () {
            return Meteor.userId()
        }
    },
    drug_id: {
        type: String,
        label: "Drug ID",
        optional: true
    },
    buyQuantity: {
        type: Number,
        label: "Buy Quantity",
        optional: true,
        max: 300
    },
    buyPrice: {
        type: Number,
        label: "Buy Price",
        decimal: true,
        min: 0,
        optional: true
    },
    sellQuantity: {
        type: Number,
        label: "Sell Quantity",
        optional: true
    },
    sellPrice: {
        type: Number,
        label: "Sell Price",
        decimal: true,
        min: 0,
        optional: true
    },
    inventoryForward: {
        type: Number,
        label: "Inventory",
        optional: true
    },
    legalFees: {
        type: Number,
        label: "Legal Fees",
        decimal: true,
        min: 0,
        optional: true
    },
    loanPayment: {
        type: Number,
        label: "Loan Payment",
        decimal: true,
        min: 0,
        optional: true
    },
    loanAmount: {
        type: Number,
        label: "Loan Amount",
        decimal: true,
        min: 0,
        optional: true
    },
    loanInterest: {
        type: Number,
        label: "Loan Interest",
        decimal: true,
        min: 0,
        optional: true
    },
    snitchFee: {
        type: Number,
        label: "Snitch Fee",
        decimal: true,
        min: 0,
        optional: true
    },


    teamCash: {
        type: Number,
        label: "Cash (dollars)",
        decimal: true,
        min: 0,
        optional: true
    },
    teamDebt: {
        type: Number,
        label: "Debt (dollars)",
        decimal: true,
        min: 0,
        optional: true

    }
});


Transactions.attachSchema(Schemas.Transactions);


ServerSession = new Mongo.Collection("serversession"); // server variable storage


Snitches = new Mongo.Collection("snitches");


TeamBuySell = new Meteor.Collection(null);  // local non-saved collection

ScoreBoard = new Mongo.Collection("scoreboard");



