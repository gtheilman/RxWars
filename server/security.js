/*  https://atmospherejs.com/ongoworks/security  */
Drugs.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();
DrugPrice.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();
Transactions.permit(['insert', 'update', 'remove']).ifHasRole('admin').apply();

