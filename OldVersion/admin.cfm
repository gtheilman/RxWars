<cfif Not IsDefined("Application.refractoryperiod")>
    <cfset application.refractoryperiod = 5>
    <cfelseif isDefined("Form.refractoryperiod")>
    <cfset application.refractoryperiod = form.refractoryperiod>
</cfif>

<cfif Not IsDefined("Application.startstop")>
    <cfset application.startstop = 1>
    <cfelseif isDefined("URL.startstop")>
    <cfset application.startstop = URL.startstop>
</cfif>

<cfif IsDefined("URL.nuke")>

    <CFQUERY NAME="NukeTransactions" datasource="#application.datasource#">
		Delete  from RxWars_Transactions
   </cfquery>

    <CFQUERY NAME="NukeMarket" datasource="#application.datasource#">
		Delete  from RxWars_Market
   </cfquery>


</cfif>

<cfif IsDefined("Form.id")>
    <CFQUERY NAME="Drugs" datasource="#application.datasource#">
		UPDATE RxWars_Drugs
			SET DrugName='#Form.DrugName#',
				Active = '#Form.Active#',
				AWP = '#Form.AWP#',
				BaseDemand = '#Form.BaseDemand#',
				BuyRisk = '#Form.BuyRisk#',
				DemandMultiplier = '#Form.DemandMultiplier#',
				SellRisk = '#Form.SellRisk#',
				SupplyMultiplier = '#Form.SupplyMultiplier#'
			WHERE id ='#Form.id#'
   </cfquery>


</cfif>




