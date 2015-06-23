<html>
<head>
    <script type="text/JavaScript">
        <!--
        function timedRefresh(timeoutPeriod) {
            setTimeout("location.reload(true);", timeoutPeriod);
        }
        //   -->
    </script>
</head>
<body onload="JavaScript:timedRefresh(60000);">


<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>

<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>


</body>
</html>




<script>

        $(function () {
        $('#container').highcharts({
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Total Net Profits'
    },
    subtitle: {
        text: 'Entire Marketplace'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            Time: '%H:%M'
        }
    },
    yAxis: {
        title: {
            text: 'Net Profit ($)'
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


    series: [



    <CFQUERY NAME="GetMoney" datasource="#application.datasource#">
				Select
				  *
				From
				  RxWars_Market
				Where ((TotalCash > 0) OR (TotalDebt > 0))

				Order By currentTime
				 
			</cfquery>

    <cfoutput>
    {
            name: 'All Teams',
        // Define the data points. All series have a dummy year
        // of 1970/71 in order to be compared on the same x axis. Note
        // that in JavaScript, months start at 0 for January, 1 for February etc.
    data: [
    </cfoutput>
    <cfoutput query="GetMoney">

        <cfset variables.profit = totalcash - totaldebt>

    [Date.UTC(1970, 10, 10,#Timeformat(CurrentTime, "H")#,#Timeformat(CurrentTime, "M")#,#Timeformat(CurrentTime, "S")#), #variables.profit# ],


    </cfoutput>


    ]
    },


    ]
});
});

</script>