//Login and register for front page

//Elements
//variables from index.html
const $selectLoginButton = document.getElementById('login')
const $selectSignUpButton = document.getElementById('signup')
const $popup = document.getElementById('popup')
const $loginBox = document.getElementById('loginBox')
const $signUpBox = document.getElementById('signUpBox')
const $closeLoginBtn = document.getElementById('closeLoginBtn')
const $closeSubmitBtn = document.getElementById('closeSubmitBtn')



//listen for login button to be pushed so form can be displayed
$selectLoginButton.addEventListener('click', () => {
    $popup.style.setProperty('display', 'flex')
    $loginBox.style.setProperty('display', 'flex')
    
    //set session storage
    sessionStorage.setItem('popup', 'login')
})

//listen for sign up button to be pushed so signup form can be displayed
$selectSignUpButton.addEventListener('click', () => {
    $popup.style.setProperty('display', 'flex')
    $signUpBox.style.setProperty('display', 'flex')

    //set session storage
    sessionStorage.setItem('popup', 'register')
})

//close login popup
$closeLoginBtn.addEventListener('click', () => {
    $popup.style.setProperty('display', 'none')
    $loginBox.style.setProperty('display', 'none')

    //clear storage so popup won't appear on refresh
    sessionStorage.clear()
})

//close register popup
$closeSubmitBtn.addEventListener('click', () => {
    $popup.style.setProperty('display', 'none')
    $signUpBox.style.setProperty('display', 'none')

    //clear storage so popup won't appear on refresh
    sessionStorage.clear()
})

//check if Registration popup  or Login popup needs to be open on page reload
const checkRegistration = () => {
    if(sessionStorage.length > 0) {
        if(sessionStorage.getItem('popup') === 'register') {
            $popup.style.setProperty('display', 'flex')
            $signUpBox.style.setProperty('display', 'flex')
        } else {
            $popup.style.setProperty('display', 'flex')
            $loginBox.style.setProperty('display', 'flex')
        }
        
    } else {
        console.log('off')
        $popup.style.setProperty('display', 'none')
        $signUpBox.style.setProperty('display', 'none')
    }
}
