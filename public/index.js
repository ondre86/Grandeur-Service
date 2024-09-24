function $(element) {
    return document.querySelectorAll(element)
}

if (document.querySelectorAll("form")[0]){
    let form = document.querySelectorAll("form")[0]
    let formData = {
        name: document.querySelectorAll("input")[0],
        phone: document.querySelectorAll("input")[1],
        email: document.querySelectorAll("input")[2],
        msg: document.querySelectorAll("textarea")[0],
        honey: document.querySelectorAll("input")[3],
        submit: document.querySelectorAll("#i-submit")[0]
    }

    function refreshInputOnType(){
        formData.name.style.borderColor = "rgba(85,85,85,1)"
        formData.submit.value = "Submit"
    }
    function resetInputValueAfterSubmit(){
        formData.name.value = formData.phone.value = formData.email.value = formData.msg.value = ''
    }
    function errorBorder(){
        formData.input1.style.borderColor = formData.input2.style.borderColor = formData.input3.style.borderColor = formData.input4.style.borderColor = "red"
    }
    
    formData.name.addEventListener("input", refreshInputOnType)
    formData.phone.addEventListener("input", refreshInputOnType)
    formData.email.addEventListener("input", refreshInputOnType)
    formData.msg.addEventListener("input", refreshInputOnType)
    
    form.onsubmit = (e)=>{
        e.preventDefault()

        if (formData.honey.value == ''){
            fetch(`${window.location.href}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        "Name": formData.name.value,
                        "Phone Number": formData.phone.value,
                        "Email Address": formData.email.value,
                        "Message": formData.msg.value,
                    }
                })
            })
            .then((res)=>{ return res.json() })
            .then(result => {
                resetInputValueAfterSubmit()
                if (result.success){
                    formData.submit.value = "Thank you!"
                }
                else {
                    errorBorder()
                    formData.submit.value = 'Sorry, there was an error.'
                }
            })
        }
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