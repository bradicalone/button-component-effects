

function gradientEffect() {
    document.querySelector('.c-gradient-btn').addEventListener("mouseenter", function (event) {
        this.className += ' animate-gradient'
    })
    document.querySelector('.c-gradient-btn').addEventListener("mouseleave", function (event) {
        this.classList.remove('animate-gradient')
    })
}

function letterSpin() {
    const btn = document.querySelector('.c-letter-btn')
    const btnFontSize = window.getComputedStyle(btn).fontSize

    btn.style.textShadow = '0 -' + btnFontSize
    btn.innerHTML = '<div><span>' + btn.textContent.split('').join('</span><span>') + '</span></div>'

    // Filters out any empty elements, ( spaces between words )
    const letters = Array.from(btn.querySelectorAll('div > span')).filter(letter => /\w/.test(letter.textContent))
    let i = letters.length

    while (i--) {
        letters[i].style.display = 'inline-block'
        letters[i].style.transitionDelay = i * .08 + 's'
    }
    btn.querySelector('div').style.lineHeight = btnFontSize
}


function wordSpin() {
    const btn = document.querySelector('.c-word-rotate')
    let start, reqID, startDist = 0, dist = 360, deg = 0;

    function animate(timestamp) {
        if(!start) start = timestamp
        const progress = Math.min((timestamp - start) / 3000, 1)
        deg = startDist + (progress * dist)

        btn.style.transform = `rotateX(${deg}deg)`
        if(progress == 1) start = 0 
        
        reqID = requestAnimationFrame(animate) 
    }

    btn.onmouseenter = (e) =>  reqID = requestAnimationFrame(animate)
    btn.onmouseleave = (e) => {
        cancelAnimationFrame(reqID)
        startDist = deg
        start = 0
    }
}


function rippleClick(e) {
    const btn = e.target
    const rippleBTN = btn.children[0]

    if (typeof rippleBTN === 'undefined') return

    const { x, y } = btn.getBoundingClientRect();

    Object.assign(rippleBTN.style, {
        transition: 'transform .6s ease-in',
        left: e.clientX - x + 'px',
        top: e.clientY - y + 'px',
        transform: 'scale(50)'
    })
    rippleBTN.addEventListener('transitionend', function () {
        this.removeAttribute('style')
    })

}
Array.from(document.getElementsByClassName('ripple-click-btn')).forEach(btn =>
    btn.onclick = e => rippleClick(e)
)


function rippleHover() {
    const btn = Array.from(document.getElementsByClassName('ripple-hover-btn'))
    const send = function (e) {
        const { x, y } = e.target.getBoundingClientRect()
        Object.assign(e.target.querySelector('.ripple-hover-effect').style, {
            left: e.clientX - x + 'px',
            top: e.clientY - y + 'px',
            transform: 'scale(60)'
        })
    }
    btn.forEach(button => {
        button.onmouseover = function (e) {
            send(e)
        }
        button.onmouseleave = function (e) {
            e.target.querySelector('.ripple-hover-effect').style.transform = 'scale(0)'
        }
    })
}

