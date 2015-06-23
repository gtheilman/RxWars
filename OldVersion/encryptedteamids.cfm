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


<cffunction access="public" name="encryptText" returntype="string">
    <cfargument name="encryptedtext" type="string" required="yes">
    <CFQUERY NAME="Key" datasource="faculty">
            SELECT      Variable_Value
            FROM         Variables 
            WHERE       Variable_Name = 'Encryption_Key'
        </CFQUERY>

    <cfset encryptedText = encrypt(#arguments.encryptedtext#, #Key.Variable_Value#, "DES", "Hex")>

    <cfreturn encryptedText>

</cffunction>
<table>
<cfloop from="1" to="27" index="i">
    <cfoutput>
        <cfset encryptedteamid = encrypttext(i)>
            <tr>
            <td>#i#</td>
        <td>https://pharmd.umc.edu/RxWars/index.cfm?teamid=#encryptedteamid#</td>
        </tr>

    </cfoutput>
</cfloop>

</table>