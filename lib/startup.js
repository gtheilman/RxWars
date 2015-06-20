if (Meteor.isServer) {
    Meteor.startup(function () {
        // Sets up an admin account if one does not exist.
        // Would strongly suggest changing password after first login.
        // Remember that since external user signup is disabled in accounts-ui
        // this is the only login to initially get in to set up users (faculty).
        //  If this password is lost prior to setting up other accounts
        //  you will be 'locked-out' of the application and will need to reinstall
        if (!Meteor.users.findOne({username: "admin"})) {
            // Since the absence of an admin account suggests this is the first use of the program,
            // we will take this opportunity to create roles
            Roles.createRole('admin'); // can do everything
            Accounts.createUser({
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin',
                createdAt: new Date()
            });
            var user = Meteor.users.findOne({username: 'admin'});

            Roles.addUsersToRoles(user._id, ['admin']);

        }


        if (!Drugs.findOne({})) {

            Drugs.insert({
                name: 'alprazolam',
                schedule: 'IV',
                awp: 2,
                buyRisk: 10,
                sellRisk: 10,
                demandMultiplier: 1,
                active: true
            });

            Drugs.insert({
                name: 'amphetamine',
                schedule: 'II',
                awp: 2,
                buyRisk: 25,
                sellRisk: 20,
                demandMultiplier: 1,
                active: true
            });
            Drugs.insert({
                name: 'hydrocodone',
                schedule: 'II',
                awp: 8.5,
                buyRisk: 25,
                sellRisk: 20,
                demandMultiplier: 2,
                active: true
            });

            Drugs.insert({
                name: 'oxandrolone',
                schedule: 'III',
                awp: 1,
                buyRisk: 10,
                sellRisk: 10,
                demandMultiplier: 0.5,
                active: true
            });
            Drugs.insert({
                name: 'oxycodone',
                schedule: 'II',
                awp: 8.5,
                buyRisk: 25,
                sellRisk: 33,
                demandMultiplier: 3,
                active: true
            });

            Drugs.insert({
                name: 'trazodone',
                schedule: 'II',
                awp: 1,
                buyRisk: 10,
                sellRisk: 10,
                demandMultiplier: 0.5,
                active: true
            });


        }


        Meteor.setInterval(function () {
            Meteor.call('updatePrices');
        }, 15000);

    });


}