function splatter() {
    const svg = document.getElementsByClassName('splash')[0]
    const g = document.getElementsByClassName('circles')[0]
    const circles = g.getElementsByTagName('circle')

    const halfWidth = /[1-9]\d*/.exec(svg.getAttribute("viewBox"))[0] / 2

    const random = (min, max) => Math.random() * (max - min) + min;
    const dropLets = []

    const createDrops = (cx, cy) => {
        const distY = random(25, 100)
        const distX = cx > halfWidth ? random(2, 100) : random(-2, -100)

        const drops = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        drops.setAttribute("r", random(5, 17));
        drops.setAttribute("cx", cx);
        drops.setAttribute("cy", cy);
        drops.setAttribute("fill", "#ee786e");
        drops.setAttribute("fill-opacity", 1);
        dropLets.push({ drop: drops, distX, distY, startX: cx, startY: cy })
        g.insertBefore(drops, g.firstChild)
    };

    const time = {
        start: 0,
        total: 2500
    };

    const rubberBand = (startY, distance, progress) => (startY - (distance * Math.sin(progress * Math.PI).toFixed(4)))

    const run = timestamp => {
        let i = dropLets.length
        if (!time.start) time.start = timestamp
        const progress = Math.min((timestamp - time.start) / time.total, 1)
        const opacity = progress * 3.33;

        while (i--) {
            dropLets[i].drop.setAttribute("cx", dropLets[i].startX - progress * dropLets[i].distX);
            dropLets[i].drop.setAttribute("cy", rubberBand(dropLets[i].startY, dropLets[i].distY, progress));
            dropLets[i].drop.setAttribute("fill-opacity", progress < .667 ? 1 : 3.5 - opacity) // 3.5 - opacity so you keep opacity almost 0
            if (progress === 1) {
                g.removeChild(dropLets[i].drop)
                // All circles removed animation stops
                if (!i) return
            }
        }
        requestAnimationFrame(run)
    }

    const animate = e => {
        const { x, y } = svg.getBoundingClientRect()

        // Stops animation from being ran while in motion
        if (circles.length) return

        // Resets
        dropLets.length = 0
        time.start = 0
        let count = 6

        // Start locations
        let cx = e.clientX - x
        let cy = e.clientY - y
        while (count--) createDrops(cx, cy)
        requestAnimationFrame(run)
    }

    svg.onclick = e => {
        animate(e)
    }
}

// RADIO CHECKBOX MERGE

function radioCheckBox() {
    const radioElem = Array.from(document.getElementsByClassName('svg-radio'))

    radioElem.forEach(el => {
        el.onclick = e => {
            animateCircles(e)
        }
    })

    function animateCircles(e) {
        const isChecked = e.target.checked
        const parent = e.target.parentNode
        // top-circles
        const firstCirc = parent.querySelector('.main-circ')
        const secondCirc = parent.querySelector('.second-circ')
        const thirdCirc = parent.querySelector('.third-circ')
        if (isChecked) {
            firstCirc.style.transform = 'scale(0)'
            secondCirc.classList.add('scale-second-circ')
            thirdCirc.classList.add('scale-third-circ')

        } else {
            firstCirc.style.transform = 'scale(1)'
            secondCirc.classList.remove('scale-second-circ')
            thirdCirc.classList.remove('scale-third-circ')
        }
    }
}// END OF RADIO CHECKBOX MERGE


// NIGHT DAY TOGGLE
class NightDay {
    constructor() {
        const nightDay = document.getElementById("night-day");
        const [x, y, width, height] = nightDay.getAttribute("viewBox").split(' ')
        this.current = {}
        this.svgWidth = width
        this.svgHeight = height
        this.reqId;
        this.timeOutId = []
        this.start = null
        this.isSecondStep = false
        this.animCount = 0
        this.cloud_values = []
        this.sun_glares = []
        this.night_stars = document.querySelectorAll('.night-star')
        this.day_stars = document.querySelectorAll('.day-star, .day-star-big')
        this.day_night_text = document.querySelector('.cookie-accepted')

        this.outAndBack = (start, distance, progress) => (start - (distance * Math.sin(progress * (Math.PI)).toFixed(4)))
        this.commets = []
        this.sun = {
            startX: 0,
            startY: 0,
            startDistX: 1285,
            startDistY: 505,
            distX: 1285,
            distY: 505,
            el: document.getElementById('sun')
        }
        this.moon = {
            startX: -1154,
            startY: 458,
            startDistX: 1154,
            startDistY: -458,
            distX: 1154,
            distY: -458,
            el: document.getElementById('moon')
        }
        // Durations **
        this.dur = {
            main: 1400
        }
        document.querySelector('.switch-input').onclick = e => {

            if (Object.keys(this.current).length) {

                this.updateValues()  // Updates any current animations with new start values
                // cancelAnimationFrame(this.reqId)
                // this.start = 0
            }
            if (e.target.checked) {
                this.animation(false)
            } else {
                this.animation(true)
            }
        }
        this.startValues()
    }

