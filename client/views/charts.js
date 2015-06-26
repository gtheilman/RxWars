Template.layout.drugPriceTrends = function () {

    function drugPriceTrends() {
        var data = [];

        Drugs.find({active: true}, {sort: {name: 1}}).forEach(function (drug) {
            var element = {};
            element.name = drug.name;
            element.data = [];
            var time = 0;
            var price = 0;

            DrugPrice.find({drug_id: drug._id}, {sort: {name: 1}}).forEach(function (pricePoint) {
                if (pricePoint.time != '' && pricePoint.price != '') {
                    time = parseInt(moment(pricePoint.time).format('X'));
                    price = pricePoint.price;
                    element.data.push([time, price]);
                }
            });
            data.push(element);
        });

        if (!jQuery.isEmptyObject(data)) {
            return data
        }
    }


    return {
        chart: {
            type: 'spline'
        },
            title: {
                text: 'Prescription Drug Prices'
            },
        subtitle: {
            text: 'Average Street Prices'
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


        series: [drugPriceTrends()]

    }



}
;


