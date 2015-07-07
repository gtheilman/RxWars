Router.configure({
    layoutTemplate: 'layout'
    // loadingTemplate: 'loading'
});


Router.map(function () {

    this.route('/', {
        name: 'buysell',
        fastRender: true,
        template: 'buysell'

    });
    this.route('/settings', {
        layoutTemplate: 'layoutSettings',
        name: 'settings',
        fastRender: true
    });


});








