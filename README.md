##Prescription Wars

*Prescription Wars* is a multiplayer variation on the old [DrugWars](https://en.wikipedia.org/wiki/Drugwars) DOS game where players buy and sell illicit drugs.  


I use this game as a framing device during pharmacy school classes dealing with prescription drug abuse as a public health issue.  While students play the game I change the market environment to illustrate [various strategies](http://journalofethics.ama-assn.org/2013/05/hlaw1-1305.html) that governments have used to combat the problem.   These changes might include increasing surveillance of Schedule II drugs, increasing the risk of arrest when selling on the street, efforts to decrease demand, etc.   Students can then try to see how these strategies might affect the illicit prescription drug trade.


Some of the slides I use during the class are [here](https://github.com/gtheilman/RxWars/blob/master/media/RxWars_PowerPoint.pptx?raw=true).





Players take on the role of gangs that buy medicines from pharmacies and then re-sell them for non-therapeutic uses (on the street).   The goal is to make more money than other players.   Each teams' net profit (or loss) is displayed in real-time on the screen.

![Scoreboard](https://raw.githubusercontent.com/gtheilman/RxWars/master/media/scoreboard.png)

The six baseline medications are alprazolam, hydrocodone, oxycodone, amphetamine, oxandrolone and trazodone.  Oxandrolone is an anabolic steroid (Schedule III) that is sometimes used illicitly by athletes.  Trazodone, while prescription-only, is not a controlled substance.   However, people have been known to [crush and insufflate](http://www.bluelight.org/vb/archive/index.php/t-188496.html) the tablets.  The administrator (faculty member) can tailor the drug list however they like.

![admin](https://raw.githubusercontent.com/gtheilman/RxWars/master/media/drugs.png)



Players initially borrow money from the loan shark so that they can purchase medicines from pharmacies using fake prescriptions.  While the cost of buying drugs from pharmacies stays constant, the risk of getting arrested increases with the number of units bought.   Think of it as the pharmacist being much more suspicious when someone comes in with a prescription for 300 oxycodone tablets than they would be if the person was only getting 10 tablets.



![BuySell](https://raw.githubusercontent.com/gtheilman/RxWars/master/media/buySell.png)


If the player purchases the drugs without getting arrested, they can then sell them on the street.   The street price fluctuates based on how many units are available for sale from all the players.   If all the players are buying up alprazolam, there is going to be glut on the market and the street price goes down.   However, if only one or two players have any alprazolam, the street price will likely be higher.     Street prices are always at least a little bit higher than pharmacy prices (no criminal is going to engage in "loss-leaders"!).



![settings](https://raw.githubusercontent.com/gtheilman/RxWars/master/media/settings1.png)


Street price can also be influenced by a "demand multiplier" that can be set for each individual drug.   For example, when [tamper-resistant oxycodone](http://www.medicaldaily.com/crush-proof-oxycontin-pills-have-done-little-curb-americas-problem-drug-abuse-325262) tablets were introduced, the demand for oxycodone tablets went down.   However, the demand for other opiates (especially heroin) went up.

![Prices](https://github.com/gtheilman/RxWars/blob/master/media/streetPrices.png)

 I spend the first part of the exercise orienting the students to the interface and gameplay.
 *  I usually recommend that the work in teams of three persons sitting in front of one laptop.   The idea is to get them talking to each other about what's going on rather than just clicking buttons.
 *  When they borrow from the loan shark, interest accrues roughly every 30 seconds.   They need to pay back their loans as quickly as possible.   A message pops up every thirty seconds telling them about the interest and urging them to pay back the loan.
 *  Being arrested buying drugs from pharmacies is random, but the risk is increased the more units they try to buy.   Risk of arrest goes up dramatically once they try to purchase more than 100 units.  The risk of arrest is displayed next to the number of tablets they are planning to buy.
 *  If arrested, the player loses whatever money they were trying to spend (and, of course, they don't get the drugs).   They also are assessed "legal fees" to pay lawyers to keep their minions out of jail.  The legal fees are proportional to the value of the transaction.   If they were trying to buy 300 oxycodone tablets, the legal fees will be higher than if they were trying to buy 10 trazodone.   If they don't have enough money to pay the legal fees, the amount needed is automatically borrowed from the loan shark.
 *  The risk of selling on the street is constant (although it can be adjusted by the administrator).   The thought is that if someone is selling to an undercover policeman, it doesn't really matter if they were trying to sell 10 pills or 100...they are still going to get arrested.   But, as when buying, the legal fees that are assessed after being arrested for selling are proportional to the value of the transaction.   Being busted when carrying out a big transaction carries a larger penalty than being busted when selling just a few tablets.
 *  Because of the relationships between size of transactions, risk of arrest and legal fees, students are strongly encouraged to "go low, go slow" and keep their transactions small.   Trying to make "big deals" with hundreds of tablets at a time is a sure way to get in deep with the loan shark.
 *  There is a 5 second 'lockout' period after each transaction.   This is to encourage strategic thinking rather than simply pressing buttons as quickly as possible.
 *  Players can also "snitch" on other players.   For a fee of $5,000, a player can arrange that the other player will be arrested during their next transaction.   While the player who was "snitched on" gets a notice that their being arrested was the result of action by another player, they aren't told who did it.   


![busted](https://raw.githubusercontent.com/gtheilman/RxWars/master/media/buySell3.png)


While the administrator can set risk of arrest, prices, demand, etc for individual drugs, there are also several pre-programmed scenarios.
*  **Gangster's Paradise**  Practically no law enforcement.   Can be thought to be analogous to a time before laws such as the Controlled Substance Act were passed.   Would be a good initial scenario to allow students to get used to game play and build up a little bit of money.
* **Controlled Substances Act** In 1970 the U.S. government set up the 5 controlled substances "schedules" and forbade refills on Schedule II prescriptions. Baseline risk of arrest while buying Schedule II drugs is set at 25%. Baseline risk for Schedules III-V set at 15%. Risk of arrest when buying unscheduled drugs is 5%. Risk of arrest while selling is set at 10% for all. 
* **Controlled Substances Penalties Amendments Act of 1984** This 1984 legislation increased penalties for repeat-offenders and for selling drugs within 1000 feet of a school. Increases the legal fees assessed when arrested for buying or selling.
* **Prescription Drug Monitoring Programs**  Wide availablity of networked computers in early 21st century increased the ability of prescription drug monitoring programs to detect non-therapeutic prescribing.  Increases the risk of being arrested when buying any scheduled drugs.
*  **Decriminalization**  The demand multiplier goes to near zero because people won't buy drugs illegally when they can get them legally.   Street prices drop to a minimum.
 


### Technical Details

The program is written in JavaScript using Bootstrap and the Meteor framework.   Meteor was chosen to allow for simple deployment by faculty members with little programming experience.   

Meteor lends itself well to deployment using a [Platform as a Service](https://en.wikipedia.org/wiki/Platform_as_a_service) (Paas) provider.  These are services where the server itself is managed by the company and the user is simply responsible for uploading and maintaining the application running on it. 

 _**Meteor hosting is no longer free. You can still deploy to another, paid hosting service, though**_

[Modulus](http://help.modulus.io/customer/portal/articles/1647770-using-meteor-with-modulus), [Heroku](https://github.com/jordansissel/heroku-buildpack-meteor) or [Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-meteor-js-application-on-ubuntu-14-04-with-nginx) 

###Installation

If you are a faculty member at an accredited health-care education school and would like assistance setting this up for your institution, please feel free to contact me.   

Installation does involve some use of the command line.  If you have no idea what "ls", "sudo" or "mkdir" mean, it might be best to get someone to help you.  But, if you are feeling adventurous, go ahead and follow the instructions below.

**Step 1** Sign up for a [Meteor account](https://www.meteor.com/)

It may not be immediately obvious, but to create an account you first click on the "Sign In" button on the Meteor website.  Then you will be given the opportunity to create a new account.


**Step 2:** Install Meteor on your local Windows, Mac or Linux computer.

The official instructions are [here](https://www.meteor.com/install), but you also might find these [unofficial instructions](http://meteortips.com/first-meteor-tutorial/getting-started/)  helpful.   

_Windows:_   The Windows installation process is pretty similar to what you see with installing other Windows programs.


_Mac:_  The Mac installer requires that you use [Terminal](http://guides.macrumors.com/Terminal).   You can [find the icon to open Terminal](http://www.wikihow.com/Open-Applications-Using-Terminal-on-Mac) in your Applications/Utilities folder.  Once you have Terminal open, cut and paste [the command](https://www.meteor.com/install) from the Meteor website into the Terminal window.  Then press <code>return</code>.


You can skip the "demo application" that Meteor asks you to create.

**Step 3:**  Download the application files to your local computer

Go to the [releases page](https://github.com/gtheilman/RxWars/releases) to obtain the most recent version of the application.   Download the zip file.

If you have a Mac, it will probably unzip the folder for you automatically.

If you have Windows, you'll need to unzip the folder yourself.

**Step 4:**  Run the application locally at least once.  

This involves going into Terminal (or Windows command prompt) and changing to the directory containing the Meteor files.  It can sometimes be difficult to figure out the path to the files you just downloaded.  Here's a way of doing it that might be easiest:

 
1.  Go back to the Terminal  (or [Windows command prompt](Open the [command prompt](http://www.7tutorials.com/7-ways-launch-command-prompt-windows-7-windows-8) )).

2. From the command prompt, type <code>cd </code>.   That's the letter "c" , the letter "d" and a space.  Don't hit return yet.

3. From with Windows _File Manager_ (or OSX _Finder_) locate the folder with the files you just downloaded and unzipped.  It probably starts with "OnCallAssignments-".  Don't move it from its original location.

4. [Drag](http://osxdaily.com/2009/11/23/copy-a-files-path-to-the-terminal-by-dragging-and-dropping/) the folder _name_ with little folder icon in front of it into the Terminal/command prompt window.   You are not selecting a bunch of files, but just that one line with the folder name.  Make sure you choose the folder immediately above the collection of files.  **The screenshot below is from another application I wrote.   In this case, the folder will probably be named "rxwars...something".**

![](https://github.com/gtheilman/OncallAssignments/blob/master/media/folders.jpg) 
 
Drop it anywhere in the Terminal/command prompt window.

Click with your mouse anywhere in the Terminal/command prompt window.  Now press the <code>Enter/return</code> key.

Type the word <code>meteor</code> in the Terminal window.   Press the <code>Enter/return</code> key.  It will take a few minutes for the installation process to complete.

The program is now running on your local computer.    You can access it by pointing your web browser at <code>http://localhost:3000/</code>


**Step 5:**  Deploy the application

While you can open the application in a web browser while it is running on your local computer, you'll likely have problems getting other people to connect to it if it is not accessible to the outside world.   So, we're going to stop the program on your local computer by holding down the <code>Ctrl</code> (or <code>control</code>) key and tapping <code>c</code> twice
 
_**Meteor hosting is no longer free. You can still deploy to another, paid hosting service, though**_
 


###Initial Use

**Step 1:** Open the application in your web browser using the provided URL  

When the application is initially set up, the _login | password_  is _admin | admin_.



**Step 2:**  Go to the Settings page

_**Meteor hosting is no longer free. You can still deploy to another, paid hosting service, though**_

Alternatively, there is a link in the upper-left corner of the screen to the "settings" page.


Once on the settings page, there is a link to the "database" page.


Go into "Users" and change the admin password to something private.   The only way to recover a password is by requesting that the application send a password reset link by email.   If you forget your password and have not provided a recovery email address, you are locked out of the application. Since the package I'm using for the database view doesn't seem to allow changing the admin account email address, I'd strongly suggest immediately creating a new account (with a valid email address) and giving it admin rights.    If you forget the admin password, use that new account to login.   If you forget the *new* account password as well, you can have the system email a password reset link to the new account's email address.
 

**Step 3:** Start the market

Go back to the "Settings" page.   There is a link to Start/Pause the marketplace.


**Step 4:** Have players create accounts and login.



###Notification of Use

**If you use this software for a class, please send me an email letting me know.**  This is just so I can include some information on my faculty activity report regarding how the software is being used.

### Disclaimers

I have not installed any "backdoors" that would allow me to access your installation of the application.   You can review the source code to see for yourself.   If you wish me to provide some sort of assistance once you have the application set-up, you would have to provide me with credentials to access your application.

Please review the software's license regarding lack of warranty and liability.    We are not responsible for anything bad that happens as a result of your using this software.
