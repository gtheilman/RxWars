Template.drugs.helpers({
    drugs: function () {
        return Drugs.find({});
    }
});

Template.drugs.events({
    'click button': function (event, template) {
        Session.set('myAppVariable', Math.floor(Math.random() * 11));
    }
});