// TODO: winner component, loser component

// add title
function startScreenSetup(f) {
    const startScreen = document.createElement('img')
    startScreen.style.position = 'absolute'
    startScreen.style.top = '0px'
    startScreen.style.left = '0px'
    startScreen.style.width = '100vw'
    startScreen.style.height = '100vh'
    startScreen.style.zIndex = '99'
    startScreen.src = 'https://i.ibb.co/Nng76s8/Screen-Shot-2019-07-13-at-9-07-04-PM.png'
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
    number.style.width = '100vw'
    number.style.height = '100vh'
    number.style.zIndex = '99'
    number.style.top = '0px'
    number.style.left = '0px'
    number.style.color = 'blue'
    number.style.display = 'block'
    number.style.font = '200px Arial'
    number.id = 'number'
    document.body.append(number)
    let n = 3
    number.innerHTML = '<br><br> restart in ' + n 
    const shownum = setInterval(() => {
        number.innerHTML = '<br><br> restart in ' + n 
        if (n-- <= 0) {
            clearInterval(shownum)
            number.style.display = 'none'
            n = 3
            if (f) f()
        }
    }, 1000)
}