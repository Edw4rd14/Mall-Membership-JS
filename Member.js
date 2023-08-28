// Name : Edward Tan Yuan Chong
// Class: DAAA/1A/04
// Adm  : 2214407
class Member { //Class for Members' information
    constructor (name,membershipType,dateJoined,dateOfBirth,points,history) {
        this.name = name;
        this.membershipType = membershipType;
        this.dateJoined = dateJoined;
        this.dateOfBirth = dateOfBirth;
        this.points = points;
        this.history = history;
    }
    cycleInfo(x) { // This function cycles through the information of the member, etc name, membership type and such, from values of 0 to 4.
        switch(x) {
            case 0: 
                return this.name;
                break;
            case 1:
                return this.membershipType;
                break;
            case 2:
                return this.dateJoined;
                break;
            case 3:
                return this.dateOfBirth;
                break;
            case 4:
                return this.points;
                break;
        }
    }
    membershipBonusPoints(amountUpdated) { // Adds bonus points to amount of points members are getting based on their ranks (0% for ruby, 10% for gold, 20% for platinum, 30% for diamond)
        if(this.membershipType.toLowerCase() == "ruby")
            return amountUpdated * 0;
        else if(this.membershipType.toLowerCase() == "gold")
            return amountUpdated * 0.10;
        else if(this.membershipType.toLowerCase() == "platinum") 
            return amountUpdated * 0.20;
        else
            return amountUpdated * 0.30;
    }
    updatePoints(date,value) { // Function to convert amount of money spent to points and update for that member
        var amountUpdated = 0;
        if(value<=50) {
            this.points += 10;
            amountUpdated = 10;
        }
        else if(value> 50 && value <= 100) {
            this.points += 50;
            amountUpdated = 50;
        }
        else if(value > 100 && value <= 200) {
            this.points += 100;
            amountUpdated = 100;
        }
        else if(value > 200 && value <= 500) {
            this.points += 200;
            amountUpdated = 200;
        }
        else if(value > 500 && value <= 1000) {
            this.points += 500;
            amountUpdated = 500;
        }
        else if(value > 1000 && value <= 2500) {
            this.points += 1000;
            amountUpdated = 1000
        }
        else {
            this.points += 2000;
            amountUpdated = 2000;
        }
        this.points += this.membershipBonusPoints(amountUpdated);
        this.history.push([date,value,this.membershipType,this.membershipBonusPoints(amountUpdated),this.points]); // This line will update the user's history array so that submenu 7 will be able to have their points history
        
    }
    updateRank(points) { // This function would update a member's rank based on their current points
        if(points <= 500) {
            this.membershipType = "Ruby";
        } else if(points > 500 && points <= 5000) {
            this.membershipType = "Gold";
        } else if(points > 5000 && points <= 20000) {
            this.membershipType = "Platinum";
        } else {
            this.membershipType = "Diamond";
        }
    }
}
//Export statement
module.exports = Member;