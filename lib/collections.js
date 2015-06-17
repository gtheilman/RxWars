Drugs = new Mongo.Collection("drugs");

// Define the schema

Schemas = {};

Schemas.Drug = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    schedule: {
        type: String,
        label: "Schedule"
    },
    awp: {
        type: Number,
        label: "AWP",
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


/*

 Schemas.User = new SimpleSchema({
 username: {
 type: String,
 regEx: /^[a-z0-9A-Z_]{3,15}$/
 },
 emails: {
 type: [Object],
 // this must be optional if you also use other login services like facebook,
 // but if you use only accounts-password, then it can be required
 optional: false
 },
 "emails.$.address": {
 type: String,
 regEx: SimpleSchema.RegEx.Email
 },
 "emails.$.verified": {
 type: Boolean
 },
 createdAt: {
 type: Date
 }

 });

 Meteor.users.attachSchema(Schemas.User);



 */



/*  Sample




 Books = new Mongo.Collection("books");

 // Define the schema
 Schemas.Book = new SimpleSchema({
 title: {
 type: String,
 label: "Title",
 max: 200
 },
 author: {
 type: String,
 label: "Author"
 },
 copies: {
 type: Number,
 label: "Number of copies",
 min: 0
 },
 lastCheckedOut: {
 type: Date,
 label: "Last date this book was checked out",
 optional: true
 },
 summary: {
 type: String,
 label: "Brief summary",
 optional: true,
 max: 1000
 }
 });


 Books.attachSchema(Schemas.Book);




 */
