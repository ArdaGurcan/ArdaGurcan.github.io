// Define gun instance
let gun = Gun([
    "http://77.68.15.151:1234/gun",
    "https://gun-manhattan.herokuapp.com/gun",
]);

// Define user
let user = gun.user();

// Define usernames and channel id
let user1 = null;
let user2 = null;

let channelName = null;

// All currently unusued fields
$("#receiver, #said, #rh, #sh").hide();

// On sign up
$("#up").on("click", function (e) {

    // Create user with #alias as username and #pass as password
    user.create($("#alias").val(), $("#pass").val());

    // Log sign-up to console
    console.log($("#alias").val() + ": " + $("#pass").val() + " signed up");
});

// On sign in
$("#sign").on("submit", function (e) {

    // Prevent page refresh
    e.preventDefault();

    // Authenticate user
    user.auth($("#alias").val(), $("#pass").val());

    // Log sign-in to console
    console.log($("#alias").val() + ": " + $("#pass").val() + " signed in");
});

// On receiver set
$("#receiver").on("submit", function (e) {

    // Prevent page refresh
    e.preventDefault();

    // Set user2's name
    user2 = $("#user2").val();

    // Cosmetics
        // Display receiver in h4 tag
        $("#rh").text("Receiver: " + user2);
        $("#rh").show();
        
        // Make chat form visible
        $("#said").show();

    // Set the channel name to combination of usernames
    channelName = user1 < user2 ? user1 + user2 : user2 + user1;
    
    // Pull up all messages in channel
    $("ul")[0].innerHTML = "";
    gun.get(channelName).map().once(UI);
});

// On message sent
$("#said").on("submit", function (e) {

    // Prevent page refresh
    e.preventDefault();

    // If not authenticated stop
    if (!user.is) return;

    // Add message to channel
    gun.get(channelName).set($("#say").val());

    // Log message to console
    console.log(user1 + " said " + $("#say").val() + " to " + user2);
    $("#say").val("");
});

// Update UI
function UI(say, id) {

    // If li element with messageID doesn't exist 
    let li = $("#" + id).get(0) 

    // Add message to ul
    || $("<li>").attr("id", id).appendTo("ul");
    $(li).text(say);
}

// On authenticated (all coosmetics)
gun.on("auth", function () {
    
    // Set user1's name
    user1 = $("#alias").val();
    
    // Cosmetics
        // Hide login form
        $("#sign").hide();

        // Show choose recipient form
        $("#receiver").show();

        // Display sender in h4 tag
        $("#sh").text("Sender: " + user1);
        $("#sh").show();

    // Log authed to console
    console.log("authenticated");
});
