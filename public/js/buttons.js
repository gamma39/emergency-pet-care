const $logoutButton = document.getElementById('logout-btn')
const $dashboardButton = document.getElementById('dashboard-btn')

//give logout button functionality by fetching logout route on click
$logoutButton.addEventListener('click', () => {
    fetch('/users/logout', {
        method: 'post',
        redirect: 'follow'
    }).then((response) => {
        //if logout doesnt work show an error
        if(!response.ok) {
            alert('HTTP-Error: ' + response.status)
        //if logout works make sure welcome page loads for user
        } else {
            window.location.href = response.url
            
        }
    })
})

//fetch dashboard route
$dashboardButton.addEventListener('click', () => {
    fetch('/dashboard').then((response) => {
        //check response status
        if(!response.ok) {
            //give error alert if anything goes wrong
            alert('HTTP Error: ' + response.status)
        } else {
            //display page
            window.location.href = response.url
        }
    })
})