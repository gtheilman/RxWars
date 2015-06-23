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
            background-color: #ffaa56;
        }

        .CSSTableGenerator tr:nth-child(even) {
            background-color: #ffffff;
        }

        .CSSTableGenerator td {
            vertical-align: middle;

            border: 1px solid #000000;
            border-width: 0px 1px 1px 0px;
            text-align: left;
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
            background: -o-linear-gradient(bottom, #ff7f00 5%, #bf5f00 100%);
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #ff7f00), color-stop(1, #bf5f00));
            background: -moz-linear-gradient(center top, #ff7f00 5%, #bf5f00 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ff7f00", endColorstr="#bf5f00");
            background: -o-linear-gradient(top, #ff7f00, bf5f00);

            background-color: #ff7f00;
            border: 0px solid #000000;
            text-align: center;
            border-width: 0px 0px 1px 1px;
            font-size: 14px;
            font-family: Arial;
            font-weight: bold;
            color: #ffffff;
        }

        .CSSTableGenerator tr:first-child:hover td {
            background: -o-linear-gradient(bottom, #ff7f00 5%, #bf5f00 100%);
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #ff7f00), color-stop(1, #bf5f00));
            background: -moz-linear-gradient(center top, #ff7f00 5%, #bf5f00 100%);
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ff7f00", endColorstr="#bf5f00");
            background: -o-linear-gradient(top, #ff7f00, bf5f00);

            background-color: #ff7f00;
        }

        .CSSTableGenerator tr:first-child td:first-child {
            border-width: 0px 0px 1px 0px;
        }

        .CSSTableGenerator tr:first-child td:last-child {
            border-width: 0px 0px 1px 1px;
        }

    </style>

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


</body>
</html>

<CFQUERY NAME="Transactions" datasource="#application.datasource#">
	Select
	  RxWars_Teams.TeamName,
	  RxWars_Teams.TeamNumber,
	  RxWars_Drugs.DrugName,
	  RxWars_Transactions.*
	From
	  RxWars_Teams Inner Join
	  RxWars_Transactions On RxWars_Teams.id = RxWars_Transactions.teamid
	  Left Join
	  RxWars_Drugs On RxWars_Transactions.drugid = RxWars_Drugs.id
	Where
	  RxWars_Transactions.teamid = #URL.teamid#
</CFQUERY>




<div class="CSSTableGenerator">
<table>
    <tr>
        <td>Time</td>

        <td>Transaction</td>
        <td>Drug</td>
        <td>Purchased</td>
        <td>Credit</td>
        <td>Sold</td>
        <td>Debit</td>

        <td>Loanshark</td>
        <td>Interest</td>
        <td>Fine</td>

        <td>Cash</td>
        <td>Debt</td>
        <td>Net</td>
    </tr>

<cfloop query="Transactions" startrow="2">

    <cfoutput>
            <tr>
            <td>
            #TimeFormat(currenttime, "HH:MM:SS")#
            </td>



            <cfif busted is not "">
                    <td>Busted</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                <td>#DollarFormat(Evaluate(busted * - 1))#</td>


<!--- Drug Purchase --->
                <cfelseif quantity GT 0>
                    <td>Purchase</td>
                <td>#drugname#</td>
            <td>#quantity# @ #AWP#</td>
            <td>#DollarFormat(Evaluate(quantity * AWP * - 1))#</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>

                <cfelseif loanshark IS NOT "">
                    <td>Loan Shark</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                <td>#Dollarformat(loanshark)#</td>
                <td></td>
                <td></td>

                <cfelseif interest IS NOT "">
                    <td>Loan Interest</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                <td>#Dollarformat(interest)#</td>
                <td></td>


<!--- Drug Sale --->
                <cfelseif quantity LT 0>
                    <td>Sale</td>
                <td>#drugname#</td>
                <td></td>
                <td></td>
            <td>#Evaluate(- 1 * quantity)# @ #marketprice#</td>
            <td>#DollarFormat(Evaluate(quantity * marketprice * - 1))#</td>
                <td></td>
                <td></td>
                <td></td>
<!--- LoanShark --->

            <cfelse>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
            </cfif>









                <td>
                #DollarFormat(cash)#
                </td>


            <cfif debt GT 0>
                    <td>#DollarFormat(Evaluate(- 1 * debt))#</td>
            <cfelse>
                    <td></td>
            </cfif>

            <cfset variables.net = cash - debt>
            <td>#DollarFormat(net)#</td>

        </tr>
    </cfoutput>
</cfloop>
</table>
</div>

 