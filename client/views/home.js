Template.home.helpers({
    myAppVariable: function () {
        return Session.get('myAppVariable');
    }
});

Template.home.events({
    'click button': function (event, template) {
        Session.set('myAppVariable', Math.floor(Math.random() * 11));
    }
});