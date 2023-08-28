// Name : Edward Tan Yuan Chong
//Importing classes
var Member = require("./Member.js"); // Import Member class
var MemberGroup = require("./MemberGroup.js"); // Import memberGroup Class
const fs = require("fs"); // Import file system module
const readline = require("readline-sync");
var savedMembers = require("./savedMembers.json"); // Import object in JSON file in this case is array of previously new added members
// Variables
var memberList = new MemberGroup;
var resetDatabase = false; // Boolean variable set to false so it does not reset database unless option 8 is chosen
const namePrompt = "Please enter member's name: "; // Placeholder text for name input
const repromptName = "Please enter a valid name.\n";
const date = new Date(); // Has today's date value
const ranks = ["Ruby","Gold","Platinum","Diamond"]; // All membership types that exist
var amountOfMembers = memberList.member.length; // Variable for amount of members in MemberGroup
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// Functions
function todaysDate() { // Prints today's date in the format of the application
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;  // Print todays' date in the format
}
function mainMenu() { //Ask user menu option
    return readline.question(`\nHi ${capitalize(name)}, please select your choice:\n\t1. Display all members' information\n\t2. Display member information\n\t3. Add new member\n\t4. Update points earned\n\t5. Edit new member's information\n\t6. Show a member's update history\n\t7. Statistics\n\t8. Reset database\n\t9. Exit\n\t>> `);
}
function subMenu() { //Ask user for sub menu option
    do {
        var subOption = readline.question("\t\tPlease select an option from the sub-menu:\n\t\t1. Display names of (all) a certain type of members only.\n\t\t2. Display the name of the youngest and oldest member in the system.\n\t\t3. Display the name of the members with the highest and lowest points earned.\n\t\t4. Display total number of members in each membership type.\n\t\t5. Display the total points in each membership type.\n\t\t6. Return to main-menu\n\t\t>> ");
        switch(subOption) {
            case "1":
                memberList.printMembersInMembershipType();
                break;
            case "2":
                console.log(`\t\tYoungest Member: ${oldestOrYoungestMember("youngest")}
                Oldest Member  : ${oldestOrYoungestMember("oldest")}
                `);
                break;
            case "3":
                console.log(`\t\tHighest Member: ${highestOrLowestPointMember("highest")}
                Lowest Member : ${highestOrLowestPointMember("lowest")}
                `);
                break;
            case "4":
                totalPointOrMembersInRank("members");
                break;
            case "5":
                totalPointOrMembersInRank("points");
                break;
            case "6":
                break;
            default:
                console.log("\t\tPlease enter a valid option from the sub-menu.\n");
        }
    }while(subOption != "6");
}
function capitalize(nameCapitalize) { //Capitalize first letter of name and lowercase the rest of the name.
    if(nameCapitalize.length != 0)
        return nameCapitalize[0].toUpperCase() + nameCapitalize.slice(1).toLowerCase();
    return "";
}
function validNameCheck(nameCheck) { //Checks user's name if contains letters and space only and returns boolean value, true if name input is all letters & space only, false if it includes non letters etc, numbers or symbols
    return /^[A-Za-z\s]*$/.test(nameCheck);
}
function updatePointsAndLength() {
    amountOfMembers = memberList.member.length; // This line reinitialises the value of amountOfMembers after every while loop to ensure that the variable is constantly updated.
    for(var i=0;i<amountOfMembers;i++) { // The code here would update a member's rank everytime the do while loop loops, which keeps their ranks updated constantly
        memberList.member[i].updateRank(memberList.member[i].points);
    }
}
function oneMemberInformation(nameInput) {
    if(memberList.memberExist(nameInput)) {
        return memberList.displayInformation(memberList.memberPosition(nameInput)); //Display information of the persons name that was inputted
    }// Check if member exists, and if the member exists, their information will be returned by the function,  hence it will not run error message
    console.log("Member does not exist.");
}
function highestOrLowestPointMember(highestOrLowest) { // Returns name of member with highest/lowest points based on parameter
    var point = memberList.member[0].points;
    var pointIndex = 0;
    var memberPointString = ``;
    for(var i=1;i<amountOfMembers;i++) { // Loop through all members and if highest points is wanted, it will run the first if statement to check for highest point member, else it will run the else statement to find lowest point member.
        if(highestOrLowest == "highest") {
            if(memberList.member[i].points > point) {
                point = memberList.member[i].points;
                pointIndex = i;
                memberPointString = `${memberList.member[pointIndex].name}, `; // Add the highest point member found.
            }
        } 
        else {
            if(memberList.member[i].points < point) {
                point = memberList.member[i].points;
                pointIndex = i;
                memberPointString = `${memberList.member[pointIndex].name}, `; // Add the lowest point member found.
            }
        }
        if(memberList.member[i].points == point && i != pointIndex) { // If a member has the same amount of points as the current highest/lowest point member and they are not the same person, their name will be added into the string.
            memberPointString += `${memberList.member[i].name}, `;
        }
    }
    return `${memberPointString.slice(0,-2)}.`;
}
function membersAgeFormat(membersDOB) { // Returns format of age (year.month in numerical format) to compare a persons age with their year(whole number) and month(decimal) born to be more precise when comparing for oldest/youngest member
    var monthValue = 0;
    for(var i=0;i<months.length;i++) {
        if(months[i] == membersDOB.slice(-8,-5)) {
            monthPosition += (i+1)/100; // Will add decimal of month/10 to age value to take into account the age of the person based off month as well.
        }
    }
    return (date.getFullYear() - parseInt(membersDOB.slice(-4))) + monthValue;
}
function oldestOrYoungestMember(oldestOrYoungest) { // Returns name of oldest or youngest member based on parameter, and it takes into account member's day,month and year born
    var membersAgeValue = membersAgeFormat(memberList.member[0].dateOfBirth);
    var ageIndex = 0; // Sets initial oldest/youngest member as first member.
    var memberAgeString = `${memberList.member[0].name}, `;
    if(oldestOrYoungest == "oldest") {
        for(var i=1;i<amountOfMembers;i++) { // Loops through all members except first member as the first member is already set temporarily as oldest/youngest if no one replaces them.
            if(membersAgeFormat(memberList.member[i].dateOfBirth) > membersAgeValue) { // If there is a member whose age value is higher than the highest age value,
                membersAgeValue = membersAgeFormat(memberList.member[i].dateOfBirth); // It will set it as the new oldest age value, update oldest member's position, then reinitialise the string to remove the first temporary member and add themself in.
                ageIndex = i;
                memberAgeString = `${memberList.member[i].name}, `;
            }
            else if(membersAgeFormat(memberList.member[i].dateOfBirth) == membersAgeValue) { // else if there is a member whose age value is currently equal to oldest member
                if(parseInt(memberList.member[i].dateOfBirth.slice(0,2)) < parseInt(memberList.member[ageIndex].dateOfBirth.slice(0,2))) { // if that member's day born is smaller than the temporary oldest member's day born, that member will become the new oldest member and string and ageIndex will be reinitalised.
                    memberAgeString = `${memberList.member[i].name}, `;
                    membersAgeValue = membersAgeFormat(memberList.member[i].dateOfBirth);
                    ageIndex = i;
                } else if (parseInt(memberList.member[i].dateOfBirth.slice(0,2)) == parseInt(memberList.member[ageIndex].dateOfBirth.slice(0,2))) { // else if that member's day born is similar to oldest member's day born, that member's name will be added to the string
                    memberAgeString += `${memberList.member[i].name}, `;
                }
            }
        }
    }
    else { // Code for youngest member
        for(var i=1;i<amountOfMembers;i++) {            
            if(membersAgeFormat(memberList.member[i].dateOfBirth) < membersAgeValue) {
                membersAgeValue = membersAgeFormat(memberList.member[i].dateOfBirth);
                ageIndex = i;
                memberAgeString = `${memberList.member[i].name}, `;
            }
            else if(membersAgeFormat(memberList.member[i].dateOfBirth) == membersAgeValue) {
                if(parseInt(memberList.member[i].dateOfBirth.slice(0,2)) > parseInt(memberList.member[ageIndex].dateOfBirth.slice(0,2))) {
                    memberAgeString = `${memberList.member[i].name}, `;
                    membersAgeValue = membersAgeFormat(memberList.member[i].dateOfBirth);
                    ageIndex = i;
                } else if (parseInt(memberList.member[i].dateOfBirth.slice(0,2)) == parseInt(memberList.member[ageIndex].dateOfBirth.slice(0,2))) {
                    memberAgeString += `${memberList.member[i].name}, `;
                }
            }
        }
    }
    return `${memberAgeString.slice(0,-2)}.`;
}
function totalPointOrMembersInRank(pointsOrMembers) { // Prints the number of members in each membership type/Total points in rank based on parameter
    for(var x=0;x<ranks.length;x++) { // The nested for loop will start with one rank, then cycle through all members (for loop value i), then x increments by 1, and it cycles through all members again, hence cycling the 4 ranks to see number of members in them.
        var totalPoints = 0; // Reset total points to 0 after every rank.
        var count = 0; // count is resetted here to 0 as after the previous rank is printed out, the count will have to reset to count the number of members in the new rank.
        for(var i=0;i<amountOfMembers;i++) {
            if(memberList.member[i].membershipType == ranks[x]) { // for loop to cycle through all member's rank to see if it matches current value of rank[x], and if so, count will increment by 1/Points from member in that rank will be added to totalPoints variable.
                count++;
                totalPoints += memberList.member[i].points; // Add that members points to totalPoints variable if that current rank in the loop
            }
        }
        if(pointsOrMembers == "points")
            console.log(`\t\t${ranks[x]}: ${totalPoints}`); // Print rank + total points from members in that rank
        else
            console.log(`\t\t${ranks[x]}: ${count}`); // print rank + number of members in that rank
    }
    process.stdout.write("\n");
}
function newMemberPrompt() { // Prompt for a new members name until the name inputted doesnt exist in database, is valid and it is not an empty string
    do {
        var newMemberName = capitalize(readline.question(namePrompt));
        if(!validNameCheck(newMemberName)|| newMemberName.trim().length == 0) {
            console.log(repromptName);
        } else if (memberList.memberExist(newMemberName)) {
            console.log("Member's name exists in database. Please enter a new name.\n");
        }
    }while(!validNameCheck(newMemberName)||memberList.memberExist(newMemberName)|| newMemberName.trim().length == 0); // Will keep prompting user for new member name if member already exists (memberList.memberExist() function) or the name is invalid (!validNameCheck()).
    return newMemberName;
}
function promptAmountSpent() { // Prompt for amount a member spent until input is a numerical value and is more than 0
    do {
        var amountSpent = readline.question("Please enter amount spent: "); // Check amount spent not less than 0, or negative etc.
        if(isNaN(amountSpent) || amountSpent <= 0)
            console.log("Please enter a valid input (in numerical value and more than 0).\n"); // Will keep reprompting if input is not numerical or is less than $0.
    }while(isNaN(amountSpent) || amountSpent <= 0);
    return amountSpent;
}
do {
    var name = readline.question("Welcome to XYZ Membership Loyalty Programme!\nPlease enter your name: ");
    if(!validNameCheck(name) || name.trim().length == 0)
        console.log(repromptName);
}while(!validNameCheck(name) || name.trim().length == 0); // Checks if user's name input is valid and whether it is an empty string, otherwise it will keep prompting.
do {
    if(savedMembers.length == 0) { // Ifelse statement to ensure that the array of members (memberList.member) is constantly updated
        savedMembers = memberList.member; // If json file array is empty, it will make that array into current member array (which is the default 5)
    } else {
        for(var i=0; i<savedMembers.length; i++) { // Will replace all members info from memberList group with the saved one from previously, and adding new members that were previously added.
            memberList.member[i] = new Member(savedMembers[i].name,savedMembers[i].membershipType,savedMembers[i].dateJoined,savedMembers[i].dateOfBirth,savedMembers[i].points,savedMembers[i].history);
        }
    }
    updatePointsAndLength(); // Function is put here so it updates points and memberlist array length variable (amountOfMembers) 
    var option = mainMenu(); // Prompt menu
    switch (option) {
        case "1":
            for(var i=0;i<amountOfMembers;i++) { //For loop value will loop through the entire array of members and the function displayInformation(i) would display members in memberList information
                memberList.displayInformation(i);
            }
            break;
        case "2":
            oneMemberInformation(capitalize(readline.question(namePrompt))); // Prints the list of information of member's name from input
            break;
        case "3":
            savedMembers.push(new Member(newMemberPrompt(),"Ruby",todaysDate(),readline.question("Please enter member's date of birth: "),0,[])); 
            break;
        case "4":
            var updateMemberName = capitalize(readline.question(namePrompt));
            if(!memberList.memberExist(updateMemberName)) // If member doesnt exist, print error message, else prompt amount spent and update
                console.log("Member does not exist.");
            else {
                memberList.member[memberList.memberPosition(updateMemberName)].updatePoints(todaysDate(),promptAmountSpent()); //This updates the member's (user input) points for the amount they spent (promtped by the function promptAmountSpent()).
                savedMembers[memberList.memberPosition(updateMemberName)].points = memberList.member[memberList.memberPosition(updateMemberName)].points; // Makes sure that array saved in json file is also updated with the new points of that member.
            }
            break;
        case "5":
            memberList.editMemberInfo(capitalize(readline.question(namePrompt)));
            break;
        case "6":
            memberList.displayMembersHistory(capitalize(readline.question(namePrompt)));
            break;
        case "7":
            subMenu(); 
            break;
        case "8":
            resetDatabase = true;
            console.log("Database will be reset after exit.");
            break;
        case "9":
            console.log("Thank you & Goodbye!\n");
            break;
        default:
            console.log("Please enter a valid option from the menu.\n");
    }
}while(option != "9");
fs.writeFileSync("./savedMembers.json", JSON.stringify(memberList.member));// Same as writeFile but doesnt take callback and doesnt return anything, hence no need to check for error as if it runs into error, it just throws the data
if(resetDatabase) {
    fs.writeFileSync("./savedMembers.json",JSON.stringify([])); // Will reset json file if option resetDatabase value was set to true from option 8.
}