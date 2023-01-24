let mem = {};

function getList() {
  return mem;
}


function getMembers() {

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('response'); //pull data from response sheet

  var emails = sheet.getDataRange().getValues();  //extract values from response sheet
  let m = []; //array of email
  let f = []; //array of first name
  let l = []; //array of last name

  let members = getList();

  emails.shift(); //remove first email
  emails.forEach((elem) => {
    Logger.log(elem[1]);
    Logger.log(elem[2]);
    Logger.log(elem[3]);


    f.push(elem[1]);
    l.push(elem[2]);
    m.push(elem[3]);


  })

  Logger.log(members);

  Logger.log(emails);
  Logger.log(m);
  Logger.log(l);
  Logger.log(f);
  Logger.log(emails.length);

  addConnections(m, f, l); //calling function to add emails to Hello label
}


function addConnections(email, fname, lname) {

  Logger.log(email[0]);
  Logger.log(fname[0]);
  Logger.log(lname[0]);

  for (var i = 0; i < email.length; i++) {
    if (!(ContactsApp.getContact(email[i]))) {
      //create the Contact
      Logger.log("inside")
      let contact = ContactsApp.createContact(fname[i], lname[i], email[i]);

      var mainGroup = ContactsApp.getContactGroup("System Group: My Contacts");
      mainGroup.addContact(contact);
      //find the Label
      let group = ContactsApp.getContactGroup("hello");

      //add contact to label
      group.addContact(contact);

    }
  }


  //finding all contacts
  var people = People.People.Connections.list('people/me', {
    personFields: 'names,emailAddresses'
  });
  Logger.log('Connections: %s', JSON.stringify(people["connections"], null, 2));

  var grp_email = [];


  if (people["connections"] != null) {
    for (var i = 0; i < people["connections"].length; i++) {
      Logger.log(people["connections"][i]["emailAddresses"][0]["value"])
      grp_email.push(people["connections"][i]["emailAddresses"][0]["value"])
    }

    Logger.log(grp_email)


    //send out emails each time user added, to show that script is working correctly
    var currentTime = new Date();

    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
    // ISTTime now represents the time in IST coordinates

    Logger.log(ISTTime.toLocaleString())
    GmailApp.sendEmail(grp_email.join(), "New Member joined", "New Member joined Hello label at : "+ISTTime.toLocaleString() + ". Only author can send emails to contact list using hello label");

    //Another approach
    //   Browser.msgBox(grp_email);
    // MailApp.sendEmail({
    //   to:grp_email.join() , 
    //   subject: "SUBJECT",
    //   });

  }


}


