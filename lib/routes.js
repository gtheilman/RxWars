Router.configure({
    layoutTemplate: 'layout'
    // loadingTemplate: 'loading'
});

Router.route('/', {
    name: 'home',
    controller: 'MainController',
    fastRender: true  // put this in pages that should be fast-rendered
});

Router.route('drugs', {
    name: 'drugs',
    // fastRender: true,
    template: 'drugs'
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