    clearTimeOuts() {
        for (let i = 0; i < this.timeOutId.length; i++) clearTimeout(this.timeOutId[i])
        this.timeOutId = []
    }

    updateValues() {
        // Updates Clouds Gradient
        if (this.current.cloud_values) {
            this.cloud_values.dur = this.cloud_values.currentDur
            this.cloud_values.forEach((item, i) => {
                item.y1 = item.currentY1
                item.y2 = item.currentY2
                item.startDist = item.currentDist
            })
        }
        // Updates the Sun
        if (this.current.sun) {
            Object.assign(this.sun, {
                startX: this.sun.currentX,
                startY: this.sun.currentY,
                startDistX: this.sun.currentDistX,
                startDistY: this.sun.currentDistY,
            })
        }
        // Updates the moon
        if (this.current.moon) {
            Object.assign(this.moon, {
                startX: this.moon.currentX,
                startY: this.moon.currentY,
                startDistX: this.moon.currentDistX,
                startDistY: this.moon.currentDistY,
            })
        }
        this.current = {}
    }

    startValues() {
        // CLOUD GRADIENTS
        const elements = document.getElementsByClassName('cloud-gradient')
        let i = elements.length
        while (i--) {
            const y1 = elements[i].getAttribute('y1')
            const y2 = elements[i].getAttribute('y2')
            const dist = (y1 - y2) * 2

            elements[i].setAttribute('y1', y1 - dist)
            elements[i].setAttribute('y2', y2 - dist)

            this.cloud_values.dur = this.dur.main

            this.cloud_values.push({
                y1: Number(y1 - dist),
                y2: Number(y2 - dist),
                el: elements[i],
                startDist: dist,
                dist: dist,
            })
        }

        // SUN GLARES
        const sun_glares = document.querySelectorAll('#sun-highlight-balls circle')
        let j = sun_glares.length
        const sun_inner = document.getElementById('sun-inner')
        const sunX = sun_inner.getAttribute('cx')
        const sunY = sun_inner.getAttribute('cy')

        while (j--) {
            const cx = sun_glares[j].getAttribute('cx')
            const cy = sun_glares[j].getAttribute('cy')
            const x = sunX - cx
            const y = sunY - cy
            this.sun_glares.push({
                el: sun_glares[j],
                distX: x,
                distY: y,
            })
            if (j < 2) this.day_stars[j].classList.add('twinkle-day')
        }

        // Moon
        document.getElementById('moon').style.transform = `translate(${this.moon.startX}px, ${this.moon.startY}px)`

        // COMMET
        const commet = document.querySelector('.night-commet')
        const { x, y } = commet.getBBox()
        const distX = Number(this.svgWidth) - x
        this.commet = {
            startX: 0,
            startY: 0,
            el: commet,
            distX: distX + 200,
            distY: this.svgHeight / 3
        }
        this.commet.gaussian = document.querySelector('#motion-blur feGaussianBlur')
    }

    animate_cloud_gradient(prog, isNite) {
        const elements = this.cloud_values
        this.current.cloud_values = true
        let i = 0

        while (i < elements.length) {
            const { el, dist, startDist, y1, y2 } = elements[i]
            const Y1 = isNite ? y1 + prog * startDist : y1 - prog * startDist
            const Y2 = isNite ? y2 + prog * startDist : y2 - prog * startDist

            el.setAttribute('y1', Y1)
            el.setAttribute('y2', Y2)

            this.cloud_values[i].currentY1 = Y1
            this.cloud_values[i].currentY2 = Y2
            this.cloud_values[i].currentDist = prog * startDist
            this.cloud_values.currentDur = prog * elements.dur
            if (prog === 1) {
                this.cloud_values[i].y1 = Y1
                this.cloud_values[i].y2 = Y2
                this.cloud_values[i].startDist = dist
                this.cloud_values.dur = this.dur.main
            }
            i++
        }
    }

