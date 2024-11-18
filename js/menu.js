document.getElementById('quitButton').addEventListener('click', function(event) {
    const confirmation = confirm("Are you sure you want to quit?");
    
    if (confirmation) {
        // If user clicks 'OK', show a message
        alert("You have chosen to quit. Returning to menu...");
    } else {
        // If user clicks 'Cancel', prevent the default behavior (which is following the link)
        event.preventDefault();
    }
});
