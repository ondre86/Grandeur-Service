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

    function resetInputValue(){
        formData.name.value = formData.phone.value = formData.email.value = formData.msg.value = ''
        formData.name.placeholder = formData.email.placeholder = formData.phone.placeholder = formData.msg.placeholder = formData.submit.placeholder = ''
    }
    function disableInput(){
        formData.name.disabled = formData.email.disabled = formData.phone.disabled = formData.msg.disabled = formData.submit.disabled = true
    }
    function errorBorder(){
        formData.name.style.border = formData.email.style.border = formData.phone.style.border = formData.msg.style.border = formData.submit.style.border = "1px solid red"
        formData.submit.style.outlineColor = "red"
    }
    
    form.onsubmit = (e)=>{
        e.preventDefault()
        disableInput()

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
                resetInputValue()
                if (result.success){
                    formData.submit.value = "Thank you!"
                }
                else {
                    errorBorder()
                    formData.submit.value = 'Sorry! Server Error.'
                }
            })
        }
    }
}

addEventListener('DOMContentLoaded', ()=>{
    for (button of $(".staff-card button")){
        createFlipAnimation(button)
    }
    function createFlipAnimation(element){
        let flipped = false
        let staticData = {
            name: element.parentElement.children[0],
            title: element.parentElement.children[1],
            exp: element.parentElement.children[2],
            bio: element.parentElement.children[3],
            btn: element.parentElement.children[4],
        }
        console.log(staticData)


        flip = gsap.timeline()

        element.addEventListener("click", (e)=>{

            if (flipped) {
                flipped = false
                flip.to(element.parentElement, {
                    rotateY: "90deg",
                    duration: .3
                })
                .call(()=>{
                    console.log(staticData.bio)
                    staticData.name.style.display = staticData.title.style.display = staticData.exp.style.display = "inherit"
                    staticData.bio.style.display = "none"
                    staticData.btn.textContent = "Read Bio"
                })
                .to([element.parentElement, staticData.btn], {
                    rotateY: "0deg",
                    duration: .3
                })
            }
            else {
                flipped = true
                flip.to(element.parentElement, {
                    rotateY: "90deg",
                    duration: .3,
                    ease: "linear"
                })
                .call(()=>{
                    console.log(staticData.bio)
                    staticData.name.style.display = staticData.title.style.display = staticData.exp.style.display = "none"
                    staticData.bio.style.display = "inherit"
                    staticData.btn.textContent = "Close Bio"
                })
                .to(element.parentElement, {
                    rotateY: "0deg",
                    duration: .3
                }, "<")
            }

        })
    }


    // MOBILE MENU
    let mobileMenu = {
        menu: $(".mm-holster")[0],
        button: $(".mobile-menu")[0],
        hamburgerTop: $(".hamburger-inner")[0],
        hamburgerMiddle: $(".hamburger-inner")[1],
        hamburgerBottom: $(".hamburger-inner")[2],
    }
    let tl = gsap.timeline();
    let mobileMenuToggled = false;

    function openMobileMenu(){
        mobileMenuToggled = true;
        tl.to(mobileMenu.hamburgerTop,{
            y: 7,
            duration: .15
        })
        .to(mobileMenu.hamburgerBottom,{
            y: -7,
            duration: .15
        }, "<<")
        .to(mobileMenu.menu,{
            display: "flex",  
            transform: "translate(0px, 70px)",
            ease: "power2.out",
            duration: .75
        }, "<")
        .to([mobileMenu.hamburgerBottom, mobileMenu.hamburgerTop], {
            rotate:45,
            duration: .15
        }, "-=.5")
        .to([mobileMenu.hamburgerMiddle], {
            rotate:-45,
            duration: .15
        }, "<")
    }
    function closeMobileMenu(){
        mobileMenuToggled = false;
        tl.to([mobileMenu.hamburgerBottom, mobileMenu.hamburgerTop], {
            rotate: 0,
            duration: .15
        })
        .to([mobileMenu.hamburgerMiddle], {
            rotate: 0,
            duration: .15
        }, "<<")
        .to(mobileMenu.menu,{
            display: "none",
            transform: "translate(0px, -100vh)",
            ease: "power1.in",
            duration: .5
        }, "<")
        .to(mobileMenu.hamburgerTop,{
            y: 0,
            duration: .15
        }, "-=.25")
        .to(mobileMenu.hamburgerBottom,{
            y: 0,
            duration: .15
        }, "<")
    }

    mobileMenu.button.addEventListener("click", (e)=>{
        if(mobileMenuToggled == false){
            openMobileMenu()
        }
        else{
            closeMobileMenu()
        }
    })

    addEventListener('resize', (e)=>{
        if(window.innerWidth > 1024 && mobileMenuToggled){
            closeMobileMenu()
        }
    })
})