    animate_glares(isNight) {
        const elements = this.sun_glares
        let i = elements.length
        while (i--) {

            let { el, distX, distY } = elements[i]
            const x = isNight ? distX : 0
            const y = isNight ? distY : 0
            el.style.transform = `translate(${x}px, ${y}px)`
            el.style.opacity = isNight ? 0 : .4

            if (i < 2) isNight ? this.day_stars[i].classList.remove('twinkle-day') : this.day_stars[i].classList.add('twinkle-day')
        }
    }
    outBack = function (n) {
        let s = 1.70158;
        return --n * n * ((s + 1) * n + s) + 1;
    };
    animate_sun(prog, isNite) {
        const { distX, distY, startDistX, startDistY, startX, startY, el } = this.sun
        this.current.sun = true
        const ease = this.outBack(prog)
        const distanceX = ease * startDistX
        const distanceY = isNite ? prog * startDistY : ease * startDistY
        const x = isNite ? startX + distanceX : startX - distanceX
        const y = isNite ? startY + distanceY : startY - distanceY

        this.sun.currentX = x
        this.sun.currentY = y
        this.sun.currentDistX = distanceX
        this.sun.currentDistY = distanceY
        el.style.transform = `translate(${x}px, ${y}px)`

        if (prog === 1) {
            this.sun.startX = isNite ? distX : 0
            this.sun.startY = isNite ? distY : 0
            this.sun.startDistX = distX
            this.sun.startDistY = distY
        }
    }

    animate_night_stars(isNite) {
        let stars = this.night_stars
        let length = stars.length
        for (let i = 0; i < length; i++) {
            if (isNite) {
                this.timeOutId.push(setTimeout(() => {
                    stars[i].classList.add('twinkle')
                }, i * 350))
            } else {
                stars[i].classList.remove('twinkle')
            }
        }
    }

    animate_commets(prog) {
        if (this.animCount % 2 == 0) return
        const blur = 25 - 25 * prog
        const { startX, startY, el, distX, distY, gaussian } = this.commet
        gaussian.setAttribute("stdDeviation", `${blur}, 0`);
        const x = startX + (prog * distX)
        const y = this.outAndBack(startY, distY, prog)

        el.style.transform = `translate(${x}px, ${y}px) rotate(${35 * prog}deg)`
        if (prog === 1) this.isSecondStep = 0
    }

    outCube(n) {
        return --n * n * n + 1;
    };
    inCube = function (n) {
        return n * n * n;
    };
    animate_moon(prog, isNite) {
        this.current.moon = true
        const { distX, distY, startDistX, startDistY, startX, startY, el } = this.moon
        let ease = isNite ? this.outCube(prog) : this.inCube(prog)
        const distanceX = ease * startDistX
        const distanceY = prog * startDistY
        const x = isNite ? startX + distanceX : startX - distanceX
        const y = isNite ? startY + distanceY : startY - distanceY

        this.moon.currentX = x
        this.moon.currentY = y
        this.moon.currentDistX = distanceX
        this.moon.currentDistY = distanceY
        el.style.transform = `translate(${x}px, ${y}px)`
        if (prog === 1) {
            this.moon.startX = isNite ? 0 : -distX
            this.moon.startY = isNite ? 0 : -distY
            this.moon.startDistX = isNite ? distX : distX
            this.moon.startDistY = isNite ? distY : distY
        }
    }

    animation_value_resets() {
        this.isSecondStep = 0
        this.dur.main = 1200
        this.clearTimeOuts()
        cancelAnimationFrame(this.reqId)
        this.start = 0
        this.animCount = 0
        // Resets flying commets to original position
        this.commet.el.style.transform = 'translate(0,0)'
    }

