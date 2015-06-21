AdminConfig = {
    nonAdminRedirectRoute: '/',
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
        },
        DrugPrice: {
            tableColumns: [
                {label: 'Time', name: 'time'},
                {label: 'Drug Name', name: 'drugName()'},
                {label: 'Price', name: 'price'},
                {label: 'Number Available', name: 'numberAvailable'},
                {label: 'Drug ID', name: 'drug_id'}
            ]
        },

        Transactions: {
            tableColumns: [
                {label: 'Time', name: 'time'},
                {label: 'Team ID', name: 'team_id'},
                {label: 'Drug ID', name: 'drug_id'},
                {label: 'Buy Quantity', name: 'buyQuantity'},
                {label: 'Buy Price', name: 'buyPrice'},
                {label: 'Sell Quantity', name: 'sellQuantity'},
                {label: 'Sell Price', name: 'sellPrice'},
                {label: 'Legal Fees', name: 'legalFees'},
                {label: 'Sell Risk', name: 'sellRisk'},
                {label: 'Loan Payment', name: 'loanPayment'},
                {label: 'Team Cash', name: 'teamCash'},
                {label: 'Team Debt', name: 'teamDebt'}
            ]
        }
    }

};

//AdminDashboard.addSidebarItem('Settings Page', Meteor.absoluteUrl() + 'settings', icon:'cog');

AdminDashboard.addSidebarItem('Settings Page', Meteor.absoluteUrl() + 'settings', {
    icon: 'cog'
});
