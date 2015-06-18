Router.configure({
    layoutTemplate: 'layout'
    // loadingTemplate: 'loading'
});


Router.map(function () {
    this.route('/', {
        name: 'home',
        controller: 'MainController',
        fastRender: true  // put this in pages that should be fast-rendered
    });

    this.route('drugs', {
        name: 'drugs',
        // fastRender: true,
        template: 'drugs'
    });

    this.route('buysell', {
        name: 'buysell',
        // fastRender: true,
        template: 'buysell'
    });
});


MainController = RouteController.extend({
    action: function () {
        this.render('home', {
            data: function () {
                return {posts: ['post red', 'post blue']}
            }
        });
    }
});