    animation(isNite = false) {
        this.animation_value_resets()
        const background = document.getElementsByClassName('switch-background')[0]
        if (isNite) {
            background.style.backgroundPosition = '0% 0%'
            this.animate_glares(isNite)
            this.day_night_text.textContent = 'NIGHT'
        } else {
            background.style.backgroundPosition = '0% 100%'
            this.timeOutId.push(setTimeout(() => {
                this.animate_glares(isNite)
            }, this.dur.main))
            this.day_night_text.textContent = 'DAYTIME'
        }

        const animate = (timestamp) => {
            if (!this.start) this.start = timestamp
            let prog = Math.min(((timestamp - this.start) / this.dur.main), 1)

            !this.isSecondStep && this.animate_cloud_gradient(prog, isNite)
            !this.isSecondStep && this.timeOutId.push(setTimeout(() => { this.animate_night_stars(isNite) }, 1000))
            !this.isSecondStep && this.animate_sun(prog, isNite)
            !this.isSecondStep && this.animate_moon(prog, isNite)
            this.isSecondStep && isNite && this.animate_commets(prog)

            if (prog < 1) {
                this.reqId = requestAnimationFrame(animate)
            } else {
                this.dur.main = 3000
                this.isSecondStep = true
                this.start = 0
                this.current = {}
                this.animCount++
                this.reqId = requestAnimationFrame(animate)
            }
        }
        this.reqId = requestAnimationFrame(animate)
    }
}
// END NIGHT DAY TOGGLE


