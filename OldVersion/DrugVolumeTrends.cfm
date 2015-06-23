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
        <body<!---  onload="JavaScript:timedRefresh(60000);" --->>


<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>

<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>


</body>
</html>

<cfif isDefined("URL.id")>

    <CFQUERY NAME="Drugs" datasource="#application.datasource#">
			Select
			  RxWars_Drugs.id 
			From
			  RxWars_Drugs
			Where
			  RxWars_Drugs.Active = 1 AND RxWars_Drugs.id = #URL.id#
			Group By
			  RxWars_Drugs.id
			Order By
			  RxWars_Drugs.id
	</CFQUERY>

<cfelse>
    <CFQUERY NAME="Drugs" datasource="#application.datasource#">
			Select
			  RxWars_Drugs.id 
			From
			  RxWars_Drugs
			Where
			  RxWars_Drugs.Active = 1
			Group By
			  RxWars_Drugs.id
			Order By
			  RxWars_Drugs.id
	</CFQUERY>
</cfif>



<script>

        $(function () {
        $('#container').highcharts({
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Prescription Drug Trade Volume'
    },
    subtitle: {
        text: 'Units Purchased'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            Time: '%H:%M'
        }
    },
    yAxis: {
        title: {
            text: 'Units Purchased'
        },
        min: 0
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%H:%M', this.x) + '</b><br/>' +
                    this.y + ' units';
        }
    },


    series: [


    <cfloop query="Drugs">

        <cfoutput>
            <CFQUERY NAME="GetDrug" datasource="#application.datasource#">
						Select
						  Sum(RxWars_Transactions.quantity) As Volume,
						  DatePart(minute, RxWars_Transactions.currenttime) As Minute,
						  DatePart(hour, RxWars_Transactions.currenttime) As Hour,
						  RxWars_Drugs.DrugName
						From
						  RxWars_Transactions Left Join
						  RxWars_Drugs On RxWars_Drugs.id = RxWars_Transactions.drugid
						Where
						  RxWars_Transactions.drugid = #id# And
						  RxWars_Transactions.quantity > 0
						Group By
						  DatePart(minute, RxWars_Transactions.currenttime), DatePart(hour,
						  RxWars_Transactions.currenttime), RxWars_Drugs.DrugName
						Order By
						  Hour,
						  Minute
					</cfquery>
        </cfoutput>

        <cfoutput>
            {
            name: '#GetDrug.DrugName#',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
        data: [
        </cfoutput>
        <cfoutput query="GetDrug">

        [Date.UTC(1970, 10, 10,#Hour#,#Minute#), #Volume# ],


        </cfoutput>


        ]
        },


    </cfloop>

    ]
});
});

</script>