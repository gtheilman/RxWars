<cfcomponent>


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


    <cffunction access="public" name="TotalCashDebt" returntype="any">
<!--- Find out how much cash all teams have together--->

        <CFQUERY NAME="Teams" datasource="#application.datasource#">
                Select  *
                From
                  RxWars_Teams
                Where
                  RxWars_Teams.active = 1 
            </cfquery>

        <cfset variables.TotalCash = 0>
        <cfset variables.TotalDebt = 0>

        <cfloop query="Teams">
            <cfoutput>
                <CFQUERY NAME="TotalCurrentCash" datasource="#application.datasource#">
                      Select Top (1) *
                        From
                          RxWars_Transactions
                        Where
                          RxWars_Transactions.teamid = #id#   
                        Order by RxWars_Transactions.id DESC
                      </CFQUERY>

                <cfif TotalCurrentCash.recordcount GT 0>
                    <cfset variables.TotalCash = variables.TotalCash + TotalCurrentCash.Cash>
                    <cfset variables.TotalDebt = variables.TotalDebt + TotalCurrentCash.Debt>
                </cfif>
            </cfoutput>
        </cfloop>

        <cfquery name="updatemarketplaceTotalCash" datasource="#application.datasource#">
              INSERT INTO RxWars_Market (currenttime,TotalCash,TotalDebt)
              VALUES (GETDATE(),'#variables.TotalCash#','#variables.TotalDebt#');
            </cfquery>

        <cfset updateTime = Now()>

        <cfreturn updateTime>

    </cffunction>

    <cffunction access="public" name="InterestCharge" returntype="any">
<!--- calculate and apply interest --->
        <cfargument name="teamid" type="numeric" required="yes">
        <cfargument name="cash" type="numeric" required="yes">
        <cfargument name="debt" type="numeric" required="yes">

        <cfset variables.interest = Round(arguments.debt * 0.1 * 100) / 100>
        <cfset variables.debt = variables.debt + variables.interest>

        <cfquery name="updateinterest" datasource="#application.datasource#">
          INSERT INTO RxWars_Transactions (teamid,currenttime,cash,debt,interest)
          VALUES ('#arguments.teamid#',GETDATE(),'#variables.cash#','#variables.debt#','#Evaluate(- 1 * variables.interest)#');
        </cfquery>

        <cfset updateTime = Now()>

        <cfreturn updateTime>

    </cffunction>


    <cffunction access="public" name="findprice" returntype="numeric">
        <cfargument name="drugid" type="numeric" required="yes">

        <CFQUERY NAME="functionteams" datasource="#application.datasource#">
                SELECT      *
                FROM         RxWars_Teams
                WHERE       Active = 1
                Order by     id
            </CFQUERY>

        <cfset NumberOfTeams = functionteams.recordcount>

        <CFQUERY NAME="functiontransactions" datasource="#application.datasource#">
                SELECT      *
                FROM         RxWars_Transactions 
                WHERE       drugid = #arguments.drugid#
                Order by     id
            </CFQUERY>

<!--- FIgure out how many tablets in circulation --->
        <cfset variables.circulating = 0>
        <cfloop query="functiontransactions">
            <cfif isNumeric(quantity)>
                <cfset variables.circulating = variables.circulating + quantity>
            </cfif>
        </cfloop>

        <CFQUERY NAME="functiondrugs" datasource="#application.datasource#">
                SELECT      *
                FROM         RxWars_Drugs
                WHERE       id = #arguments.drugid#
        </CFQUERY>

        <cfset variables.circulating = variables.circulating / NumberOfTeams>


<!--- Set Max Price Multipler --->
        <cfset MaxPriceMultipler = 15>
<!--- Set saturation point for market (in relation to base demand) --->
        <cfset MaxDemandMultipler = 1>

<!--- Max price is 15 x AWP     Min price is 0.1 x AWP     Range from 1 tablet to market saturation (twice base demand) --->
        <cfset m = (MaxPriceMultipler -.1) / (1 - MaxDemandMultipler * functiondrugs.basedemand * functiondrugs.DemandMultiplier)>

<!--- This is the minimum price someone will sell a tablet for based on supply --->

        <cfset MinPriceMultiplier = m * variables.circulating * functiondrugs.SupplyMultiplier + 15>

