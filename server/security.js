/*  https://atmospherejs.com/ongoworks/security  */
Drugs.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();
DrugPrice.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();
Transactions.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();

// clients (moved to settings page)
Transactions.permit(['insert', 'update']).apply();
// Transactions.permit(['insert', 'update', 'remove']).never().apply();

ServerSession.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();