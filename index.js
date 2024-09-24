function $(element) {
    return document.querySelectorAll(element)
}

addEventListener('DOMContentLoaded', ()=>{
    intro = gsap.timeline()
    let main = location.pathname.includes("about") || location.pathname.includes("contact") ? "main" : ".hero-content-wrap"

    intro.from(main, {
        y: 50,
        opacity: 0,
        duration: .75,
        ease: "power1.inOut"
    })

    // MOBILE MENU
    let mobileMenu = {
        menu: $(".mm-holster")[0],
        button: $(".mobile-menu")[0],
        hamburgerTop: $(".hamburger-inner")[0],
        hamburgerMiddle: $(".hamburger-inner")[1],
        hamburgerBottom: $(".hamburger-inner")[2],
    }
    let mmTL = gsap.timeline();
    let mobileMenuToggled = false;

    function mmOpen(){
        mobileMenuToggled = true;
        mmTL.to(mobileMenu.hamburgerTop,{
            y: 7,
            duration: .15
        })
        mmTL.to(mobileMenu.hamburgerBottom,{
            y: -7,
            duration: .15
        }, "<<")
        mmTL.to(mobileMenu.menu,{
            display: "flex",  
            transform: "translate(0px, 70px)",
            ease: "power2.out",
            duration: .75
        }, "<")
        mmTL.to([mobileMenu.hamburgerBottom, mobileMenu.hamburgerTop], {
            rotate:45,
            duration: .15
        }, "-=.5")
        mmTL.to([mobileMenu.hamburgerMiddle], {
            rotate:-45,
            duration: .15
        }, "<")
    }
    function mmClose(){
        mobileMenuToggled = false;
        mmTL.to([mobileMenu.hamburgerBottom, mobileMenu.hamburgerTop], {
            rotate: 0,
            duration: .15
        })
        mmTL.to([mobileMenu.hamburgerMiddle], {
            rotate: 0,
            duration: .15
        }, "<<")
        mmTL.to(mobileMenu.menu,{
            display: "none",
            transform: "translate(0px, -100vh)",
            ease: "power1.in",
            duration: .5
        }, "<")
        mmTL.to(mobileMenu.hamburgerTop,{
            y: 0,
            duration: .15
        }, "-=.25")
        mmTL.to(mobileMenu.hamburgerBottom,{
            y: 0,
            duration: .15
        }, "<")
    }

    mobileMenu.button.addEventListener("click", (e)=>{
        if(mobileMenuToggled == false){
            mmOpen()
        }
        else{
            mmClose()
        }
    })

    addEventListener('resize', (e)=>{
        if(window.innerWidth > 1024){
            if(mobileMenuToggled == false){}
            else{
                mmClose()
            }
        }
    })

})