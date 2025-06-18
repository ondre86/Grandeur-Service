gsap.registerPlugin(ScrollTrigger)
function $(element) {
    return document.querySelectorAll(element)
}
function is_touch_enabled() {
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
    )
}

addEventListener("DOMContentLoaded", () => {
    // const lenis = new Lenis()
    // lenis.options.duration = .6
    // function raf(time) {
    //     lenis.raf(time)
    //     requestAnimationFrame(raf)
    // }
    // requestAnimationFrame(raf)

    function scrollInStagger(el) {
        gsap.fromTo(
            el,
            {
                opacity: 0,
                y: 30
            },
            {
                scrollTrigger: el,
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.inOut",
                stagger: 0.15
            }
        )
    }
    function createFlipAnimation(element) {
        let flipped = false
        let staticData = {
            name: element.parentElement.children[0],
            title: element.parentElement.children[1],
            exp: element.parentElement.children[2],
            bio: element.parentElement.children[3],
            btn: element.parentElement.children[4]
        }

        flipTL = gsap.timeline()

        element.addEventListener("click", (e) => {
            if (flipped) {
                flipped = false
                flipTL
                    .to(element.parentElement, {
                        rotateY: "90deg",
                        duration: 0.3
                    })
                    .call(() => {
                        staticData.name.style.display =
                            staticData.title.style.display =
                            staticData.exp.style.display =
                                "inherit"
                        staticData.bio.style.display = "none"
                        staticData.btn.textContent = "Read Bio"
                    })
                    .to([element.parentElement, staticData.btn], {
                        rotateY: "0deg",
                        duration: 0.3
                    })
            } else {
                flipped = true
                flipTL
                    .to(element.parentElement, {
                        rotateY: "90deg",
                        duration: 0.3,
                        ease: "linear"
                    })
                    .call(() => {
                        staticData.name.style.display =
                            staticData.title.style.display =
                            staticData.exp.style.display =
                                "none"
                        staticData.bio.style.display = "inherit"
                        staticData.btn.textContent = "Close Bio"
                    })
                    .to(
                        element.parentElement,
                        {
                            rotateY: "0deg",
                            duration: 0.3
                        },
                        "<"
                    )
            }
        })
    }

    // gsap.to('main', {
    //     opacity: 1,
    //     duration: .5
    // })

    switch (location.pathname) {
        case "/":
            introTL = gsap
                .timeline()
                .from(["#hero h1", ".hero-text", ".hero-btn-wrap"], {
                    opacity: 0,
                    y: 20,
                    stagger: 0.33
                })
                .from(".hero-img-wrap", {
                    opacity: 0,
                    x: 70,
                    duration: 1.3
                })

            scrollInStagger("#why-us .card-wrap .card")
            scrollInStagger("#services .card-wrap .card")
            scrollInStagger("details")

            break

        case "/about":
            for (button of $(".staff-card button")) {
                createFlipAnimation(button)
            }
            scrollInStagger("#staff .card-wrap .card")
            scrollInStagger("#fleet .card-wrap .card")
            break

        case "/contact":
            scrollInStagger("#contact div")

            break

        case "/book":
            scrollInStagger("#book div")

            break
    }

    if ($("form")[0]) {
        let form = $("form")[0]
        let inputs = Array.from(form.elements)

        if ($("#i-pickup-date-time")[0]) {
            let realTime = new Date(
                new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60 * 1000
                )
            )
                .toISOString()
                .slice(0, 16)
            $("#i-pickup-date-time")[0].value = realTime
        }

        if ($("#i-phone-number")[0]) {
            $("#i-phone-number")[0].addEventListener("keyup", function (event) {
                if (
                    event.key != "Backspace" &&
                    ($("#i-phone-number")[0].value.length === 3 ||
                        $("#i-phone-number")[0].value.length === 7)
                ) {
                    $("#i-phone-number")[0].value += "-"
                }
            })
        }

        function resetInputValue() {
            for (input of inputs) {
                input.placeholder = ""
                input.value = ""
            }
        }
        function disableInput() {
            for (input of inputs) {
                input.disabled = true
            }
        }
        function errorBorder() {
            for (input of inputs) {
                input.style.border = "1px solid red"
                input.style.outlineColor = "red"
            }
        }

        form.onsubmit = (e) => {
            e.preventDefault()

            $("#i-submit")[0].style.display = "none"
            $(".loader")[0].style.display = "flex"

            let data = new FormData($("form")[0])

            fetch(`${window.location.href}`, {
                method: "POST",
                body: data
            })
                .then((res) => {
                    return res.json()
                })
                .then((result) => {
                    disableInput()
                    if (result.success) {
                        resetInputValue()
                        $("#i-submit")[0].value = "Thank You!"
                    } else {
                        errorBorder()
                        $("#i-submit")[0].value = "Sorry! Server Error."
                    }
                    $("#i-submit")[0].style.display = "flex"
                    $(".loader")[0].style.display = "none"
                })
        }
    }

    if ($("video")[0]) {
        let clickedOnVideo = false

        function changeVideoCursor(event) {
            if (event.target.paused) {
                event.target.style.cursor =
                    "url('/assets/play.svg') 32 32, pointer"
            } else {
                event.target.style.cursor =
                    "url('/assets/pause.svg') 32 32, pointer"
            }
        }

        if (is_touch_enabled()) {
            // const titleWrap = document.createElement("div")
            // titleWrap.classList.add("flex-v", "gap1", "center")
            // const videoHeader = $("#video h2")[0]
            // const tapNotice = document.createElement("span")
            // tapNotice.innerText = "Tap to play / pause"
            // tapNotice.classList.add("font2", "italic")

            // titleWrap.appendChild(videoHeader)
            // titleWrap.appendChild(tapNotice)
            // $("#video")[0].insertAdjacentElement("afterbegin", titleWrap)

            $("video")[0].style.width = "100%"

            setTimeout(() => {
                const videoHeight = $("video")[0].clientHeight
                $("video")[0].height = videoHeight
            }, 300)
        } else {
            video = gsap
                .timeline({
                    scrollTrigger: {
                        trigger: "#video",
                        start: "top bottom",
                        end: "+=54%",
                        scrub: 0.88
                    }
                })
                .to("video", {
                    width: "100vw"
                })
                .to(
                    "#video",
                    {
                        paddingLeft: 0,
                        paddingRight: 0,
                        width: "100%"
                    },
                    "<"
                )

            $("video")[0].addEventListener("mouseover", (event) => {
                if (event.target.paused) {
                    event.target.style.cursor =
                        "url('/assets/play.svg') 32 32, pointer"
                } else {
                    event.target.style.cursor =
                        "url('/assets/pause.svg') 32 32, pointer"
                }
            })

            $("video")[0].addEventListener("mouseup", (event) => {
                if (event.target.paused && !clickedOnVideo) {
                    event.target.play()
                    clickedOnVideo = true
                }
            })
            $("video")[0].addEventListener("play", (event) => {
                changeVideoCursor(event)
            })
            $("video")[0].addEventListener("pause", (event) => {
                changeVideoCursor(event)
            })
        }
    }

    // NAV
    let nav = $("header nav")[0]
    let dropdown = $(".dropdown")[0]
    let dropdownList = $(".dropdown ul")[0]
    let dropdownTrigger = $("#dropdown")[0]
    let dropdownOpen = false
    let dropdownTL = gsap.timeline()
    dropdownTrigger.addEventListener("click", toggleDropdown)
    nav.addEventListener("keyup", toggleDropdown)
    nav.addEventListener("blur", toggleDropdown)

    function toggleDropdown(event) {
        if (!event) return
        if (event.type == "keyup" && event.key == " ") {
            event.preventDefault()
        }
        if (event.type == "keyup" && event.key !== "Tab") {
            return
        }

        if (!dropdownOpen) {
            if (event.target !== dropdownTrigger) return
            dropdownOpen = true
            dropdown.style.display = "flex"
            dropdownTL.fromTo(
                ".dropdown",
                {
                    y: -20
                },
                {
                    autoAlpha: 1,
                    y: 0
                }
            )
            setTimeout(() => {
                window.addEventListener("click", handleOutsideClick)
            }, 0)
        } else {
            if (
                event.type !== "click" &&
                (event.target.parentElement.parentElement.parentElement ==
                    dropdown ||
                    event.target == dropdownTrigger)
            ) {
                return
            }

            dropdownTL.to(".dropdown", {
                autoAlpha: 0,
                y: -20
            })
            dropdownTL.call(() => {
                dropdownOpen = false
            })
        }
    }

    function handleOutsideClick(event) {
        console.log(event.target)
        if (event.target !== dropdownList || event.target !== dropdownTrigger) {
            console.log(event.target == dropdownList)
            toggleDropdown(event)
            window.removeEventListener("click", handleOutsideClick)
        }
    }

    // MOBILE MENU
    let mobileMenu = {
        menu: $(".mm-holster")[0],
        button: $(".mobile-menu")[0],
        hamburgerTop: $(".hamburger-inner")[0],
        hamburgerMiddle: $(".hamburger-inner")[1],
        hamburgerBottom: $(".hamburger-inner")[2]
    }
    let mobileMenuTL = gsap.timeline()
    let mobileMenuToggled = false

    function openMobileMenu() {
        mobileMenuToggled = true
        mobileMenuTL
            .to(mobileMenu.hamburgerTop, {
                y: 7,
                duration: 0.15
            })
            .to(
                mobileMenu.hamburgerBottom,
                {
                    y: -7,
                    duration: 0.15
                },
                "<<"
            )
            .to(
                mobileMenu.menu,
                {
                    display: "flex",
                    transform: "translate(0px, 70px)",
                    ease: "power2.out",
                    duration: 0.75
                },
                "<"
            )
            .to(
                [mobileMenu.hamburgerBottom, mobileMenu.hamburgerTop],
                {
                    rotate: 45,
                    duration: 0.15
                },
                "-=.5"
            )
            .to(
                [mobileMenu.hamburgerMiddle],
                {
                    rotate: -45,
                    duration: 0.15
                },
                "<"
            )
    }
    function closeMobileMenu() {
        mobileMenuToggled = false
        mobileMenuTL
            .to([mobileMenu.hamburgerBottom, mobileMenu.hamburgerTop], {
                rotate: 0,
                duration: 0.15
            })
            .to(
                [mobileMenu.hamburgerMiddle],
                {
                    rotate: 0,
                    duration: 0.15
                },
                "<<"
            )
            .to(
                mobileMenu.menu,
                {
                    display: "none",
                    transform: "translate(0px, -100vh)",
                    ease: "power1.in",
                    duration: 0.5
                },
                "<"
            )
            .to(
                mobileMenu.hamburgerTop,
                {
                    y: 0,
                    duration: 0.15
                },
                "-=.25"
            )
            .to(
                mobileMenu.hamburgerBottom,
                {
                    y: 0,
                    duration: 0.15
                },
                "<"
            )
    }

    mobileMenu.button.addEventListener("click", (e) => {
        if (mobileMenuToggled == false) {
            openMobileMenu()
        } else {
            closeMobileMenu()
        }
    })

    addEventListener("resize", (e) => {
        if (window.innerWidth > 1024 && mobileMenuToggled) {
            closeMobileMenu()
        }
    })

    // DIALOG
    // if (window.location.pathname == '/'){
    //     let dialogElement = {
    //         dialog: $('dialog')[0],
    //         close: $('dialog .close')[0],
    //         cta: $('dialog .cta')[0],
    //     }

    //     dialogTL = gsap.timeline()
    //     setTimeout(() => {
    //         dialogTL.to(dialogElement.dialog, {
    //             opacity: 1
    //         })
    //         dialogElement.dialog.show()
    //         dialogElement.dialog.style.display = 'flex'
    //         $('body')[0].style.overflow = 'hidden'
    //     }, 2000)

    //     dialogElement.close.addEventListener('click', (event)=>{
    //         dialogTL.to(dialogElement.dialog, {
    //             opacity: 0,
    //         })
    //         dialogTL.to(dialogElement.dialog, {
    //             zIndex: -1,
    //         })
    //         dialogTL.call(()=>{
    //             dialogElement.dialog.style.display = 'none'
    //             $('body')[0].style.overflow = 'auto'
    //         })
    //     })
    // }
})
