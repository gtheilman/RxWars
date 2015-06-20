Meteor.publish('drugs', function () {
    return Drugs.find({});
});


Meteor.publish('drugprice', function () {
    return DrugPrice.find({});
});



Meteor.publish('transactions', function () {
    if (Roles.userIsInRole(this.userId, 'admin')) {
        return Transactions.find();
    } else {
        return Transactions.find({team_id: this.userId})
    }
});


/*


 Meteor.publish('drugprice', function () {
 //returns empty set if not logged in or not in these roles

 if (Roles.userIsInRole(this.userId, 'admin') || Roles.userIsInRole(this.userId, 'grader')) {
 return Consults.find();
 }
 });
 */
