Meteor.publish('drugs', function () {
    return Drugs.find();
});
