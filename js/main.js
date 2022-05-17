// LOGIN CONFIG
async function getUser(x, y) {
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
            setTimeout(function() {
                $("body").addClass("fadeIn")
            });
            setTimeout(function() {
                $(".loading").addClass("hidden")
            });
            console.log(y)
            switch (x) {
                case 'readTasks':
                    readTasks(y, user.uid)
                    break
                case 'readReminders':
                    readReminders(y, user.uid)
                    break
                case '3':
                    notes(y, user.uid)
                    break
                default:
                    return false;
            }
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





