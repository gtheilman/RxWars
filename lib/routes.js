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
    this.route('/settings', {
        layoutTemplate: 'layoutSettings',
        name: 'settings'
    });

    this.route('resetgame', {
        name: 'resetgame',
        controller: 'AdminController',
        action: function () {
            if (confirm("Are you sure you really want to reset the entire game?")) {
                Transactions.remove({});
                DrugPrice.remove({});
                Router.go('AdminDashboard.path/Transactions');
            }
        }
    });
});








