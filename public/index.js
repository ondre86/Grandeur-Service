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
    // const lenis = new Lenis()
    // lenis.options.duration = .6
    // function raf(time) {
    //     lenis.raf(time)
    //     requestAnimationFrame(raf)
    // }
    // requestAnimationFrame(raf)

    function scrollInStagger(el){
        gsap.fromTo(el, {
            opacity: 0,
            y: 30
        }, {
            scrollTrigger: el,
            opacity: 1,
            y: 0,
            duration: .5,
            ease: 'power2.inOut',
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

        element.addEventListener('click', (e)=>{
            if (flipped) {
                flipped = false
                flipTL.to(element.parentElement, {
                    rotateY: '90deg',
                    duration: .3
                })
                .call(()=>{
                    staticData.name.style.display = staticData.title.style.display = staticData.exp.style.display = 'inherit'
                    staticData.bio.style.display = 'none'
                    staticData.btn.textContent = 'Read Bio'
                })
                .to([element.parentElement, staticData.btn], {
                    rotateY: '0deg',
                    duration: .3
                })
            }
            else {
                flipped = true
                flipTL.to(element.parentElement, {
                    rotateY: '90deg',
                    duration: .3,
                    ease: 'linear'
                })
                .call(()=>{
                    staticData.name.style.display = staticData.title.style.display = staticData.exp.style.display = 'none'
                    staticData.bio.style.display = 'inherit'
                    staticData.btn.textContent = 'Close Bio'
                })
                .to(element.parentElement, {
                    rotateY: '0deg',
                    duration: .3
                }, '<')
            }
        })
    }

    // gsap.to('main', {
    //     opacity: 1,
    //     duration: .5
    // })

    switch (location.pathname) {
        case '/':
            introTL = gsap.timeline()
            .from(['#hero h1', '.hero-text', '.hero-btn-wrap'], {
                opacity: 0,
                y: 20,
                stagger: .33,
            })
            .from('.hero-img-wrap', {
                opacity: 0,
                x: 100,
                duration: 1
            })

            scrollInStagger('#why-us .card-wrap .card')
            scrollInStagger('#use-case .card-wrap .card')
            scrollInStagger('details')
            scrollInStagger('form div')

            break

        case '/about/':
            // for (button of $('.staff-card button')){
            //     createFlipAnimation(button)
            // }
            scrollInStagger('#staff .card-wrap .card')
            scrollInStagger('#fleet .card-wrap .card')
            break

        case '/contact/':
            scrollInStagger('#contact div')
            
            break

        case '/book/':
            scrollInStagger('#book div')
            
            break
    }

    if ($('form')[0]){
        let form = $('form')[0]
        let inputs = Array.from(form.elements)

        if ($('#i-pickup-date-time')[0]){
            let realTime = new Date((new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000))).toISOString().slice(0,16)
            $('#i-pickup-date-time')[0].value = realTime
        }

        if ($('#i-phone-number')[0]){
            $('#i-phone-number')[0].addEventListener('keyup', function(event){
                if (event.key != 'Backspace' && ($('#i-phone-number')[0].value.length === 3 || $('#i-phone-number')[0].value.length === 7)){
                    $('#i-phone-number')[0].value += '-'
                }
        })}

        function resetInputValue(){
            for (input of inputs){
                input.placeholder = ''
                input.value = ''
            }
        }
        function disableInput(){
            for (input of inputs){
                input.disabled = true
            }
        }
        function errorBorder(){
            for (input of inputs){
                input.style.border = '1px solid red'
                input.style.outlineColor = 'red'
            }
        }
        
        form.onsubmit = (e)=>{
            e.preventDefault()

            $("#i-submit")[0].style.display = "none"
            $(".loader")[0].style.display = "flex"

            let data = new FormData($("form")[0])

            fetch(`${window.location.href}`, {
                method: 'POST',
                body: data
            })
            .then((res)=>{ return res.json() })
            .then(result => {
                disableInput()
                if (result.success){
                    resetInputValue()
                    $('#i-submit')[0].value =  'Thank You!'
                }
                else {
                    errorBorder()
                    $('#i-submit')[0].value =  'Sorry! Server Error.'
                }
                $("#i-submit")[0].style.display = "flex"
                $(".loader")[0].style.display = "none"
            })
        }
    }
    
    if ($('video')[0]){  
        let clickedOnVideo = false

        function changeVideoCursor(event) {
            if (event.target.paused) {
                event.target.style.cursor = "url('/assets/play.svg') 32 32, pointer"
            }
            else {
                event.target.style.cursor = "url('/assets/pause.svg') 32 32, pointer"
            }
        }

        if (is_touch_enabled()){
            const titleWrap = document.createElement('div')
            titleWrap.classList.add('flex-v', 'gap1','center')
            const videoHeader = $('#video h2')[0]
            const tapNotice = document.createElement('span')
            tapNotice.innerText = 'Tap to play / pause'
            tapNotice.classList.add('font2', 'italic')

            titleWrap.appendChild(videoHeader)
            titleWrap.appendChild(tapNotice)
            $('#video')[0].insertAdjacentElement('afterbegin', titleWrap)

            $('video')[0].style.width = '100%'

            setTimeout(() => {
                const videoHeight = $('video')[0].clientHeight
                $('video')[0].height = videoHeight
                console.log($('video')[0].height)
            }, 300)
        }
        else {
            video = gsap.timeline({
                scrollTrigger: {
                    trigger: '#video',
                    start: 'top+=25% bottom',
                    end: '+=40%',
                    scrub: 1
                },
            })
            .to('video', {
                width: '100vw',
            })
            .to('#video', {
                paddingLeft: 0,
                paddingRight: 0,
                width: '100%'
            }, '<')

            $('video')[0].addEventListener('mouseover', (event)=>{
                if (event.target.paused) {
                    event.target.style.cursor = "url('/assets/play.svg') 32 32, pointer" 
                }
                else {
                    event.target.style.cursor = "url('/assets/pause.svg') 32 32, pointer"
                }
            })
    
            $('video')[0].addEventListener('mouseup', (event)=>{
                if (event.target.paused && !clickedOnVideo) {
                    event.target.play()
                    clickedOnVideo = true
                }
            })
            $('video')[0].addEventListener('play', (event)=>{
                changeVideoCursor(event)
            })
            $('video')[0].addEventListener('pause', (event)=>{
                changeVideoCursor(event)
            })
        }
    }


    // MOBILE MENU
    let mobileMenu = {
        menu: $('.mm-holster')[0],
        button: $('.mobile-menu')[0],
        hamburgerTop: $('.hamburger-inner')[0],
        hamburgerMiddle: $('.hamburger-inner')[1],
        hamburgerBottom: $('.hamburger-inner')[2],
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
        }, '<<')
        .to(mobileMenu.menu,{
            display: 'flex',  
            transform: 'translate(0px, 70px)',
            ease: 'power2.out',
            duration: .75
        }, '<')
        .to([mobileMenu.hamburgerBottom, mobileMenu.hamburgerTop], {
            rotate:45,
            duration: .15
        }, '-=.5')
        .to([mobileMenu.hamburgerMiddle], {
            rotate:-45,
            duration: .15
        }, '<')
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
        }, '<<')
        .to(mobileMenu.menu,{
            display: 'none',
            transform: 'translate(0px, -100vh)',
            ease: 'power1.in',
            duration: .5
        }, '<')
        .to(mobileMenu.hamburgerTop,{
            y: 0,
            duration: .15
        }, '-=.25')
        .to(mobileMenu.hamburgerBottom,{
            y: 0,
            duration: .15
        }, '<')
    }

    mobileMenu.button.addEventListener('click', (e)=>{
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

    // DIALOG
    if (window.location.pathname == '/'){
        let dialogElement = {
            dialog: $('dialog')[0],
            close: $('dialog .close')[0],
            cta: $('dialog .cta')[0],
        }
    
        dialogTL = gsap.timeline()
        setTimeout(() => {
            dialogTL.to(dialogElement.dialog, {
                opacity: 1
            })
            dialogElement.dialog.show()
            dialogElement.dialog.style.display = 'flex'
            $('body')[0].style.overflow = 'hidden'
        }, 2000)

        dialogElement.close.addEventListener('click', (event)=>{
            dialogTL.to(dialogElement.dialog, {
                opacity: 0,
            })
            dialogTL.to(dialogElement.dialog, {
                zIndex: -1,
            })
            dialogElement.dialogElement.close()
            dialogElement.dialog.style.display = 'none'
            $('body')[0].style.overflow = 'auto'
        })
    }
})