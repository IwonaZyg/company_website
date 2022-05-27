document.addEventListener("DOMContentLoaded", function(){

    const navi = document.querySelector(".navbar")
    const links = document.querySelectorAll(".nav-link")
    const navList = document.querySelector(".navbar-collapse")
    
    function addShadow(){
        if (window.scrollY >= 50 ) {
            navi.classList.add("shadow-bg")
        } else {
            navi.classList.remove("shadow-bg")
        }

    }
    

    function removeNav(){
        navList.classList.remove("show")
    }

   

    window.addEventListener("scroll",addShadow)
    document.addEventListener("click", removeNav)


})