function smokeTrail() {
    const smokeTrail = document.getElementsByClassName('smoke-trail')[0]
    const smokeElem = document.getElementsByClassName('smoke')[0]
    const rearWheel = document.getElementsByClassName('rear_wheel')[0]
    const axle = document.getElementsByClassName('axle')[0]
    const railWood = document.getElementsByClassName('railwood')[0]

    let smokeCount = 25
    let requestID;
    const smokes = []
    const random = (min, max) => Math.random() * (max - min) + min;
    const rubberBand = (startY, distance, progress) => (startY + (distance * Math.sin(progress * Math.PI).toFixed(4)))
    const outAndBack = (start, distance, progress) => (start + (distance * Math.sin(progress * (Math.PI * 3)).toFixed(4)))

    const inOutCube = function (n) {
        n *= 2;
        if (n < 1) return 0.5 * n * n * n;
        return 0.5 * ((n -= 2) * n * n + 2);
    };

    const inOutQuad = function (n) {
        n *= 2;
        if (n < 1) return 0.5 * n * n;
        return - 0.5 * (--n * (n - 2) - 1);
    };
    function addSmoke() {
        smokes.length = 0
        while (smokeCount--) {
            let el = smokeTrail.appendChild(smokeElem.cloneNode(true))
            smokes.push({
                el,
                distX: random(-10, 10),
                x: random(-10, 10),
                y: random(-260, -200),
                scale: random(2.2, 3.1),
                delay: smokeCount * 7,
                start: 0
            })
        }
        requestAnimationFrame(animate)
    }

    let start = 0

    const animate = timestamp => {
        if (!start) start = timestamp;                               // 👈  For train only
        const elapsed = Math.min((timestamp - start) / 3000, 1);     // 👈  For train only

        let i = smokes.length
        while (i--) {                                               // 👈  For Smoke only
            let el = smokes[i].el
            let start = smokes[i].start
            if (smokes[i].delay-- <= 0) {
                if (!start) smokes[i].start = timestamp
                const progress = Math.min((timestamp - smokes[i].start) / 3000, 1)
                const scale = Math.max(rubberBand(0, smokes[i].scale, inOutQuad(progress)), 0)
                // const x = smokes[i].x + outAndBack(0, smokes[i].distX, progress)             // 👈  Uncomment for different X effect
                const x = smokes[i].x + outAndBack(0, 30, progress)
                const y = 0 + (progress * smokes[i].y)

                el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`

                if (progress === 1) {
                    smokes[i].start = 0
                }
            }
        }
        // const ease = inOutCube(elapsed) // Use to stop and start again look
        const ease = elapsed
        rearWheel.style.transform = `rotate(${ease * 1440}deg)`
        railWood.style.transform = `translateX(${0 - (ease * 639)}px)`

        axle.style.transform = `translate(${-25 + (Math.sin((Math.PI * 2) * ease * 2) * 25)}px, ${15 - (Math.cos((Math.PI * 2) * ease * 2) * 15)}px) `

        if (elapsed >= 1)
            start = 0

        requestID = requestAnimationFrame(animate)
    }
    addSmoke()

    function handleVisibilityChange() {
        if (document.visibilityState === "hidden") {   // 👈  Move to different browser tab
            console.log('pauseSimulation')

            start = 0
            window.cancelAnimationFrame(requestID);
            let k = smokes.length
            while (k--) {
                document.querySelectorAll('.smoke')[k].style = null
                smokes[k].start = 0
                smokes[k].delay = k * 7
                // smokes[k].distX = random(-10, 10)
                // smokes[k].x = random(-10, 10)
                // smokes[k].y = random(-260, -200)
                // smokes[k].scale = random(2.2, 3.1)
            }
        } else {                               // 👈  Move to the same browser tab (this animation chrome tab)
            console.log('startSimulation')

            visible = true
            requestAnimationFrame(animate)

        }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange, false);
}

function loadingOne() {
    const button = document.querySelector('.show-more-comments.is-loading')
    const text = button.getElementsByTagName('span')[0]
    let textWidth = text.getBoundingClientRect().width
    let textHeight = text.getBoundingClientRect().height
    let fragment = document.createDocumentFragment();
    let circles, container, dist;
    let circleWidth = textHeight         // 👈  The size of circles you want, change to hard coded value if needed, current is text height
    let start = 0
    let animateId;

    const ease = function (n) {
        return --n * n * n + 1;
    };

    const loading = {
        // 2nd Gets Elements inplace and ready (Also helps for animaton rendering)
        placeCircles: function () {
            text.style.display = 'none'
            container.style.display = 'block'
            button.appendChild(fragment)
            circles[0].style.left = '0px'
            circles[1].style.left = '0px'
            circles[2].style.left = dist + 'px'
            circles[3].style.left = (dist * 2) + 'px';

            setTimeout(function () {
                container.style.display = 'none'
                text.style.display = 'block'
                cancelAnimationFrame(animateId)  // 👈  timeout to stop animation and remove if needed
            }, 5000)
        },
        // 3rd animates circles
        rotateCircles: function (timestamp) {
            if (!start) start = timestamp
            const progress = ease(Math.min((timestamp - start) / 600, 1))
            let x = dist * progress
            let scale = 1 - (1 * progress)

            circles[0].style.transform = 'scale(' + (1 * progress) + ')'
            circles[1].style.transform = 'translate3d(' + x + 'px, 0, 0) scale(' + (1 + (.5 * progress)) + ')'
            circles[2].style.transform = 'translate3d(' + x + 'px, 0, 0) scale(' + (1.5 - (.5 * progress)) + ')'
            circles[3].style.transform = 'scale(' + -scale + ')'

            if (progress < 1) {
                animateId = requestAnimationFrame(loading.rotateCircles)
            } else {
                start = 0
                requestAnimationFrame(loading.rotateCircles)
            }
        },
        // 1st Creates the elements and adds necessary styles on page load (Helps with animation rendering)
        createFragment: function () {
            container = document.createElement('div')
            container.className = 'rotate'

            for (let i = 0; i <= 3; i++) {
                let div = container.appendChild(document.createElement('div'));
                div.style.width = circleWidth + 'px'
                div.style.height = circleWidth + 'px'
            }
            fragment.appendChild(container)
            circles = container.querySelectorAll('div')

            container.style.width = textWidth + 'px'
            container.style.height = circleWidth + 'px'
            dist = textWidth / 2 - circleWidth / 2
        }
    }
    loading.createFragment()

    // User clicks to start loading animation
    button.onclick = function () {
        loading.placeCircles()
        requestAnimationFrame(loading.rotateCircles)
    }
}

const rollOffText = function () {
    const path = document.getElementsByClassName('roll-line')[0]
    const svg = document.getElementById('roll-text')
    const svgWidth = svg.getBoundingClientRect().width
    console.log('svgWidth:', svgWidth)
    const text = document.querySelector('.roll-btn-text')

    const pathLength = path.getTotalLength();
    console.log('pathLength:', pathLength)
    const letterData = []
    // Gets the x difference of the top wave based on svg current width
    const wave_top_x_difference = svgWidth / 100
    console.log('wave_top_x_difference:', wave_top_x_difference)

    const loadLetters = () => {
        text.innerHTML = '<span>' + text.innerText.trim().split('').join('</span><span>')

        const el = text.querySelectorAll('span')
        const startX = el[0].getBoundingClientRect().x
        for (let i = 0; i < el.length; i++) {
            let { x, y, width } = el[i].getBoundingClientRect()
            letterData.push({
                letter: el[i],
                width,
                // x: x - startX,
                x: x,
                y
            })
        }
        console.log(letterData)
    }
    loadLetters()
    
    let steps = [{
        leftHandle: {
            x: 0,
            y: -10,
            currentX: -58.5,
            currentY: .5
        },
        middleAnchor: {
            x: 0,
            y: -10,
            currentX: -43.5,
            currentY: .5
        },
        rightHandle: {
            x: 0,
            y: 0,
            currentX: -15,
            currentY: .5
        }
    },
    {
        leftHandle: {
            x: 0,
            y: 0,
        },
        middleAnchor: {
            x: 0,
            y: 0,
        },
        rightHandle: {
            x: -35,
            y: 10,
        }
    }]
    let start = 0
    // The step of the array for every animation
    let step = 0
    let dur = 500
    const animateAttribues = timestamp => {
        if (!start) start = timestamp
        const progress = Math.min((timestamp - start) / dur, 1)
        const outAndBack = (start, distance, progress) => (start + (distance * Math.sin(progress * (Math.PI)).toFixed(4)))
        const upAndBack = (start, distance, progress) => (start + (distance * Math.cos(progress * (Math.PI)).toFixed(4)))
        // console.log(outAndBack(0, 200, progress),  upAndBack(0, 200, progress))
        const dist = 200 * progress

        // if(step == 1) svg.style.transform = `translate3d(${(svgWidth * 2) * progress}px, 0, 0)`
        if (step == 1) path.style.transform = `translate3d(${dist}px, 0, 0)`
        const { x, y } = path.getPointAtLength(131);
        // console.log('x:', path.style.transform)
        if(dist > 30 && step == 1) return

        const values = Object.keys(steps[step]).map((key, i) => {
            let l = steps[step]['leftHandle']
            let m = steps[step]['middleAnchor']
            let r = steps[step]['rightHandle']

            l.X = l.currentX + (progress * l.x)
            l.Y = l.currentY + progress * l.y
            m.X = m.currentX + (progress * m.x)
            m.Y = m.currentY + progress * m.y
            r.Y = r.currentY + (progress * r.y)
            r.X = r.currentX + (progress * r.x)

            path.setAttribute('d',
                `M -200 0.5 
                 C -200 0.5, -101 0.5, -86 0.5,
                 S ${l.X} ${l.Y}, ${m.X} ${m.Y}
                 S ${r.X} ${r.Y}, 0 0.5
                S 100 0.5, 100 0.5`
            )
            // M -200 0.5 
            // C -200 0.5, -101 0.5, -86 0.5,
            // S -58.5 .5, -43.5 .5
            // S -13.5 0.5, 0 0.5
            // S 100 0.5, 100 0.5
            // Returns the current values
            return { leftHandle: { X: l.X, Y: l.Y }, middleAnchor: { X: m.X, Y: m.Y }, rightHandle: { X: r.X, Y: r.Y } }

        })

        //  const {x, y} = path.getPointAtLength(pathLength * progress);

        // console.log(step, path.getBoundingClientRect().x - wave_top_x_difference)
        // console.log(step, path.getBoundingClientRect().x + 530)



        if (progress == 1) {
            step++
            start = 0
            // Updates current values for next animation
            dur = 5000
            for (property in steps[step]) {
                steps[step][property].currentX = values[0][property].X
                steps[step][property].currentY = values[0][property].Y
            }
            console.log(steps)
            // return
            if (step == 2) return
        }
        requestAnimationFrame(animateAttribues)
    }
    requestAnimationFrame(animateAttribues)
}

// A True Out and back 
const outAndBack = (start, distance, progress) => (start + (distance * Math.sin(progress * Math.PI).toFixed(4)))
const inBack = function (n) {
    var s = 1.70158;
    return n * n * ((s + 1) * n - s);
};
const inOutBack = function (n) {
    var s = 1.70158 * 1.525;
    if ((n *= 2) < 1) return 0.5 * (n * n * ((s + 1) * n - s));
    return 0.5 * ((n -= 2) * n * ((s + 1) * n + s) + 2);
};
const inQuint = function (n) {
    return n * n * n * n * n;
}
const inOutQuart = function (n) {
    n *= 2;
    if (n < 1) return 0.5 * n * n * n * n;
    return -0.5 * ((n -= 2) * n * n * n - 2);
}
const inOutQuad = function (n) {
    n *= 2;
    if (n < 1) return 0.5 * n * n;
    return - 0.5 * (--n * (n - 2) - 1);
}
const outSine = function (n) {
    return Math.sin(n * Math.PI / 2);
};

function gooeySpin(btns) {          // 👈  buttons 

    const centers = Array.from(btns).map((btn) => {
        const circles = btn.querySelectorAll('circle')
        const { height } = btn.getBoundingClientRect()
        const svg = btn.querySelector('svg')

        svg.style.display = 'none'

        const big_r = height / 11;
        const small_r = big_r - (big_r * .10)

        circles[0].setAttribute('r', big_r)
        circles[1].setAttribute('r', big_r)
        circles[2].setAttribute('r', big_r)

        return height / 3  //  👈  used for animation from center point of buttons
    })
    const delay = [10000, 9800, 9600]
    const duration = 9900
    const durationTwo = duration - duration * .5  // 👈  10% of duration for second circle delay
    const move = (circles, centerPointDist) => {

        let start = 0

        const animate = (timestamp) => {
            let i = circles.length
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            const progTwo = Math.min((timestamp - start) / durationTwo, 1) // 👈  comment this out if delay is used with an ease Function

            while (i--) {
                // const prog = i == 0 ? progress : progTwo                // 👈  progTwo is the delay
                // const prog = i == 0 ? progress : inBack(progress)    // 👈  delay with ease instead
                const prog = Math.min((timestamp - start) / delay[i], 1)

                // const prog = progress
                const centerPoint = outAndBack(0, centerPointDist, prog)  // 👈  Moves away from the center and comes back
                // const degrees = 10080 * outSine(prog)
                const degrees = 2880 * outSine(prog)
                // const degrees = 2880 * prog
                const x = centerPoint * Math.cos(degrees * Math.PI / 180);
                const y = centerPoint * Math.sin(degrees * Math.PI / 180);

                circles[i].style.transform = `translate(50%, 50%) translate(${x}px, ${y}px)`
            }

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                start = 0
                requestAnimationFrame(animate)
            }
        }
        requestAnimationFrame(animate)
    }

    Array.from(btns).forEach((btn, i) => {
        btn.onclick = e => {
            const buttonTarget = e.target
            console.log('buttonTarget:', buttonTarget)

            const innerTextElem = buttonTarget.querySelector('.innerText')
            const svg = buttonTarget.querySelector('svg')

            innerTextElem.style.display = 'none'
            svg.style.display = 'block'
            move(svg.querySelectorAll('circle'), centers[i])
        }
    })
}

window.onload = function () {
    gradientEffect()
    letterSpin()
    wordSpin()
    rippleHover()
    splatter()
    radioCheckBox()
    new NightDay()
    // smokeTrail() // Train
    loadingOne()
    rollOffText()
    gooeySpin(document.getElementsByClassName('c-loader-spin'))


    var path = document.querySelector('.flex-radio circle');
    console.log('path :', path )
var length = path.getTotalLength();
console.log('length:', length)
}