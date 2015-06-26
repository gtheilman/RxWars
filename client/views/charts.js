Template.layout.drugPriceTrends = function () {

    var drugPriceTrends = "[";
    console.log(drugPriceTrends);

    Drugs.find({active: true}, {sort: {name: 1}}).forEach(function (drug) {

        drugPriceTrends += ' { name: \"';
        console.log(drugPriceTrends);
        drugPriceTrends += drug.name;
        console.log(drugPriceTrends);
        drugPriceTrends += '\", data: [';
        console.log(drugPriceTrends);

        DrugPrice.find({drug_id: drug._id}, {sort: {name: 1}}).forEach(function (pricePoint) {
            if (pricePoint.time != '' && pricePoint.prce != '') {
                drugPriceTrends = drugPriceTrends + "[Date.UTC(1970, 1, 1, " + moment(pricePoint.time).format('H, m, s') + "), " + pricePoint.price + "],";
            }
            console.log(drugPriceTrends);
        });
        drugPriceTrends += "]},";
        console.log(drugPriceTrends);

    });

    drugPriceTrends += "];";

    console.log(drugPriceTrends);

    drugPriceTrends = [
        {
            name: "alprazolam",
            data: [
                [Date.UTC(1970, 1, 1, 7, 3, 59), 2.2],
                [Date.UTC(1970, 1, 1, 7, 4, 13), 2.2],
                [Date.UTC(1970, 1, 1, 7, 4, 28), 80],
                [Date.UTC(1970, 1, 1, 7, 4, 44), 11.764705882352942],
                [Date.UTC(1970, 1, 1, 7, 4, 59), 80],
                [Date.UTC(1970, 1, 1, 7, 5, 13), 80],
                [Date.UTC(1970, 1, 1, 7, 5, 29), 80],
                [Date.UTC(1970, 1, 1, 7, 5, 43), 80],
                [Date.UTC(1970, 1, 1, 7, 6, 8), 80],
            ]
        }, {
            name: "amphetamine",
            data: [[Date.UTC(1970, 1, 1, 7, 3, 59), 2.2], [Date.UTC(1970, 1, 1, 7, 4, 14), 2.2], [Date.UTC(1970, 1, 1, 7, 4, 29), 80], [Date.UTC(1970, 1, 1, 7, 4, 44), 80], [Date.UTC(1970, 1, 1, 7, 4, 59), 7.920792079207921], [Date.UTC(1970, 1, 1, 7, 5, 14), 80], [Date.UTC(1970, 1, 1, 7, 5, 29), 80], [Date.UTC(1970, 1, 1, 7, 5, 44), 80], [Date.UTC(1970, 1, 1, 7, 6, 8), 80],]
        }, {
            name: "hydrocodone",
            data: [[Date.UTC(1970, 1, 1, 7, 3, 59), 9.350000000000001], [Date.UTC(1970, 1, 1, 7, 4, 14), 9.350000000000001], [Date.UTC(1970, 1, 1, 7, 4, 29), 340], [Date.UTC(1970, 1, 1, 7, 4, 44), 340], [Date.UTC(1970, 1, 1, 7, 4, 59), 340], [Date.UTC(1970, 1, 1, 7, 5, 14), 340], [Date.UTC(1970, 1, 1, 7, 5, 29), 340], [Date.UTC(1970, 1, 1, 7, 5, 44), 340], [Date.UTC(1970, 1, 1, 7, 6, 8), 340],]
        }, {
            name: "oxandrolone",
            data: [[Date.UTC(1970, 1, 1, 7, 3, 59), 1.1], [Date.UTC(1970, 1, 1, 7, 4, 14), 1.1], [Date.UTC(1970, 1, 1, 7, 4, 29), 40], [Date.UTC(1970, 1, 1, 7, 4, 44), 40], [Date.UTC(1970, 1, 1, 7, 4, 59), 40], [Date.UTC(1970, 1, 1, 7, 5, 14), 40], [Date.UTC(1970, 1, 1, 7, 5, 29), 40], [Date.UTC(1970, 1, 1, 7, 5, 44), 40], [Date.UTC(1970, 1, 1, 7, 6, 8), 1.1],]
        }, {
            name: "oxycodone",
            data: [[Date.UTC(1970, 1, 1, 7, 3, 59), 9.350000000000001], [Date.UTC(1970, 1, 1, 7, 4, 14), 9.350000000000001], [Date.UTC(1970, 1, 1, 7, 4, 29), 340], [Date.UTC(1970, 1, 1, 7, 4, 44), 340], [Date.UTC(1970, 1, 1, 7, 4, 59), 340], [Date.UTC(1970, 1, 1, 7, 5, 14), 340], [Date.UTC(1970, 1, 1, 7, 5, 29), 340], [Date.UTC(1970, 1, 1, 7, 5, 44), 340], [Date.UTC(1970, 1, 1, 7, 6, 8), 9.350000000000001],]
        }, {
            name: "trazodone",
            data: [[Date.UTC(1970, 1, 1, 7, 3, 59), 1.1], [Date.UTC(1970, 1, 1, 7, 4, 14), 1.1], [Date.UTC(1970, 1, 1, 7, 4, 29), 40], [Date.UTC(1970, 1, 1, 7, 4, 44), 40], [Date.UTC(1970, 1, 1, 7, 4, 59), 40], [Date.UTC(1970, 1, 1, 7, 5, 14), 40], [Date.UTC(1970, 1, 1, 7, 5, 29), 40], [Date.UTC(1970, 1, 1, 7, 5, 44), 40],
                [Date.UTC(1970, 1, 1, 7, 6, 8), 1.1],
            ]
        },
    ];

    var drugPriceTrendsBAK = [
        {
            name: "Winter 2012-2013",
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            data: [
                [Date.UTC(1970, 9, 21), 0],
                [Date.UTC(1970, 10, 4), 0.28],
                [Date.UTC(1970, 10, 9), 0.25],
                [Date.UTC(1970, 10, 27), 0.2],
                [Date.UTC(1970, 11, 2), 0.28],
                [Date.UTC(1970, 11, 26), 0.28],
                [Date.UTC(1970, 11, 29), 0.47],
                [Date.UTC(1971, 0, 11), 0.79],
                [Date.UTC(1971, 0, 26), 0.72],
                [Date.UTC(1971, 1, 3), 1.02],
                [Date.UTC(1971, 1, 11), 1.12],
                [Date.UTC(1971, 1, 25), 1.2],
                [Date.UTC(1971, 2, 11), 1.18],
                [Date.UTC(1971, 3, 11), 1.19],
                [Date.UTC(1971, 4, 1), 1.85],
                [Date.UTC(1971, 4, 5), 2.22],
                [Date.UTC(1971, 4, 19), 1.15],
                [Date.UTC(1971, 5, 3), 0]
            ]
        }, {
            name: "Winter 2013-2014",
            data: [
                [Date.UTC(1970, 9, 29), 0],
                [Date.UTC(1970, 10, 9), 0.4],
                [Date.UTC(1970, 11, 1), 0.25],
                [Date.UTC(1971, 0, 1), 1.66],
                [Date.UTC(1971, 0, 10), 1.8],
                [Date.UTC(1971, 1, 19), 1.76],
                [Date.UTC(1971, 2, 25), 2.62],
                [Date.UTC(1971, 3, 19), 2.41],
                [Date.UTC(1971, 3, 30), 2.05],
                [Date.UTC(1971, 4, 14), 1.7],
                [Date.UTC(1971, 4, 24), 1.1],
                [Date.UTC(1971, 5, 10), 0]
            ]
        }, {
            name: "Winter 2014-2015",
            data: [
                [Date.UTC(1970, 10, 25), 0],
                [Date.UTC(1970, 11, 6), 0.25],
                [Date.UTC(1970, 11, 20), 1.41],
                [Date.UTC(1970, 11, 25), 1.64],
                [Date.UTC(1971, 0, 4), 1.6],
                [Date.UTC(1971, 0, 17), 2.55],
                [Date.UTC(1971, 0, 24), 2.62],
                [Date.UTC(1971, 1, 4), 2.5],
                [Date.UTC(1971, 1, 14), 2.42],
                [Date.UTC(1971, 2, 6), 2.74],
                [Date.UTC(1971, 2, 14), 2.62],
                [Date.UTC(1971, 2, 24), 2.6],
                [Date.UTC(1971, 3, 2), 2.81],
                [Date.UTC(1971, 3, 12), 2.63],
                [Date.UTC(1971, 3, 28), 2.77],
                [Date.UTC(1971, 4, 5), 2.68],
                [Date.UTC(1971, 4, 10), 2.56],
                [Date.UTC(1971, 4, 15), 2.39],
                [Date.UTC(1971, 4, 20), 2.3],
                [Date.UTC(1971, 5, 5), 2],
                [Date.UTC(1971, 5, 10), 1.85],
                [Date.UTC(1971, 5, 15), 1.49],
                [Date.UTC(1971, 5, 23), 1.08]
            ]
        }];


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
        /*        plotOptions: {
         spline: {
         marker: {
         radius: 4,
         lineColor: '#666666',
         lineWidth: 1
         }
         }
         },*/

        series: drugPriceTrends

    }
}
;