<!--- This is the y-intercept of the supply curve --->
        <cfset MinPrice = MinPriceMultiplier * functiondrugs.AWP * functiondrugs.SupplyMultiplier>

<!--- This is the slope of the supply curve --->
        <cfset mSupply = ((MaxPriceMultipler * functiondrugs.AWP ) - (functiondrugs.AWP * 1.1 ) ) / (2 * functiondrugs.basedemand * functiondrugs.DemandMultiplier )>


<!--- Characterizing the demand curve --->
<!--- Slope of the demand curve --->
        <cfset mDemand = ( - 1 * MaxPriceMultipler * AWP ) / (MaxDemandMultipler * functiondrugs.basedemand * functiondrugs.DemandMultiplier)>
<!--- y-intercept of the demand curve --->
        <cfset interceptDemand = functiondrugs.AWP * MaxPriceMultipler * functiondrugs.DemandMultiplier>

        <cfset q = (MinPrice - interceptDemand ) / (mDemand - mSupply)>

        <cfset marketprice = mDemand * q + interceptDemand>

        <cfif marketprice LT 1.1 * functiondrugs.AWP>
            <cfset marketprice = 1.1 * functiondrugs.AWP>
            <cfelseif marketprice GT MaxPriceMultipler * functiondrugs.AWP>
            <cfset marketprice = MaxPriceMultipler * functiondrugs.AWP>
        </cfif>

        <cfset marketprice = Round(marketprice * 100) / 100>

        <cfreturn marketprice>

    </cffunction>


    <cffunction access="remote" name="statuscheck">
        <cfargument name="teamid" type="numeric" required="yes">

        <cfset myarray = arraynew(2)>
        <cfset variables.counter = 1>


<!--- Find out how much cash and debt they have currently --->
        <CFQUERY NAME="CurrentCash" datasource="#application.datasource#">
            Select Top (1) *
              From
                RxWars_Transactions
              Where
                RxWars_Transactions.teamid = #arguments.teamid#   
              Order by RxWars_Transactions.id DESC
            </CFQUERY>

        <cfif CurrentCash.recordcount IS 0>

            <cfquery name="NewTeam" datasource="#application.datasource#">
                INSERT INTO RxWars_Transactions (teamid,currenttime,drugid,quantity,marketprice,cash,debt)
                VALUES ('#arguments.teamid#',GETDATE(),'','','0','0','0');
              </cfquery>

            <CFQUERY NAME="CurrentCash" datasource="#application.datasource#">
               Select Top (1) *
                From
                  RxWars_Transactions
                Where
                  RxWars_Transactions.teamid = #arguments.teamid#   
                Order by RxWars_Transactions.id DESC
              </CFQUERY>


        </cfif>

        <cfoutput query="CurrentCash">
            <cfset variables.cash = #cash#>
            <cfset variables.debt = #debt#>
        </cfoutput>


<!--- If debt, add interest --->
        <cfif variables.debt gt 0>
            <cfif Not IsDefined("session.InterestUpdateTime")>
                <cfset session.InterestUpdateTime = InterestCharge('#arguments.teamid#', '#variables.cash#', '#variables.debt#')>
                <cfelseif dateDiff("s", session.InterestUpdateTime, Now()) GTE 19>
                <cfset session.InterestUpdateTime = InterestCharge('#arguments.teamid#', '#variables.cash#', '#variables.debt#')>
            </cfif>
        </cfif>


<!--- Find out what items are available --->
        <CFQUERY NAME="Drugs" datasource="#application.datasource#">
            Select *
              From
                RxWars_Drugs
              Where
                RxWars_Drugs.Active = 1 
              Order by RxWars_Drugs.drugname 
            </CFQUERY>

        <cfloop query="Drugs">


<!--- Find out how many they currently have of each item --->
            <CFQUERY NAME="TransactionHistory" datasource="#application.datasource#">
                  Select *
                    From
                      RxWars_Transactions
                    Where
                      RxWars_Transactions.teamid = #arguments.teamid#  And
                      RxWars_Transactions.drugid = #Drugs.id#
                    Order by RxWars_Transactions.id 
                  </CFQUERY>

            <cfset variables.quantity = 0>
            <cfloop query="TransactionHistory">
                <cfset variables.quantity = variables.quantity + #quantity#>
            </cfloop>

