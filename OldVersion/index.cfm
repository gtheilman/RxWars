<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>

<style>
    .tableheader {
        font-weight: bold;
    }

    .hidden {
        visibility: hidden;
    }

    .marketprice {
        cursor: pointer;
    }

    p {
        font-family: sans-serif;
    }

    #cash {
        color: green;
    }

    #debt {
        color: red;
    }

    .tableheader {
        font-family: sans-serif;
        font-weight: bold;
    }

    #transactiontable td {
        font-family: sans-serif;
        padding-left: 20px;
        padding-right: 20px;
    }

    #transactiontable {
        border-collapse: collapse;

    }

    #loansharktable td {
        font-family: sans-serif;
    }

    .relativerisk {
        color: silver;
    }
</style>


<cffunction access="public" name="decryptText" returntype="string">
    <cfargument name="encryptedtext" type="string" required="yes">
    <CFQUERY NAME="Key" datasource="faculty">
            SELECT      Variable_Value
            FROM         Variables 
            WHERE       Variable_Name = 'Encryption_Key'
        </CFQUERY>

    <cfset decryptedText = decrypt(#arguments.encryptedtext#, #Key.Variable_Value#, "DES", "Hex")>

    <cfreturn decryptedText>

</cffunction>

<cfset variables.teamid = decryptText(url.teamid)>


<!--- Get data needed to initially set up screen --->
<CFQUERY NAME="TeamInfo" datasource="#application.datasource#">
 Select *
  From
    RxWars_Teams
  Where
    RxWars_Teams.id = #variables.teamid#
</CFQUERY>

<CFQUERY NAME="Drugs" datasource="#application.datasource#">
 Select *
  From
    RxWars_Drugs
  Where
    RxWars_Drugs.Active = 1 
  Order by RxWars_Drugs.drugname
</CFQUERY>


<p id="TeamName">
<cfoutput query="TeamInfo">#TeamName# (Team #TeamNumber#)</cfoutput>
</p>


<p>
    <button id="DrugPriceTrends">Drug Price Trends</button>
    <button id="GroupProfitTrends">Team Profit Trends</button>
    <button id="Ledger">Ledger</button>
</p>





<p>
    Available Cash: <span id="cash"></span>
</p>



<p>
    Current Debt: <span id="debt" class="debt"></span>
</p>




<table id="transactiontable">

<tr class="hidden">
    <td class="tableheader">id</td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td id="drugid_#i#"></td>
    </cfoutput>
</cfloop>
</tr>


<tr>
    <td class="tableheader">Name</td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td id="drugname_#i#"></td>
    </cfoutput>
</cfloop>
</tr>



<tr>
    <td class="tableheader">Schedule</td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td id="schedule_#i#" ></td>
    </cfoutput>
</cfloop>
</tr>

<tr>
    <td class="tableheader"></td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td><p>&nbsp;</P></td>
    </cfoutput>
</cfloop>
</tr>


<tr>
    <td class="tableheader">Inventory</td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td id="quantity_#i#"  ></td>
    </cfoutput>
</cfloop>
</tr>

<tr>
    <td class="tableheader"></td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td><p>&nbsp;</P></td>
    </cfoutput>
</cfloop>
</tr>



<tr>
    <td class="tableheader"></td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td></td>
    </cfoutput>
</cfloop>
</tr>

<tr>
    <td class="tableheader">Pharmacy Price</td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td id="AWP_#i#"></td>
    </cfoutput>
</cfloop>
</tr>

<tr>
    <td class="tableheader relativerisk">Relative Risk of Arrest</td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td id="BuyRisk_#i#" class="relativerisk"></td>
    </cfoutput>
</cfloop>
</tr>


<tr>
    <td class="tableheader">Calculated Risk of Arrest</td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td id="BuyRiskCalculated_#i#"></td>
    </cfoutput>
</cfloop>
</tr>



<tr>
    <td class="tableheader">Buy</td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td id="Buy_#i#"><input type="text" size="5" id="buybox_#i#"></input>
                <button id="buybutton_#i#">Buy</button></td>
    </cfoutput>
</cfloop>
</tr>


<tr>
    <td class="tableheader"></td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td><p>&nbsp;</P></td>
    </cfoutput>
</cfloop>
</tr>


<tr>
    <td class="tableheader ">Street Price</td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td class="marketprice" id="marketprice_#i#"></td>
    </cfoutput>
</cfloop>
</tr>


<tr>
    <td class="tableheader">Risk of Arrest</td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td id="SellRisk_#i#"></td>
    </cfoutput>

</cfloop>
</tr>


<tr>
    <td class="tableheader">Sell</td>
<cfloop from=0 to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
            <td id="Sell_#i#"><input type="text" size="5" id="sellbox_#i#"></input>
                <button id="sellbutton_#i#">Sell</button></td>
    </cfoutput>
</cfloop>
</tr>







</table>

<hr>

<table id="loansharktable">
    <tr>
        <td class="tableheader">Loan Shark</td>
        <td></td>
    </tr>

    <tr>
        <td>Borrow</td>
        <td>$<input type="text" size="6" id="borrowbox">
            <button id="borrowbutton">Borrow</button>
        </td>
    <tr>

    <tr>
        <td>Repay</td>
        <td>$<input type="text" size="6" id="repaybox">
            <button id="repaybutton">Repay</button>
            <button id="repayallbutton">Repay All</button>
        </td>
    <tr>


</table>





<script type="text/javascript">
    $(document).ready(function () {
        $(".numberinput").forceNumeric();
    });


    // forceNumeric() plug-in implementation
    jQuery.fn.forceNumeric = function () {

        return this.each(function () {
            $(this).keydown(function (e) {
                var key = e.which || e.keyCode;

                if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                            // numbers
                        key >= 48 && key <= 57 ||
                            // Numeric keypad
                        key >= 96 && key <= 105 ||
                            // comma, period and minus, . on keypad
                        key == 190 || key == 188 || key == 109 || key == 110 ||
                            // Backspace and Tab and Enter
                        key == 8 || key == 9 || key == 13 ||
                            // Home and End
                        key == 35 || key == 36 ||
                            // left and right arrows
                        key == 37 || key == 39 ||
                            // Del and Ins
                        key == 46 || key == 45)
                    return true;

                return false;
            });
        });
    }