<html>
<head>


    <style type="text/css">
        .CSSTableGenerator {
            margin: 0px;
            padding: 0px;
            width: 100%;
            box-shadow: 10px 10px 5px #888888;
            border: 1px solid #000000;

            -moz-border-radius-bottomleft: 0px;
            -webkit-border-bottom-left-radius: 0px;
            border-bottom-left-radius: 0px;

            -moz-border-radius-bottomright: 0px;
            -webkit-border-bottom-right-radius: 0px;
            border-bottom-right-radius: 0px;

            -moz-border-radius-topright: 0px;
            -webkit-border-top-right-radius: 0px;
            border-top-right-radius: 0px;

            -moz-border-radius-topleft: 0px;
            -webkit-border-top-left-radius: 0px;
            border-top-left-radius: 0px;
        }

        .CSSTableGenerator table {
            border-collapse: collapse;
            border-spacing: 0;
            width: 100%;
            height: 100%;
            margin: 0px;
            padding: 0px;
        }

        .CSSTableGenerator tr:last-child td:last-child {
            -moz-border-radius-bottomright: 0px;
            -webkit-border-bottom-right-radius: 0px;
            border-bottom-right-radius: 0px;
        }

        .CSSTableGenerator table tr:first-child td:first-child {
            -moz-border-radius-topleft: 0px;
            -webkit-border-top-left-radius: 0px;
            border-top-left-radius: 0px;
        }

        .CSSTableGenerator table tr:first-child td:last-child {
            -moz-border-radius-topright: 0px;
            -webkit-border-top-right-radius: 0px;
            border-top-right-radius: 0px;
        }

        .CSSTableGenerator tr:last-child td:first-child {
            -moz-border-radius-bottomleft: 0px;
            -webkit-border-bottom-left-radius: 0px;
            border-bottom-left-radius: 0px;
        }

        .CSSTableGenerator tr:hover td {

        }

        .CSSTableGenerator tr:nth-child(odd) {
            background-color: #e5e5e5;
        }

        .CSSTableGenerator tr:nth-child(even) {
            background-color: #ffffff;
        }

        .CSSTableGenerator td {
            vertical-align: middle;

            border: 1px solid #000000;
            border-width: 0px 1px 1px 0px;
            text-align: center;
            padding: 7px;
            font-size: 10px;
            font-family: Arial;
            font-weight: normal;
            color: #000000;
        }

        .CSSTableGenerator tr:last-child td {
            border-width: 0px 1px 0px 0px;
        }

        .CSSTableGenerator tr td:last-child {
            border-width: 0px 0px 1px 0px;
        }

        .CSSTableGenerator tr:last-child td:last-child {
            border-width: 0px 0px 0px 0px;
        }

        .CSSTableGenerator tr:first-child td {
            background: -o-linear-gradient(bottom, #cccccc 5%, #b2b2b2 100%);
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #cccccc), color-stop(1, #b2b2b2));
            background: -moz-linear-gradient(center top, #cccccc 5%, #b2b2b2 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#cccccc", endColorstr="#b2b2b2");
            background: -o-linear-gradient(top, #cccccc, b2b2b2);

            background-color: #cccccc;
            border: 0px solid #000000;
            text-align: center;
            border-width: 0px 0px 1px 1px;
            font-size: 14px;
            font-family: Arial;
            font-weight: bold;
            color: #000000;
        }

        .CSSTableGenerator tr:first-child:hover td {
            background: -o-linear-gradient(bottom, #cccccc 5%, #b2b2b2 100%);
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #cccccc), color-stop(1, #b2b2b2));
            background: -moz-linear-gradient(center top, #cccccc 5%, #b2b2b2 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#cccccc", endColorstr="#b2b2b2");
            background: -o-linear-gradient(top, #cccccc, b2b2b2);

            background-color: #cccccc;
        }

        .CSSTableGenerator tr:first-child td:first-child {
            border-width: 0px 0px 1px 0px;
        }

        .CSSTableGenerator tr:first-child td:last-child {
            border-width: 0px 0px 1px 1px;
        }

    </style>


    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
</head>
<body>



<CFQUERY NAME="Drugs" datasource="#application.datasource#">
		Select
		  *
		From
		  RxWars_Drugs
 
		Order By
		  RxWars_Drugs.id
</CFQUERY>



<button id="DrugPriceTrends">Drug Price Trends</button>
<button id="GroupProfitTrends">Team Profit Trends</button>
<button id="TeamProfitTable">Team Profit Table</button>
<button id="MarketProfitTrends">Market Profit Trend</button>
<button id="DrugVolumeTrends">Drug Volume Trends</button>
<button id="MarketVolumeTrend">Market Volume Trend</button>



<div class="CSSTableGenerator">
<table>
    <tr>
        <td>id</td>
        <td>Drug Name</td>
        <td>Cost</td>
        <td>Buy Risk</td>
        <td>Sell Risk</td>
        <td>Supply Factor</td>
        <td>Demand Factor</td>
        <td>Base Demand</td>
        <td>Active</td>
        <td></td>
        <td></td>

    </tr>

<cfloop query="Drugs">
    <cfoutput>

        <form id="Drug_#id#" name="Drug_#id#" action="admin.cfm" method="post">
    <tr>
    <td>
        #id#
        </td>
        <td>
                <input type="text" id="drugname_#id#"  name="drugname" size="15" value="#drugname#"></input>
    </td>
    <td>
            <input type="text" id="AWP_#id#"  name="AWP" size="5" value="#AWP#"></input>
    </td>
    <td>
            <input type="text" id="BuyRisk_#id#"  name="BuyRisk"
                   size="5" value="#NumberFormat(BuyRisk, '99.99')#"></input>
    </td>
    <td>
            <input type="text" id="SellRisk_#id#"  name="SellRisk"
                   size="5" value="#NumberFormat(SellRisk, '99.99')#"></input>
    </td>
    <td>
            <input type="text" id="SupplyMultiplier_#id#"  name="SupplyMultiplier"
                   size="5" value="#NumberFormat(SupplyMultiplier, '99.9')#"></input>
    </td>
    <td>
            <input type="text" id="DemandMultiplier_#id#"  name="DemandMultiplier"
                   size="5" value="#NumberFormat(DemandMultiplier, '99.9')#"></input>
    </td>
    <td>
            <input type="text" id="BaseDemand_#id#"  name="BaseDemand" size="5" value="#BaseDemand#"></input>
    </td>
    <td>
            <input type="text" id="Active_#id#"  name="Active" size="3" value="#Active#"></input>
    </td>
        <td>
            <input type="Submit" value="Update">
        </td>


            <input type="hidden" name="id" value=#id#>
    </form>
    <td>
            <button id="DrugPriceTrends_#id#">Drug Price Trends</button><br>
            <button id="DrugVolumeTrends_#id#">Drug Volume Trends</button>
    </td>
        </tr>
    </cfoutput>
</cfloop>

</table>
</div>

<hr>
<p>
    Application Variables (requires user page refresh)
</p>
<cfoutput>
    <div>
    <form id="UpdateApplication" name="UpdateApplication" action="admin.cfm" method="post">
    <table>
    <tr>
        <td>Refractory Period (seconds)</td>
    <td>
            <input type="text" id="refractoryperiod"  name="refractoryperiod"
                   size="3" value="#application.refractoryperiod#"></input>
</td>

</tr>

    <tr>


        <td>
            <input type="Submit" value="Update">
        </td>
        <td>
        <td>
    </tr>


</table>
</form>
</div>
</cfoutput>

<hr>
<cfif application.startstop IS 1>
    <a href="admin.cfm?startstop=0">Stop Application</a>
<cfelse>
    <a href="admin.cfm?startstop=1">Start Application</a>
</cfif>




<hr>

<a href="admin.cfm?nuke=1">Clear Market and Transaction Data</a>



</body>
</html>






<cfoutput>
    <script>

            $("##DrugPriceTrends").click(function () {

    window.open('DrugPriceTrends.cfm', 'DrugPriceTrends', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=920,height=500');


});

</script>
</cfoutput>

<cfoutput>
    <script>

            $("##GroupProfitTrends").click(function () {

    window.open('GroupProfitTrends.cfm', 'GroupProfitTrends', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=920,height=500');


});

</script>
</cfoutput>

<cfoutput>
    <script>

            $("##DrugVolumeTrends").click(function () {

    window.open('DrugVolumeTrends.cfm', 'DrugVolumeTrends', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=920,height=500');


});

</script>
</cfoutput>

<cfoutput>
    <script>

            $("##MarketProfitTrends").click(function () {

    window.open('MarketProfitTrends.cfm', 'MarketProfitTrends', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=920,height=500');


});

</script>
</cfoutput>

<cfoutput>
    <script>

            $("##MarketVolumeTrend").click(function () {

    window.open('MarketVolumeTrend.cfm', 'MarketVolumeTrend', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=920,height=500');


});

</script>
</cfoutput>

<cfloop query="Drugs">
    <cfoutput>


        <script>

                $("##DrugPriceTrends_#id#").click(function() {

            window.open('DrugPriceTrends.cfm?id=#id#','DrugPriceTrends','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=920,height=500');



    });



            $("##DrugVolumeTrends_#id#").click(function() {

            window.open('DrugVolumeTrends.cfm?id=#id#','DrugVolumeTrends','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=920,height=500');



    });

    </script>


    </cfoutput>
</cfloop>


<script>

    $("#TeamProfitTable").click(function () {

        window.open('GroupProfitTable.cfm?', 'TeamProfitTable', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=1000');


    });


</script>