<!--- Check market status --->
            <CFQUERY NAME="Market" datasource="#application.datasource#">
                    Select Top (1) *
                      From
                        RxWars_Market
                      Where
                        RxWars_Market.drugid =  #Drugs.id# 
                      Order by RxWars_Market.id DESC
                   </CFQUERY>


<!--- In case there is no market information --->

            <cfif Market.recordcount IS 0>
                <cfset variables.marketprice = AWP * 5>
                <cfset variables.overallsupply = 0>

                <cfquery name="updatemarketplace" datasource="#application.datasource#">
                        INSERT INTO RxWars_Market (currenttime,drugid,AWP,marketprice,demand,supply,buyrisk,sellrisk)
                        VALUES (GETDATE(),'#Drugs.id#','#Drugs.AWP#','#variables.marketprice#','#Market.demand#','#variables.overallsupply#','1','0.1');
                      </cfquery>

<!--- Re-Check market status --->
                <CFQUERY NAME="Market" datasource="#application.datasource#">
                        Select Top (1) *
                          From
                            RxWars_Market
                          Where
                            RxWars_Market.drugid =  #Drugs.id# 
                          Order by RxWars_Market.id DESC
                       </CFQUERY>

            </cfif>

            <cfset variables.calculatedmarketprice = findprice(drugid = #Drugs.id#)>

            <cfif Not IsDefined("Application.startstop")>
                <cfset application.startstop = 1>
            </cfif>

            <cfset myarray[variables.counter][1] = Drugs.id>
            <cfset myarray[variables.counter][2] = Drugs.DrugName>
            <cfset myarray[variables.counter][3] = Drugs.AWP>
            <cfset myarray[variables.counter][4] = Drugs.DemandMultiplier>
            <cfset myarray[variables.counter][5] = Drugs.SupplyMultiplier>
            <cfset myarray[variables.counter][6] = Drugs.buyrisk>
            <cfset myarray[variables.counter][7] = variables.quantity>
            <cfset myarray[variables.counter][8] = variables.calculatedmarketprice>
            <cfset myarray[variables.counter][9] = Market.demand>
            <cfset myarray[variables.counter][10] = Market.Supply>
            <cfset myarray[variables.counter][11] = Drugs.sellrisk>
            <cfset myarray[variables.counter][12] = variables.cash>
            <cfset myarray[variables.counter][13] = variables.debt>
            <cfset myarray[variables.counter][14] = Drugs.schedule>
            <cfset myarray[variables.counter][15] = Application.startstop>
            <cfset variables.counter = variables.counter + 1>

        </cfloop>


<!--- Find out how much cash all teams have together--->

        <cfif Not IsDefined("application.TotalCashDebtUpdateTime")>
            <cfset application.TotalCashDebtUpdateTime = TotalCashDebt()>
            <cfelseif dateDiff("s", application.TotalCashDebtUpdateTime, Now()) GT 15>
            <cfset application.TotalCashDebtUpdateTime = TotalCashDebt()>
        </cfif>

        <cfset RevisionJSON = SerializeJSON(myarray)>

        <cfscript>
            writeOutput(RevisionJSON);
        </cfscript>

    </cffunction>


    <cffunction access="remote" name="buy">
        <cfargument name="teamid" type="numeric" required="yes">
        <cfargument name="drugid" type="numeric" required="yes">
        <cfargument name="quantity" type="numeric" required="yes">
        <cfargument name="AWP" type="numeric" required="yes">
        <cfargument name="buyrisk" type="numeric" required="yes">

        <cfif arguments.quantity GT 300>
            <cfset arguments.quantity = 300>
        </cfif>


<!--- Find out how much cash and debt they have currently --->
        <CFQUERY NAME="CurrentCash" datasource="#application.datasource#">
            Select Top (1) *
              From
                RxWars_Transactions
              Where
                RxWars_Transactions.teamid = #arguments.teamid#   
              Order by RxWars_Transactions.id DESC
            </CFQUERY>

        <cfoutput query="CurrentCash">
            <cfset variables.cash = #cash#>
            <cfset variables.debt = #debt#>
        </cfoutput>


<!--- Find out how many they currently have --->
        <CFQUERY NAME="TransactionHistory" datasource="#application.datasource#">
              Select *
                From
                  RxWars_Transactions
                Where
                  RxWars_Transactions.teamid = #arguments.teamid#  And
                  RxWars_Transactions.drugid = #drugid#
                Order by RxWars_Transactions.id 
              </CFQUERY>

        <cfset variables.quantityowned = 0>
        <cfloop query="TransactionHistory">
            <cfset variables.quantityowned = variables.quantityowned + #TransactionHistory.quantity#>
        </cfloop>


<!--- Try to buy --->
        <cfif variables.cash / arguments.AWP GTE arguments.quantity>
            <cfset variables.quantitybought = arguments.quantity>

        <cfelse> <!--- Not enough money -- buy max available --->
            <cfset variables.quantitybought = int(variables.cash / arguments.AWP)>

        </cfif>

        <cfset variables.cash = variables.cash - (variables.quantitybought * arguments.AWP)>

        <cfquery name="recordtransaction" datasource="#application.datasource#">
                INSERT INTO RxWars_Transactions (teamid,currenttime,drugid,quantity,AWP,cash,debt)
                VALUES ('#arguments.teamid#',GETDATE(),'#arguments.drugid#','#variables.quantitybought#','#arguments.AWP#','#variables.cash#','#variables.debt#');
              </cfquery>

<!--- Update overall environmental supply --->

        <CFQUERY NAME="Market" datasource="#application.datasource#">
                Select Top (1) *
                  From
                    RxWars_Market
                  Where
                    RxWars_Market.drugid =  #arguments.drugid# 
                  Order by RxWars_Market.id DESC
               </CFQUERY>

        <cfset variables.overallsupply = Market.Supply + variables.quantitybought>

<!--- Put in something below to calculate new marketprice --->
        <cfset variables.marketprice = Market.marketprice>

        <cfquery name="updatemarketplace" datasource="#application.datasource#">
                INSERT INTO RxWars_Market (currenttime,drugid,AWP,marketprice,demand,supply,buyrisk)
                VALUES (GETDATE(),'#arguments.drugid#','#arguments.AWP#','#variables.marketprice#','#Market.demand#','#variables.overallsupply#','#market.buyrisk#');
              </cfquery>

        <cfset variables.success = 1>

        <cfset RevisionJSON = SerializeJSON(variables.success)>

        <cfscript>
            writeOutput(RevisionJSON);
        </cfscript>

    </cffunction>


    <cffunction access="remote" name="sell">
        <cfargument name="teamid" type="numeric" required="yes">
        <cfargument name="drugid" type="numeric" required="yes">
        <cfargument name="quantity" type="numeric" required="yes">
        <cfargument name="marketprice" type="numeric" required="yes">
        <cfargument name="sellrisk" type="numeric" required="yes">


<!--- roll dice to see if they get arrested --->

<!--- Find out how much cash and debt they have currently --->
        <CFQUERY NAME="CurrentCash" datasource="#application.datasource#">
            Select Top (1) *
              From
                RxWars_Transactions
              Where
                RxWars_Transactions.teamid = #arguments.teamid#   
              Order by RxWars_Transactions.id DESC
            </CFQUERY>

        <cfoutput query="CurrentCash">
            <cfset variables.cash = #cash#>
            <cfset variables.debt = #debt#>
        </cfoutput>


<!--- Find out how many they currently have --->
        <CFQUERY NAME="TransactionHistory" datasource="#application.datasource#">
              Select *
                From
                  RxWars_Transactions
                Where
                  RxWars_Transactions.teamid = #arguments.teamid#  And
                  RxWars_Transactions.drugid = #drugid#
                Order by RxWars_Transactions.id 
              </CFQUERY>

        <cfset variables.quantityowned = 0>
        <cfloop query="TransactionHistory">
            <cfset variables.quantityowned = variables.quantityowned + #TransactionHistory.quantity#>
        </cfloop>


<!--- Try to sell --->
        <cfif arguments.quantity LTE variables.quantityowned>
            <cfset variables.cash = variables.cash + ( arguments.quantity * arguments.marketprice)>
            <cfset variables.quantitysold = arguments.quantity * - 1>
        <cfelse>
            <cfset variables.cash = variables.cash + ( variables.quantityowned * arguments.marketprice)>
            <cfset variables.quantitysold = variables.quantityowned * - 1>
        </cfif>

        <cfquery name="recordtransaction" datasource="#application.datasource#">
                INSERT INTO RxWars_Transactions (teamid,currenttime,drugid,quantity,marketprice,cash,debt)
                VALUES ('#arguments.teamid#',GETDATE(),'#arguments.drugid#','#variables.quantitysold#','#arguments.marketprice#','#variables.cash#','#variables.debt#');
              </cfquery>

<!--- Update overall environmental supply --->

        <CFQUERY NAME="Market" datasource="#application.datasource#">
                Select Top (1) *
                  From
                    RxWars_Market
                  Where
                    RxWars_Market.drugid =  #arguments.drugid# 
                  Order by RxWars_Market.id DESC
               </CFQUERY>

        <cfset variables.overallsupply = Market.Supply + variables.quantitysold>

<!--- Put in something below to calculate new marketprice --->
        <cfset variables.marketprice = Market.marketprice>

        <cfquery name="updatemarketplace" datasource="#application.datasource#">
                INSERT INTO RxWars_Market (currenttime,drugid,AWP,marketprice,demand,supply,buyrisk)
                VALUES (GETDATE(),'#arguments.drugid#','#market.AWP#','#arguments.marketprice#','#Market.demand#','#variables.overallsupply#','#market.buyrisk#');
              </cfquery>

        <cfset variables.success = 1>

        <cfset RevisionJSON = SerializeJSON(variables.success)>

        <cfscript>
            writeOutput(RevisionJSON);
        </cfscript>

    </cffunction>


    <cffunction access="remote" name="busted">
        <cfargument name="teamid" type="numeric" required="yes">
        <cfargument name="drugid" type="numeric" required="yes">
        <cfargument name="quantity" type="numeric" required="yes">
        <cfargument name="fine" type="numeric" required="yes">
        <cfargument name="sell" type="numeric" required="no">


<!--- Find out how much cash and debt they have currently --->
        <CFQUERY NAME="CurrentCash" datasource="#application.datasource#">
            Select Top (1) *
              From
                RxWars_Transactions
              Where
                RxWars_Transactions.teamid = #arguments.teamid#   
              Order by RxWars_Transactions.id DESC
            </CFQUERY>

        <cfoutput query="CurrentCash">
            <cfset variables.cash = #cash#>
            <cfset variables.debt = #debt#>
        </cfoutput>

        <cfif variables.cash LT arguments.fine>
            <cfset variables.debt = variables.debt + (arguments.fine - variables.cash)>
            <cfset variables.cash = 0>
        <cfelse>
            <cfset variables.cash = variables.cash - arguments.fine>
        </cfif>

        <cfif IsDefined("arguments.sell")>
            <cfset variables.quantitylost = - 1 * arguments.quantity>
        <cfelse>
            <cfset variables.quantitylost = 0>
        </cfif>

        <cfquery name="recordtransaction" datasource="#application.datasource#">
                INSERT INTO RxWars_Transactions (teamid,currenttime,drugid,quantity,marketprice,cash,debt,busted,interest)
                VALUES ('#arguments.teamid#',GETDATE(),'#arguments.drugid#','#variables.quantitylost #','0','#variables.cash#','#variables.debt#','#arguments.fine#','0');
              </cfquery>

        <cfset variables.success = 1>

        <cfset RevisionJSON = SerializeJSON(variables.success)>

        <cfscript>
            writeOutput(RevisionJSON);
        </cfscript>

    </cffunction>


    <cffunction access="remote" name="borrow">
        <cfargument name="teamid" type="numeric" required="yes">
        <cfargument name="borrow" type="numeric" required="yes">


<!--- Find out how much cash and debt they have currently --->
        <CFQUERY NAME="CurrentCash" datasource="#application.datasource#">
            Select Top (1) *
              From
                RxWars_Transactions
              Where
                RxWars_Transactions.teamid = #arguments.teamid#   
              Order by RxWars_Transactions.id DESC
            </CFQUERY>

        <cfoutput query="CurrentCash">
            <cfset variables.cash = #cash#>
            <cfset variables.debt = #debt#>
        </cfoutput>

        <cfset variables.cash = variables.cash + arguments.borrow>
        <cfset variables.debt = variables.debt + arguments.borrow>

        <cfquery name="recordtransaction" datasource="#application.datasource#">
                INSERT INTO RxWars_Transactions (teamid,currenttime,drugid,quantity,marketprice,cash,debt,loanshark,interest)
                VALUES ('#arguments.teamid#',GETDATE(),'0','0','0','#variables.cash#','#variables.debt#','#Evaluate(- 1 * arguments.borrow)#','0');
              </cfquery>

        <cfset variables.success = 1>

        <cfset RevisionJSON = SerializeJSON(variables.success)>

        <cfscript>
            writeOutput(RevisionJSON);
        </cfscript>

    </cffunction>


    <cffunction access="remote" name="repay">
        <cfargument name="teamid" type="numeric" required="yes">
        <cfargument name="repay" type="numeric" required="yes">


<!--- Find out how much cash and debt they have currently --->
        <CFQUERY NAME="CurrentCash" datasource="#application.datasource#">
            Select Top (1) *
              From
                RxWars_Transactions
              Where
                RxWars_Transactions.teamid = #arguments.teamid#   
              Order by RxWars_Transactions.id DESC
            </CFQUERY>

        <cfoutput query="CurrentCash">
            <cfset variables.cash = #cash#>
            <cfset variables.debt = #debt#>
        </cfoutput>

        <cfif variables.cash GTE arguments.repay AND
        arguments.repay LTE variables.debt>
            <cfset variables.amountrepaid = arguments.repay>
            <cfset variables.cash = variables.cash - arguments.repay>
            <cfset variables.debt = variables.debt - arguments.repay>
            <cfelseif arguments.repay GT variables.debt>
            <cfset variables.amountrepaid = variables.debt>
            <cfset variables.cash = variables.cash - variables.debt>
            <cfset variables.debt = 0>
        <cfelse>
            <cfset variables.amountrepaid = variables.cash>
            <cfset variables.debt = variables.debt - variables.cash>
            <cfset variables.cash = 0>
        </cfif>

        <cfquery name="recordtransaction" datasource="#application.datasource#">
                INSERT INTO RxWars_Transactions (teamid,currenttime,drugid,quantity,marketprice,cash,debt,loanshark)
                VALUES ('#arguments.teamid#',GETDATE(),'0','0','0','#variables.cash#','#variables.debt#','#variables.amountrepaid#');
              </cfquery>

        <cfset variables.success = 1>

        <cfset RevisionJSON = SerializeJSON(variables.success)>

        <cfscript>
            writeOutput(RevisionJSON);
        </cfscript>

    </cffunction>


    <cffunction access="remote" name="repayall">
        <cfargument name="teamid" type="numeric" required="yes">


<!--- Find out how much cash and debt they have currently --->
        <CFQUERY NAME="CurrentCash" datasource="#application.datasource#">
            Select Top (1) *
              From
                RxWars_Transactions
              Where
                RxWars_Transactions.teamid = #arguments.teamid#   
              Order by RxWars_Transactions.id DESC
            </CFQUERY>

        <cfoutput query="CurrentCash">
            <cfset variables.cash = #cash#>
            <cfset variables.debt = #debt#>
        </cfoutput>

        <cfif variables.cash GTE variables.debt>
            <cfset variables.amountrepaid = variables.debt>
            <cfset variables.cash = variables.cash - variables.debt>
            <cfset variables.debt = variables.debt - variables.debt>

        <cfelse>
            <cfset variables.amountrepaid = variables.cash>
            <cfset variables.debt = variables.debt - variables.cash>
            <cfset variables.cash = 0>
        </cfif>

        <cfquery name="recordtransaction" datasource="#application.datasource#">
                INSERT INTO RxWars_Transactions (teamid,currenttime,drugid,quantity,marketprice,cash,debt,loanshark)
                VALUES ('#arguments.teamid#',GETDATE(),'0','0','0','#variables.cash#','#variables.debt#','#variables.amountrepaid#');
              </cfquery>

        <cfset variables.success = 1>

        <cfset RevisionJSON = SerializeJSON(variables.success)>

        <cfscript>
            writeOutput(RevisionJSON);
        </cfscript>

    </cffunction>


</cfcomponent>