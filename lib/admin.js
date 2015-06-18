AdminConfig = {
    nonAdminRedirectRoute: 'entrySignIn',
    collections: {
        Drugs: {
            tableColumns: [
                {label: 'Name', name: 'name'},
                {label: 'Schedule', name: 'schedule'},
                {label: 'AWP', name: 'awp'},
                {label: 'Buy Risk', name: 'buyRisk'},
                {label: 'Sell Risk', name: 'sellRisk'},
                {label: 'Demand Multiplier', name: 'demandMultiplier'},
                {label: 'Active', name: 'active'}
            ]
        }
    }
};