// LOGIN CONFIG
async function getUser(x, y) {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            setTimeout(() => {
                window.location.replace("login_profile.html")
            }, 500)
        } else {
            setTimeout(function() {
                $(".loading").addClass("hidden");
                $("body").addClass("fadeIn");
            })
            switch (x) {
                case 'readTasks':
                    readTasks(y, user.uid)
                    break
                case 'readReminders':
                    readReminders(y, user.uid)
                    break
                case 'readNotes':
                    readNotes(y, user.uid)
                    break
                case 'editNote':
                    infoNote(user.uid)
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


// upload_IMG - [ja fiz o getname da img]





