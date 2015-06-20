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

    this.route('resetgame', {
        path: '/resetgame',
        name: 'resetgame',
        action: function () {
            if (confirm("Are you sure you really want to reset the entire game?")) {
                Transactions.remove({});
                Router.go('AdminDashboard.path/Transactions');
            }
        }
    });
});


MainController = RouteController.extend({
    action: function () {

    }
});




