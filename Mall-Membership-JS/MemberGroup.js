// Name : Edward Tan Yuan Chong
// Class: DAAA/1A/04
// Adm  : 2214407
const readline = require("readline-sync");
const table = require("table"); // Import table from npm to use for option 7 to print table to check member update history
var Member = require("./Member.js");
var savedMembers = require("./savedMembers.json"); // Import savedMembers array from JSON file
function capitalize(nameCapitalize) { //Capitalize first letter of name and lowercase the rest of the name.
    if(nameCapitalize.length != 0)
        return nameCapitalize[0].toUpperCase() + nameCapitalize.slice(1).toLowerCase();
    return "";
}
function validNameCheck(nameCheck) { //Checks user's name if contains letters and space only and returns boolean value, true if name input is all letters & space only, false if it includes non letters etc, numbers or symbols
    return /^[A-Za-z\s]*$/.test(nameCheck);
}
class MemberGroup { // Class for membergroup of array of members update this shit
    constructor () {
        this.member = [];
        this.member.push(new Member("Leonardo", "Gold", "1 Dec 2019", "1 Jan 1980", 1400, [])); // These lines will automatically add these default members into the programme whenever a new MemberGroup variable is created
        this.member.push(new Member("Catherine", "Ruby", "14 Jan 2020", "28 Oct 1985", 250, []));
        this.member.push(new Member("Luther", "Gold", "29 Apr 2020", "16 Mar 1992", 3350, []));
        this.member.push(new Member("Bruce", "Diamond", "3 Jun 2020", "18 Mar 1994", 40200, []));
        this.member.push(new Member("Amy", "Ruby", "5 Jun 2020", "31 May 2000", 500, []));
    }
    displayInformation(n) {
        var header = ["Name: ", "Membership Type: ", "Date Joined: ", "Date of Birth: ","Points Earned: "];
        process.stdout.write("\n");
        for(var i=0;i<header.length;i++) {
            console.log(`${header[i]}${this.member[n].cycleInfo(i)}`); // will display all information of users along with its header
        }
    }
    memberExist(membersName) { // Checks if the user exists in the database and returns a boolean value 
        for(var i=0;i<this.member.length;i++) { 
            if(this.member[i].name == membersName) {
                return true;
            }
        }
        return false;
    }
    memberPosition(membersName) { // Returns the members position in the list of members
        for(var i=0;i<this.member.length;i++) { 
            if(this.member[i].name == membersName) {
                return i;
            }
        }
    }
    printMembersInMembershipType() {
        do {
            var membershipTypePrompt = readline.question("\t\tEnter Membership Type: ").toLowerCase();
            if(!(membershipTypePrompt == "ruby" || membershipTypePrompt == "gold" || membershipTypePrompt == "platinum" || membershipTypePrompt == "diamond")) 
                console.log("\t\tPlease enter a valid membership type.\n");
        }while(!(membershipTypePrompt == "ruby" || membershipTypePrompt == "gold" || membershipTypePrompt == "platinum" || membershipTypePrompt == "diamond"));
        var displayMemberString = ``; // String variable to hold all members in rank input
        for(var i=0;i<this.member.length;i++) {
            if(this.member[i].membershipType.toLowerCase() == membershipTypePrompt) // Cycle through all members to check if their rank matches the one inputted, if so, add to the string
                displayMemberString += `${this.member[i].name}, `;
        }
        if(displayMemberString.length == 0)
            console.log(`\t\tThere are no members in ${membershipTypePrompt} membership type.\n`);
        else
            console.log(`\t\tMember(s) of membership type ${membershipTypePrompt}: ${displayMemberString.slice(0,-2)}.\n`); // Print out line for members, slice(0,-2) to the string variable to remove the last comma and space next to last member in the string.
    }
    displayMembersHistory(displayHistoryName) { // This code displays a members update history if they have updated their points
        var tableInfo = [["No.","Date updated","Amount Spent","Membership Type","Bonus Points","Total Points"]]; // Table header
        if(this.memberExist(displayHistoryName)) { // If member they input exists, it will run code, else run error message
            var membersHistoryArray = this.member[this.memberPosition(displayHistoryName)].history;
            if(membersHistoryArray.length == 0) { //If they have not updated their points
                console.log("This member has not updated their points.");
            } else {
            for(var i=0;i<membersHistoryArray.length;i++){ // Will push arrays of information to be placed into table to tableInfo array
                    tableInfo.push([`${i+1}`,`${membersHistoryArray[i][0]}`,`$${membersHistoryArray[i][1]}`,`${membersHistoryArray[i][2]}`,`${membersHistoryArray[i][3]}`,`${membersHistoryArray[i][4]}`]);  // Pushes a row of information as an array into tableInfo array.
            }
            console.log(`${displayHistoryName}'s update history: \n${table.table(tableInfo)}`);
            }
        } else {
            console.log("Member does not exist.");
        }
    }
    editMemberInfo(editMemberName) { // Menu to edit a new members information
        if(this.memberPosition(editMemberName) <= 4) { // Prevent user from editing the default members information
            console.log("You can only edit a new member's information!");
        } else {
            if(this.memberExist(editMemberName)) { // If member they input exists, it will run code, else run error message
                var editOption = readline.question(`\nPlease select your option: \n\t1. Edit ${editMemberName}'s Name\n\t2. Edit ${editMemberName}'s Date of Birth\n\t3. Remove ${editMemberName} from the databse\n\t4. Exit\n\t>> `);
                switch(editOption) {
                    case "1": // Prompt user for a new name for member they inputted to edit.
                        do {
                            var newMemberName = capitalize(readline.question(`Enter a new name for ${editMemberName}: `));
                            if(!validNameCheck(newMemberName)|| newMemberName.trim().length == 0) {
                                console.log("Please input a valid name.");
                            } else if (this.memberExist(newMemberName)) {
                                console.log("Member's name already exists. Please enter a new name.\n");
                            }
                        }while(!validNameCheck(newMemberName)||this.memberExist(newMemberName)|| newMemberName.trim().length == 0); // Will keep prompting user for new member name if member already exists (memberList.memberExist() function) or the name is invalid (!validNameCheck()).
                        savedMembers[this.memberPosition(editMemberName)].name = newMemberName; // Edit name for member in savedMembers array so that the member info in JSON file is also updated
                        break;
                    case "2":
                        var newDateOfBirthPrompt = readline.question(`Enter a new Date of Birth for ${editMemberName}: `);
                        savedMembers[this.memberPosition(editMemberName)].dateOfBirth = newDateOfBirthPrompt; // Edit date of birth for member in savedMembers array so that the member info in JSON file is also updated, no need to remove from memberList as after switch case do while loop loops, the memberList will be updated with savedMembers changes.            
                        break;
                    case "3":
                        savedMembers.splice(this.memberPosition(editMemberName), 1); // Removes member from savedMembers array so that the member info in JSON file is maatching the membergroup array of members
                        this.member.splice(this.memberPosition(editMemberName),1); // Remove member from memberList.member array as well
                        console.log("\tMember Removed.");
                        break;
                    case "4":
                        console.log("There were no changes made.");
                        break;
                    default:
                        console.log("Please select an option from the menu.");
                }
            } else {
                console.log("Member does not exist.");
            }
        }
    }
}
//Export statement
module.exports = MemberGroup;