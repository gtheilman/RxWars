// This prevents people from creating accounts using the login dialog
//  New users (faculty) can only be created by someone who is already logged in

/*

 Accounts.config({
 forbidClientAccountCreation: true
 });

 */

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


    });
}


