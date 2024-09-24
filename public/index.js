function $(element) {
    return document.querySelectorAll(element)
}

let form = document.querySelectorAll("form")[0]
let formData = {
    input1: document.querySelectorAll("input")[0],
    input1Value: document.querySelectorAll("input")[0].value,
    input2: document.querySelectorAll("input")[1],
    input2Value: document.querySelectorAll("input")[1].value,
    input3: document.querySelectorAll("input")[2],
    input3Value: document.querySelectorAll("input")[2].value,
    input4: document.querySelectorAll("textarea")[0],
    input4Value: document.querySelectorAll("textarea")[0].value,
    honey: document.querySelectorAll("input")[3],
    honeyValue: document.querySelectorAll("input")[3].value,
}

formData.input1.addEventListener("input", ()=>{
    formData.input1Value = document.querySelectorAll("input")[0].value
})
formData.input2.addEventListener("input", ()=>{
    formData.input2Value = document.querySelectorAll("input")[1].value
})
formData.input3.addEventListener("input", ()=>{
    formData.input3Value = document.querySelectorAll("input")[2].value
})
formData.input4.addEventListener("input", ()=>{
    formData.input4Value = document.querySelectorAll("textarea")[0].value
})
formData.honey.addEventListener("input", ()=>{
    formData.honeyValue = document.querySelectorAll("input")[3].value
})

form.onsubmit = (e)=>{
    e.preventDefault()
    console.log(formData)
    if (formData.honeyValue == ''){
        fetch(`${window.location.href}`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                client: window.location,
                data: {
                    "Name": formData.input1Value,
                    "Phone Number": formData.input2Value,
                    "Email Address": formData.input3Value,
                    "Message": formData.input4Value,
                }
            })
        })
    }
}

addEventListener('DOMContentLoaded', ()=>{
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