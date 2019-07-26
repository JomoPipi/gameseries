// TODO: winner component, loser component

// add title
function startScreenSetup({func: f, text: t}) {
    const startScreen = document.createElement('div')
    const S = startScreen.style
    S.position = 'absolute'
    S.display = 'flex'
    S.top = '0px'
    S.left = '0px'
    S.width = '100vw'
    S.height = '100vh'
    S.zIndex = '99'
    S.backgroundColor = 'yellow'
    S.textAlign = 'center'
    S.alignItems = 'center'
    S.font = '8em Georgia'
    startScreen.innerHTML = t
    document.body.append(startScreen)
    startScreen.onmousedown = function() {
        this.style.display = 'none'
        if (f) f()
    }
}
function addSpeaker(input) {
    if (input.constructor !== Array) input = [input]
    // create speaker
    const speaker = document.createElement('img')
    speaker.src = 'https://i.ibb.co/GMBrW31/speaker.png'
    speaker.style.position = 'absolute'
    speaker.style.width = '150px'
    speaker.style.top = '30px'
    speaker.style.left = '15px'
    document.body.append(speaker)
    speaker.onmousedown = _ => {
        for (const source of input) {
            if (source.constructor.toString().includes('AudioContext')) {
                if (source.isSuspended) {
                    source.isSuspended = false
                    source.resume()
                }
                else {
                    source.isSuspended = true
                    source.suspend()
                }
            }
            else if (source.constructor === HTMLAudioElement) {
                if (source.muted) {
                    source.muted = false
                } else {
                    source.muted = true
                }
            }
            else if (source.paused) {
                source.play();
            } else {
                source.pause();
            }
        }
    }
    return speaker
}

function countDown(f) {
    const x = document.getElementById('number')
    const number = x ? x : document.createElement('div')
    number.style.position = 'absolute'
    number.style.width = '90%'
    number.style.height = '10vh'
    number.style.zIndex = '99'
    number.style.top = '40%'
    number.style.left = '5%'
    number.style.display = 'block'
    number.style.font = '10em Arial'
    number.style.backgroundColor = 'salmon'
    number.id = 'number'
    document.body.append(number)
    let n = 3
    number.innerHTML = 'restart in ' + n 
    const shownum = setInterval(() => {
        number.innerHTML = 'restart in ' + n 
        if (n-- <= 0) {
            clearInterval(shownum)
            number.style.display = 'none'
            n = 3
            if (f) f()
        }
    }, 1000)
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (var i = 0; i < 6; i++) 
      color += letters[Math.floor(Math.random() * 16)]
    return color
}
function winState(link) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const S = canvas.style
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    S.position = 'absolute'
    S.top = S.left = '0'
    document.body.append(canvas)
    const youwin = new Image(); youwin.src = '../componentImg/youwin.png'
    const taptocnt = new Image(); taptocnt.src = '../componentImg/taptocontinue.png'
    function Star(y) {
        this.y = y
        this.color = getRandomColor()
        this.x = ~~(Math.random() * canvas.width)
        this.speed = ~~(Math.random() * 40) + 30
        this.size = 30 + ~~(Math.random() * 30)
        this.angle = ~~(Math.random() * 360)
        this.angularSpeed = (~~(Math.random() * 30) - 15) || 1
        this.draw = _ => {
            const angle = this.angle * Math.PI / 180, alpha = (2 * Math.PI) / 10
            ctx.save()
            ctx.translate(this.x + this.size/2, this.y + this.size/2)
            ctx.rotate(angle)
            ctx.translate(-this.x - this.size/2, -this.y - this.size/2)
            ctx.beginPath()
            for(let i = 11; i > 0; i--) {
                const r = this.size*(i % 2 + 1)/2, omega = alpha * i
                ctx.lineTo((r * Math.sin(omega)) + this.x, (r * Math.cos(omega)) + this.y)
            }
            ctx.closePath()
            ctx.fillStyle = this.color
            ctx.fill()
            ctx.restore()
        }
        this.move = _ => {
            this.y += this.speed
            this.angle += this.angularSpeed
            if (this.y > canvas.height) {
                this.y = -this.size * 2
                this.x = ~~(Math.random() * canvas.width)
            }
        }
    }
    const stars = [...Array(99)].map((_,i) => new Star(i * -200))
    let stopped = false, time = 0
    setInterval(_ => {
        if (stopped) return
        ctx.clearRect(0,0,canvas.width,canvas.height)
        stars.forEach(s => {
            if (s.y > -2 * s.size) s.draw()
            s.move()
        })
        ctx.drawImage(youwin, canvas.width/2 - youwin.width/2, canvas.height/4)
        ctx.drawImage(taptocnt, canvas.width/2 - taptocnt.width/2, canvas.height/2)

        // let a second pass before allowing user to continue:
        if (time++ === 20)
            document.onmousedown = _ => {
                stopped = true
                window.location.href = link
            }
    }, 50)
}