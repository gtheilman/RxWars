Template.drugPriceTrends.onRendered(function () {

    Meteor.setInterval(function () {

        Meteor.call('drugPriceTrends', function (error, result) {
            if (result) {

                $('#container-drugPriceTrends').highcharts({
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: 'Street Prices'
                    },
                    subtitle: {
                        text: 'Proportional to units available'
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: { // don't display the dummy year
                            Time: '%H:%M'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Street Price ($)'
                        },
                        min: 0
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.series.name + '</b><br/>' +
                                Highcharts.dateFormat('%H:%M', this.x) + '</b><br/>' +
                                '$' + this.y;
                        }
                    },

                    series: result
                });

            } else {
                console.log(error);
            }


        });
    }, 60000);


});


Template.drugVolumeTrends.onRendered(function () {

    Meteor.setInterval(function () {

        Meteor.call('drugVolumeTrends', function (error, result) {
            if (result) {

                $('#container-drugVolumeTrends').highcharts({
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: 'Units Sold'
                    },
                    subtitle: {
                        text: 'Updated every minute'
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: { // don't display the dummy year
                            Time: '%H:%M'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Number sold'
                        },
                        min: 0
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.series.name + '</b><br/>' +
                                Highcharts.dateFormat('%H:%M', this.x) + '</b><br/>'
                                + this.y + ' units';
                        }
                    },

                    series: result
                });

            } else {
                console.log(error);
            }


        });
    }, 60000);


});