</script>

<script>
<cfloop from="0" to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>

                $("##sellbox_#i#").forceNumeric();
            $("##buybox_#i#").forceNumeric();
    </cfoutput>
</cfloop>

$("#borrowbox").forceNumeric();
$("#repaybox").forceNumeric();


</script>

<script>

    function ReplaceNumberWithCommas(yourNumber) {
        //Seperates the components of the number
        var n = yourNumber.toString().split(".");
        //Comma-fies the first part
        n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (typeof n[1] != 'undefined') {
            n[1] = n[1].substring(0, 2);
        }
        //Combines the two sections
        return n.join(".");
    }
</script>

<cfoutput>

    <script>
    function statuscheck() {
            jQuery.getJSON('RxWars.cfc?method=statuscheck&teamid=#variables.teamid#',
        function(DATA) {

            <cfloop from="0" to="#Evaluate(drugs.recordcount - 1)#" index="i">
                <cfoutput>


                var cash =  Number(DATA[#i#][11]);
                    cash = ReplaceNumberWithCommas(cash);
                        $('##cash').html('$' + cash);

                var debt =  Number(DATA[#i#][12]);
                    debt = ReplaceNumberWithCommas(debt);
                        $('##debt').html('$' + debt);
                if (debt != 0) {
                        $('##debt').fadeOut('slow');
                        $('##debt').fadeIn('slow');
                }


                var drugid = Number(DATA[#i#][0]);
                        $('##drugid_#i#').html(drugid);

                var drugname = DATA[#i#][1];
                        $('##drugname_#i#').html(drugname);

                var schedule = DATA[#i#][13];
                        $('##schedule_#i#').html(schedule);

                var AWP =  DATA[#i#][2];
                        $('##AWP_#i#').html('$' + AWP.toFixed(2));

                var marketprice =  DATA[#i#][7];
                    marketprice = '$' + marketprice.toFixed(2);
                        $('##marketprice_#i#').html(marketprice);

                var quantity =  DATA[#i#][6];
                        $('##quantity_#i#').html(quantity);

                var buyrisk =  DATA[#i#][5];
                        $('##BuyRisk_#i#').html(buyrisk * 100 + '%');

                var sellrisk =  DATA[#i#][10];
                        $('##SellRisk_#i#').html(sellrisk * 100 + '%');

                var startstop =  DATA[#i#][14];
                if (startstop == 0) {
                        $("##sellbutton_#i#").prop('disabled', true);
                        $("##buybutton_#i#").prop('disabled', true);

                }



                </cfoutput>
            </cfloop>



        });

};


</script>


</cfoutput>


<script>
function clearboxes() {

<cfloop from="0" to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>


                $("##sellbox_#i#").val('');
            $("##buybox_#i#").val('');

    </cfoutput>
</cfloop>



};




</script>




<script>
$.event.special.inputchange = {
    setup: function () {
        var self = this, val;
        $.data(this, 'timer', window.setInterval(function () {
            val = self.value;
            if ($.data(self, 'cache') != val) {
                $.data(self, 'cache', val);
                $(self).trigger('inputchange');
            }
        }, 20));
    },
    teardown: function () {
        window.clearInterval($.data(this, 'timer'));
    },
    add: function () {
        $.data(this, 'cache', this.value);
    }
};

<cfloop from="0" to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>

        $('##buybox_#i#').on('inputchange', function() {


    var buyrisk =   $("##BuyRisk_#i#").text().substring(0, $("##BuyRisk_#i#").text().length - 1);

    var buyunits = $("##buybox_#i#").val();

        var BuyRiskCalculated = Math.round(buyunits / 100 * buyrisk);

        if (BuyRiskCalculated > 99) {
            BuyRiskCalculated = 99;
        };



            $('##BuyRiskCalculated_#i#').html(BuyRiskCalculated + '%');
    });

    </cfoutput>
</cfloop>
</script>


<!--- Initial load of table values --->
<script>
    $(function () {
        $('#transactiontable td:nth-child(even)').css("background-color", "beige");
        $('#transactiontable td:nth-child(odd)').css("background-color", "lightcyan");
        $('#transactiontable td:nth-child(1)').css("background-color", "white");
        statuscheck();
        setInterval(statuscheck, 20000);

    });

</script>


<!--- Disables submit buttons for a period of time following transaction (default = 6 seconds) --->
<script>
function refractory() {
<cfoutput>
    <cfif IsDefined("application.refractoryperiod")>
    var refractoryperiod = #application.refractoryperiod#;
    <cfelse>
            var refractoryperiod = 5;
    </cfif>
</cfoutput>


<cfloop from="0" to="#Evaluate(drugs.recordcount - 1)#" index="i">
    <cfoutput>
                $("##sellbutton_#i#").prop('disabled', true);
            setTimeout(function(){
            $("##sellbutton_#i#").prop('disabled', false);
    }, refractoryperiod * 1000);



            $("##buybutton_#i#").prop('disabled', true);
            setTimeout(function(){
            $("##buybutton_#i#").prop('disabled', false);
    }, refractoryperiod * 1000);


    </cfoutput>
</cfloop>
};


</script>


<!--- Buy --->
<cfloop from="0" to="#Evaluate(drugs.recordcount - 1)#" index="i">

    <cfoutput>
        <script>

                $("##buybutton_#i#").click(function() {

        var randomnumber = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

    if ( Number($("##BuyRiskCalculated_#i#").text().substring(0, $("##BuyRiskCalculated_#i#").text().length - 1))  >  randomnumber) {
    var streetprice = Number($("##marketprice_#i#").text().substring(1));
    var fine = Number($("##buybox_#i#").val()) * streetprice * 4  ;
        fine = Math.round(fine);
        if (fine < 1000) {
            fine = 1000
        };

            $.getJSON('RxWars.cfc?method=busted&teamid=#variables.teamid#&drugid='+$("##drugid_#i#").text()+'&quantity='+$("##buybox_#i#").val()+'&fine='+ fine +'&buyrisk='+ $("##BuyRiskCalculated_#i#").text().substring(0, $("##BuyRiskCalculated_#i#").text().length - 1),

    function(DATA) {
        statuscheck();

            $("##buybox_#i#").val('');

        var randomalert = Math.floor(Math.random() * 5) + 1;

    if (randomalert == 1) {
            alert('Someone snitched!  The police were waiting for your buyer when they left the pharmacy with the ' +   $("##drugname_#i#").text()   + '.  Your legal costs were $' +  ReplaceNumberWithCommas(fine) );
    } else if (randomalert == 2) {
            alert('The pharmacist was suspicious of a prescription for so many ' +   $("##drugname_#i#").text()   + '.  After you got lawyered-up, your legal costs were $' +  ReplaceNumberWithCommas(fine) );
    } else if (randomalert == 3) {
            alert('The Board of Pharmacy had sent out an alert about the stolen prescription pad you were using to get ' +   $("##drugname_#i#").text()   + '.  The pharmacist noticed it and called the police.  Your legal costs were $' +  ReplaceNumberWithCommas(fine) );
    } else if (randomalert == 4) {
            alert('Your buyer acted very nervous and the pharmacist became suspicious.   When the buyer could not explain what the ' +   $("##drugname_#i#").text()   + ' was for, the police were alerted.  Your legal costs were $' +  ReplaceNumberWithCommas(fine) );
    } else if (randomalert == 5) {
            alert('The pharmacist recognized your buyer as someone who had come in earlier in the month with a different prescription for ' +   $("##drugname_#i#").text()   + '.  The police were called and an arrest was made.  Your legal costs were $' +  ReplaceNumberWithCommas(fine) );
    } else   {
            alert('Your minion was arrested while trying to pass a fake prescription for ' +   $("##drugname_#i#").text()   + ' at the pharmacy.  Your legal costs were $' +  ReplaceNumberWithCommas(fine) );
    }



    });

    } else {

    var currentcash = Number($("##cash").text().substring(1) );

    if (currentcash == 0) {
        alert('You do not have any cash.  Try visiting the loan shark.');
    } else {


        refractory();

            $.getJSON('RxWars.cfc?method=buy&teamid=#variables.teamid#&drugid='+$("##drugid_#i#").text()+'&quantity='+$("##buybox_#i#").val()+'&AWP='+$("##AWP_#i#").text().substring(1)+'&buyrisk='+ $("##BuyRiskCalculated_#i#").text().substring(0, $("##BuyRiskCalculated_#i#").text().length - 1),
            function (DATA) {
                statuscheck();
                clearboxes();

            });
    }

    }
    });

    </script>
    </cfoutput>
</cfloop>


<!--- Sell --->
<cfloop from="0" to="#Evaluate(drugs.recordcount - 1)#" index="i">

    <cfoutput>
        <script>

                $("##sellbutton_#i#").click(function() {

        var randomnumber = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

    if ( Number($("##SellRisk_#i#").text().substring(0, $("##SellRisk_#i#").text().length - 1))  >  randomnumber) {
    var streetprice = Number($("##marketprice_#i#").text().substring(1));
    var fine = Number($("##sellbox_#i#").val()) * streetprice * 4  ;
        fine = Math.round(fine);
        if (fine < 1000) {
            fine = 1000
        };

    if (Number($("##sellbox_#i#").val())  > Number($("##quantity_#i#").text())  ) {

    var numberlost = Number($("##quantity_#i#").text()) ;

    } else {

    var numberlost = Number($("##sellbox_#i#").val());
    }

            $.getJSON('RxWars.cfc?method=busted&teamid=#variables.teamid#&sell=1&drugid='+$("##drugid_#i#").text()+'&quantity='+ numberlost +'&fine='+ fine +'&sellrisk='+ $("##SellRisk_#i#").text().substring(0, $("##SellRisk_#i#").text().length - 1),

    function(DATA) {
        statuscheck();

            $("##sellbox_#i#").val('');


        var randomalert = Math.floor(Math.random() * 5) + 1;

    if (randomalert == 1) {
            alert('A rival pill mill tipped the police off and they caught you trying to sell the ' + $("##drugname_#i#").text() + '.  Your legal costs were $' +  ReplaceNumberWithCommas(fine));
    } else if (randomalert == 2) {
            alert('An customer ratted you out to the police in return for immunity from prosecution.  They took away your ' + $("##drugname_#i#").text() + ' and fined you $' +  ReplaceNumberWithCommas(fine));
    } else if (randomalert == 3) {
            alert('Your courier was mugged!   They stole the ' + $("##drugname_#i#").text() + ' as well as $' +  ReplaceNumberWithCommas(fine) + ' that he was carrying.');
    } else if (randomalert == 4) {
            alert('Your minion took a handfull of the ' + $("##drugname_#i#").text() + ' you told him to sell.   While tripping, he tried to sell the rest to a uniformed police officer.  It cost $' +  ReplaceNumberWithCommas(fine) + ' to get him out of jail.');
    } else if (randomalert == 5) {
            alert('Your not-very-bright minion tried to sell the ' + $("##drugname_#i#").text() + ' back to the pharmacist who dispensed it.  The police were called and bail was set at $' +  ReplaceNumberWithCommas(fine));
    } else   {
            alert('Your minion was caught while trying to sell ' + $("##drugname_#i#").text() + ' to an undercover police officer.  Your legal costs were $' +  ReplaceNumberWithCommas(fine));
    }





    });

    } else {

        refractory();

            $.getJSON('RxWars.cfc?method=sell&teamid=#variables.teamid#&drugid='+$("##drugid_#i#").text()+'&quantity='+$("##sellbox_#i#").val()+'&marketprice='+$("##marketprice_#i#").text().substring(1)+'&sellrisk='+ $("##SellRisk_#i#").text().substring(0, $("##SellRisk_#i#").text().length - 1),
            function (DATA) {
                statuscheck();
                clearboxes();


            });

    }
    });

    </script>
    </cfoutput>
</cfloop>


<!--- Borrow from loan shark --->
<cfoutput>
    <script>

            $("##borrowbutton").click(function() {


        $.getJSON('RxWars.cfc?method=borrow&teamid=#variables.teamid#&borrow='+$("##borrowbox").val(),

function(DATA) {
    statuscheck();


    var randomalert = Math.floor(Math.random() * 4) + 1;

if (randomalert == 1) {
        alert('Big John loaned you $' + $("##borrowbox").val() + '  The interest rate is astronomical.   You need to make a big sale in a hurry so you can pay him back.');
} else if (randomalert == 2) {
        alert('Against your better judgement, you borrow $' + $("##borrowbox").val() + ' from the loan shark.  If you do not pay him back soon, he is going to break your legs.  Keep an eye on your debt and pay it back as soon you can.');
} else if (randomalert == 3) {
        alert('You promised Larry the Lizard you would have his $' + $("##borrowbox").val() + ' repaid as soon as you make your first sale.   He looked skeptical and told you to take your time.  He probably wants you to run up as much in interest charges as possible.');
} else   {
        alert('You have borrowed $' + $("##borrowbox").val() + ' from the loan shark.  The interest rate is very high.   Keep an eye on your debt and pay it back as soon as possible.');
};




        $("##borrowbox").val('');
});

});


</script>
</cfoutput>


<!--- Repay all to loan shark --->
<cfoutput>
    <script>

            $("##repayallbutton").click(function() {


        $.getJSON('RxWars.cfc?method=repayall&teamid=#variables.teamid#' ,

function(DATA) {
    statuscheck();

        $("##repaybox").val('');
});

});


</script>
</cfoutput>


<!--- Repay partial to loan shark --->
<cfoutput>
    <script>

            $("##repaybutton").click(function() {


        $.getJSON('RxWars.cfc?method=repay&teamid=#variables.teamid#&repay='+$("##repaybox").val(),

function(DATA) {
    statuscheck();

        $("##repaybox").val('');
});

});


</script>
</cfoutput>

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

            $("##Ledger").click(function() {

        window.open('Ledger.cfm?teamid=#variables.teamid#','Ledger','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1100,height=500');



});

</script>
</cfoutput>

<cfloop from="0" to="#Evaluate(drugs.recordcount - 1)#" index="i">

    <cfoutput query="Drugs" startrow="#Evaluate(i + 1)#" maxrows="1">


        <script>

                $('##marketprice_#i#').click(function() {

            window.open('DrugPriceTrends.cfm?id=#id#','DrugPriceTrends#i#','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=920,height=500');



    });

    </script>
    </cfoutput>

</cfloop>






