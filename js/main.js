// LOGIN CONFIG
async function getUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            swal.fire({
            icon: "error",
            title: "Conexão Expirada",
            })
            .then(() => {
            setTimeout(() => {
                window.location.replace("login_profile.html")
            }, 500)
            })
        } else {
            currentUser.uid = user.uid
            setTimeout(function() {
                $("body").addClass("fadeIn")
            });
            setTimeout(function() {
                $(".loading").addClass("hidden")
            });
        }
    })
}

// NAV CONIFG
function ToggleNav(toggle){
    toggle.classList.toggle("bigIn")
    toggle.classList.toggle("bigOut")
}

nav = document.querySelector('#nav_id')
nav_content = document.querySelector('#content_nav')
nav.addEventListener('click', function(){ToggleNav(nav_content)})





