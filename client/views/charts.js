Template.layout.drugPriceTrends = function () {

    drugPriceTrendsFunction = function () {
        var drugPriceTrends = "[";

        Drugs.find({active: true}, {sort: {name: 1}}).forEach(function (drug) {

            drugPriceTrends += ' { name: \"';

            drugPriceTrends += drug.name;

            drugPriceTrends += '\", data: [';


            DrugPrice.find({drug_id: drug._id}, {sort: {name: 1}}).forEach(function (pricePoint) {
                if (pricePoint.time != '' && pricePoint.price != '') {
                    drugPriceTrends = drugPriceTrends + "[Date.UTC(1970, 1, 1, " + moment(pricePoint.time).format('H, m, s') + "), " + pricePoint.price + "],";
                }

            });
            drugPriceTrends += "]},";


        });

        drugPriceTrends += "]";


        return drugPriceTrends
    };


    var drugPriceTrends = drugPriceTrendsFunction();

    drugPriceTrends = [

        {
            name: "alprazolam",
            data: [
                [Date.UTC(1970, 1, 1, 10, 18, 30), 80], [Date.UTC(1970, 1, 1, 10, 18, 46), 80], [Date.UTC(1970, 1, 1, 10, 19, 2), 80], [Date.UTC(1970, 1, 1, 10, 19, 17), 80],
                [Date.UTC(1970, 1, 1, 10, 40, 41), 80], [Date.UTC(1970, 1, 1, 10, 40, 57), 80], [Date.UTC(1970, 1, 1, 10, 41, 12), 80],
                [Date.UTC(1970, 1, 1, 10, 41, 29), 80],
                [Date.UTC(1970, 1, 1, 10, 41, 44), 80],
            ]
        },


        {
            name: "amphetamine",
            data: [[Date.UTC(1970, 1, 1, 10, 18, 30), 80], [Date.UTC(1970, 1, 1, 10, 18, 46), 80], [Date.UTC(1970, 1, 1, 10, 19, 2), 80], [Date.UTC(1970, 1, 1, 10, 19, 17), 80], [Date.UTC(1970, 1, 1, 10, 40, 41), 80], [Date.UTC(1970, 1, 1, 10, 40, 57), 80], [Date.UTC(1970, 1, 1, 10, 41, 12), 80], [Date.UTC(1970, 1, 1, 10, 41, 29), 80], [Date.UTC(1970, 1, 1, 10, 41, 44), 80],]
        }, {
            name: "hydrocodone",
            data: [[Date.UTC(1970, 1, 1, 10, 18, 30), 340], [Date.UTC(1970, 1, 1, 10, 18, 46), 340], [Date.UTC(1970, 1, 1, 10, 19, 2), 340], [Date.UTC(1970, 1, 1, 10, 19, 17), 340], [Date.UTC(1970, 1, 1, 10, 40, 41), 340], [Date.UTC(1970, 1, 1, 10, 40, 57), 340], [Date.UTC(1970, 1, 1, 10, 41, 12), 340], [Date.UTC(1970, 1, 1, 10, 41, 29), 340], [Date.UTC(1970, 1, 1, 10, 41, 44), 340],]
        }, {
            name: "oxandrolone",
            data: [[Date.UTC(1970, 1, 1, 10, 18, 30), 40], [Date.UTC(1970, 1, 1, 10, 18, 46), 40], [Date.UTC(1970, 1, 1, 10, 19, 2), 40], [Date.UTC(1970, 1, 1, 10, 19, 17), 40], [Date.UTC(1970, 1, 1, 10, 40, 41), 40], [Date.UTC(1970, 1, 1, 10, 40, 57), 40], [Date.UTC(1970, 1, 1, 10, 41, 12), 40], [Date.UTC(1970, 1, 1, 10, 41, 29), 40], [Date.UTC(1970, 1, 1, 10, 41, 44), 40],]
        }, {
            name: "oxycodone",
            data: [[Date.UTC(1970, 1, 1, 10, 18, 30), 340], [Date.UTC(1970, 1, 1, 10, 18, 46), 340], [Date.UTC(1970, 1, 1, 10, 19, 2), 340], [Date.UTC(1970, 1, 1, 10, 19, 17), 340], [Date.UTC(1970, 1, 1, 10, 40, 41), 340], [Date.UTC(1970, 1, 1, 10, 40, 57), 340], [Date.UTC(1970, 1, 1, 10, 41, 12), 340], [Date.UTC(1970, 1, 1, 10, 41, 29), 340], [Date.UTC(1970, 1, 1, 10, 41, 44), 340],]
        }, {
            name: "trazodone",
            data: [[Date.UTC(1970, 1, 1, 10, 18, 30), 40], [Date.UTC(1970, 1, 1, 10, 18, 46), 40], [Date.UTC(1970, 1, 1, 10, 19, 2), 40], [Date.UTC(1970, 1, 1, 10, 19, 17), 40], [Date.UTC(1970, 1, 1, 10, 40, 41), 40], [Date.UTC(1970, 1, 1, 10, 40, 57), 40], [Date.UTC(1970, 1, 1, 10, 41, 12), 40], [Date.UTC(1970, 1, 1, 10, 41, 29), 40], [Date.UTC(1970, 1, 1, 10, 41, 44), 40],]
        },]

    console.log(drugPriceTrends);


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


        series: drugPriceTrends

    }


}
;