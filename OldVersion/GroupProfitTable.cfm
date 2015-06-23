<style>
    td {
        font-family: sans-serif;
        font-size: 30;
        padding-left: 20px;
        padding-top: 10px;
    }

    .profit {
        color: green;
    }

    .loss {
        color: red;
    }

</style>

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




<html>
<head>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script type="text/JavaScript">
        <!--
        function timedRefresh(timeoutPeriod) {
            setTimeout("location.reload(true);", timeoutPeriod);
        }
        //   -->
    </script>


</head>
<body onload="JavaScript:timedRefresh(20000);">



<table>

<cfloop query="Teams">
    <cfoutput>
            <tr>


            <CFQUERY NAME="GetTeams" datasource="#application.datasource#">
					Select *
			 
					FROM	  RxWars_Teams 
					Where
					  RxWars_Teams.id = #id#
            </cfquery>



            <CFQUERY NAME="GetMoney" datasource="#application.datasource#">
					Select Top (1)
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
					  RxWars_Transactions.teamid = #id# AND RxWars_Transactions.cash IS NOT  NULL AND   RxWars_Transactions.debt IS NOT NULL
					Order By
					  RxWars_Transactions.currenttime DESC
				</cfquery>

            <td>#GetTeams.TeamName#</td>
        <td>(Team #GetTeams.TeamNumber#)</td>
            <cfif GetMoney.recordcount GT 0>
                    <td class="<cfif Evaluate(GetMoney.cash - GetMoney.debt) GT 0>profit
                <cfelse>loss</cfif>">#DollarFormat(Evaluate(GetMoney.cash - GetMoney.debt))#</td>
            <cfelse>
                    <td>#DollarFormat(0)#</td>
            </cfif>

            </tr>



    </cfoutput>
</cfloop>


</table>



</body>
</html>