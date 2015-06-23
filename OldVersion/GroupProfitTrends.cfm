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

<CFQUERY NAME="Teams" datasource="#application.datasource#">
		Select
		  RxWars_Teams.id
		From
		  RxWars_Teams
		Where
		  RxWars_Teams.Active = 1
		Group By
		  RxWars_Teams.id
		Order By
		  RxWars_Teams.id
</CFQUERY>





<script>

        $(function () {
        $('#container').highcharts({
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Net Profits'
    },
    subtitle: {
        text: 'By Team'
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


    <cfloop query="Teams">

        <cfoutput>
            <CFQUERY NAME="GetMoney" datasource="#application.datasource#">
						Select
						  RxWars_Transactions.teamid,
						  RxWars_Teams.TeamName,
						  RxWars_Teams.TeamNumber,
						  RxWars_Transactions.currenttime,
						  RxWars_Transactions.cash,
						  RxWars_Transactions.debt
						From
						  RxWars_Teams Inner Join
						  RxWars_Transactions On RxWars_Transactions.teamid = RxWars_Teams.id
						Where
						  RxWars_Transactions.teamid = #id#
						Order By
						  RxWars_Transactions.currenttime
					</cfquery>
        </cfoutput>

        <cfoutput>
            {
            name: '#GetMoney.TeamName#',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
        data: [
        </cfoutput>
        <cfoutput query="GetMoney">
            <cfset variables.profit = cash - debt>

        [Date.UTC(1970, 10, 10,#Timeformat(CurrentTime, "H")#,#Timeformat(CurrentTime, "M")#,#Timeformat(CurrentTime, "S")#), #variables.profit# ],


        </cfoutput>


        ]
        },


    </cfloop>

    ]
});
});

</script>