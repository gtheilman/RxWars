Router.configure({
    layoutTemplate: 'layout'
    // loadingTemplate: 'loading'
});


Router.map(function () {

    this.route('/', {
        name: 'buysell',
        fastRender: true,
        template: 'buysell',
        waitOn: function () {
            return Meteor.subscribe('transactions');
        }
    });
});


MainController = RouteController.extend({
    action: function () {

    }
});




