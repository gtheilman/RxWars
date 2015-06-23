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

<CFQUERY NAME="Prices" datasource="#application.datasource#">
  Select  *
  From
    RxWars_Market
  Where marketprice > 0
  Order by id  
</CFQUERY>

<script>

        $(function () {
        $('#container').highcharts({
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


    series: [


    <cfloop query="Drugs">

        <cfoutput>
            <CFQUERY NAME="GetDrug" datasource="#application.datasource#">
						Select
						  RxWars_Market.CurrentTime,
						  RxWars_Market.drugid,
						  RxWars_Drugs.DrugName,
						  RxWars_Market.marketprice
						From
						  RxWars_Market Inner Join
						  RxWars_Drugs On RxWars_Drugs.id = RxWars_Market.drugid
						Where
						  RxWars_Market.drugid = #Drugs.id#
						Order By
						  RxWars_Market.CurrentTime
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

        [Date.UTC(1970, 10, 10,#Timeformat(CurrentTime, "H")#,#Timeformat(CurrentTime, "M")#,#Timeformat(CurrentTime, "S")#), #marketprice# ],


        </cfoutput>


        ]
        },


    </cfloop>

    ]
});
});

</script>