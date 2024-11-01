gsap.registerPlugin(ScrollTrigger)

function $(element) {
    return document.querySelectorAll(element)
}

function is_touch_enabled() {
    return ( 'ontouchstart' in window ) || 
           ( navigator.maxTouchPoints > 0 ) || 
           ( navigator.msMaxTouchPoints > 0 );
}

addEventListener('DOMContentLoaded', ()=>{
    const lenis = new Lenis()
    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.options.duration = .6
    console.log(lenis)

    function scrollInStagger(el){
        gsap.fromTo(el, {
            opacity: 0,
            y: 30
        }, {
            scrollTrigger: el,
            opacity: 1,
            y: 0,
            duration: .5,
            ease: "power2.inOut",
            stagger: .1
        })
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

        flipTL = gsap.timeline()

        element.addEventListener("click", (e)=>{
            if (flipped) {
                flipped = false
                flipTL.to(element.parentElement, {
                    rotateY: "90deg",
                    duration: .3
                })
                .call(()=>{
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
                flipTL.to(element.parentElement, {
                    rotateY: "90deg",
                    duration: .3,
                    ease: "linear"
                })
                .call(()=>{
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

    gsap.to("main", {
        opacity: 1,
        duration: .5
    })

    switch (location.pathname) {
        case '/':
            introTL = gsap.timeline()
            .from(["#hero h1", ".hero-text", ".hero-btn-wrap"], {
                opacity: 0,
                y: 20,
                stagger: .33,
            })
            .from(".hero-img-wrap", {
                opacity: 0,
                x: 100,
                duration: 1
            })

            scrollInStagger('#why-us .card-wrap .card')
            scrollInStagger('#use-case .card-wrap .card')
            scrollInStagger('details')
            scrollInStagger('#contact div')

            break

        case '/about/':
            for (button of $(".staff-card button")){
                createFlipAnimation(button)
            }
            scrollInStagger('#staff .card-wrap .card')
            scrollInStagger('#fleet .card-wrap .card')
            break

        case '/contact/':
            scrollInStagger('#contact div')
            
            break
    }

    if ($("form")[0]){
        let form = $("form")[0]
        let formData = {
            name: $("input")[0],
            phone: $("input")[1],
            email: $("input")[2],
            msg: $("textarea")[0],
            honey: $("input")[3],
            submit: $("#i-submit")[0]
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
    
    if ($("video")[0]){  
        function playVideo(event) {
            if (event.target.paused) {
                event.target.play()
                event.target.style.cursor = "url('/assets/pause.svg') 32 32, pointer"
            }
            else {
                event.target.pause()
                event.target.style.cursor = "url('/assets/play.svg') 32 32, pointer"
            }
        }

        if (is_touch_enabled()){
            const titleWrap = document.createElement("div")
            titleWrap.classList.add("flex-v", "gap1","center")
            const videoHeader = $("#video h2")[0]
            const tapNotice = document.createElement("span")
            tapNotice.innerText = "Tap to play / pause"
            tapNotice.classList.add("font2", "italic")

            titleWrap.appendChild(videoHeader)
            titleWrap.appendChild(tapNotice)
            $('#video')[0].insertAdjacentElement('afterbegin', titleWrap)

            $("video")[0].addEventListener('touchstart', (event)=>{
                playVideo(event)
            })
        }
        else {
            video = gsap.timeline({
                scrollTrigger: {
                    trigger: '#video',
                    start: "top+=50% bottom",
                    end: '+=50%',
                    scrub: 1
                },
            })
            .to('video', {
                opacity: 1,
                width: "100vw",
                maxWidth: "none",
            })
            .to('#video', {
                paddingLeft: 0,
                paddingRight: 0
            }, "<")

            $("video")[0].addEventListener('mouseover', (event)=>{
                if (event.target.paused) {
                    event.target.style.cursor = "url('/assets/play.svg') 32 32, pointer"  
                }
                else {
                    event.target.style.cursor = "url('/assets/pause.svg') 32 32, pointer"
                }
            })
    
            $("video")[0].addEventListener('mouseup', (event)=>{
                playVideo(event)
            })

            $("video")[0].addEventListener('keydown', (event)=>{
                if (event.key === 'Enter' || event.key === ' '){
                    event.preventDefault()
                    playVideo(event)
                }
            })
        }
    }


    // MOBILE MENU
    let mobileMenu = {
        menu: $(".mm-holster")[0],
        button: $(".mobile-menu")[0],
        hamburgerTop: $(".hamburger-inner")[0],
        hamburgerMiddle: $(".hamburger-inner")[1],
        hamburgerBottom: $(".hamburger-inner")[2],
    }
    let mobileMenuTL = gsap.timeline();
    let mobileMenuToggled = false;

    function openMobileMenu(){
        mobileMenuToggled = true;
        mobileMenuTL.to(mobileMenu.hamburgerTop,{
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
        mobileMenuTL.to([mobileMenu.hamburgerBottom, mobileMenu.hamburgerTop], {
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