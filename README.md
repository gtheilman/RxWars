##Prescription Wars

*Prescription Wars* is a variation on the old [DrugWars](https://en.wikipedia.org/wiki/Drugwars) DOS game where players buy and sell illicit drugs.  

Players take on the role of gangs that buy medicines from pharmacies and then re-sell them for non-therapeutic uses (on the street).   The goal is to make more money than other players.   Each teams' net profit (or loss) is displayed in real-time on the screen.

![Scoreboard](https://raw.githubusercontent.com/gtheilman/RxWars/master/media/scoreboard.png)

The six baseline medications are alprazolam, hydrocodone, oxycodone, amphetamine, oxandrolone and trazodone.  Oxandrolone is an anabolic steroid (Schedule III) that is sometimes used illicitly by athletes.  Trazodone, while prescription-only, is not a controlled substance.   However, people have been known to [crush and insufflate](http://www.bluelight.org/vb/archive/index.php/t-188496.html) the tablets.

Players initially borrow money from the loan shark so that they can purchase medicines from pharmacies using fake prescriptions.  While the cost of buying drugs from pharmacies stays constant, the risk of getting arrested increases with the number of units bought.   Think of it as the pharmacist being much more suspicious when someone comes in with a prescription for 300 oxycodone tablets than they would be if the person was only getting 10 tablets.

If the player purchases the drugs without getting arrested, they can then sell them on the street.   The street price fluctuates based on how many units are available for sale from all the players.   If all the players are buying up alprazolam, there is going to be glut on the market and the street price goes down.   However, if only one or two players have any alprazolam, the street price will likely be higher.   


I use this game as a framing device during pharmacy school classes dealing with prescription drug abuse as a public health problem.  While students play the game I change the market environment to illustrate [various strategies](http://journalofethics.ama-assn.org/2013/05/hlaw1-1305.html) that governments have used to combat the prescription drug abuse problem.   These changes might include increasing surveillance of Schedule II drugs, increasing the risk of arrest when selling on the street, efforts to decrease demand, etc.   

Street price can also be influenced by a "demand multiplier" that can be set for each individual drug.   For example, when [tamper-resistant oxycodone](http://www.medicaldaily.com/crush-proof-oxycontin-pills-have-done-little-curb-americas-problem-drug-abuse-325262) tablets were introduced, the demand for oxycodone tablets went down.   However, the demand for other opiates (especially heroin) went up.

 The students playing the game are first oriented to the interface and gameplay.
 *  When they borrow from the loan shark, interest accrues roughly every 30 seconds.   They need to pay back their loans as quickly as possible.
 *  The risk of being arrested buying drugs from pharmacies is random, but the likelihood is increased the more units they try to buy.   Risk of arrest goes up dramatically once they exceed purchasing 100 units.
 *  If arrested, the player loses whatever money they were trying to spend (and, of course, they don't get the drugs).   They also are assessed "legal fees" to pay lawyers to keep them out of jail.  The legal fees are proportional to the value of the transaction.   If they were trying to buy 300 oxycodone tablets, the legal fees will be higher than if they were trying to buy 10 trazodone.   If they don't have enough money to pay the legal feels, the amount needed is automatically borrowed from the loan shark.
 *  The risk of selling on the street is constant (although it can be adjusted by the administrator).   The thought is that if someone is selling to an undercover policeman, it doesn't really matter if they were trying to sell 10 pills or 100...they are still going to get arrested.   But, as when buying, the legal fees that are assessed after being arrested for selling are proportional to the value of the transaction.
 *  Because of the relationships between size of transactions, risk of arrest and legal fees, students are strongly encouraged to "go slow" and keep their transactions small.   Trying to make "big deals" with hundreds of tablets at a time is a sure way to get in deep with the loan shark.
 *  There is a 5 second 'lockout' period after each transaction.   This is to encourage strategic thinking rather than simply pressing buttons as quickly as possible.
 *  Players can also "snitch" on other players.   For a fee of $5,000, a player can arrange that the other player will be arrested during their next transaction.   While the player who was "snitched on" gets a notice that their being arrested was the result of action by another player, they aren't told who did it.


While the administrator can set risk of arrest, prices, demand, etc for individual drugs, there are also several pre-programmed scenarios.
*  **Gangster's Paradise**  Practically no law enforcement.   Can be thought to be analogous to a time before laws such as the Controlled Substance Act were passed.   Would be a good initial scenario to allow students to get used to game play and build up a little bit a money.
*  **Decriminalization**  The demand multiplier goes to near zero because people won't buy drugs illegally when they can get them legally.   Street prices drop to a minimum.
 

