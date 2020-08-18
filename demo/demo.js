
const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d");

ctx.font = "30px Arial";
ctx.fillStyle = "black";
ctx.textAlign = "center";

var dx = 0
var dy = 0
var speed = 2

setInterval(frame, 0)

class Player {
    constructor(ctx, color, x, y, username) {
        this.x = x
        this.y = y
        this.ctx = ctx
        this.color = color
        this.username = username
    }

    updateXY(x, y) {
        this.x = x
        this.y = y
    }

    draw() {
        this.ctx.strokeText(this.username, this.x, this.y - 10);
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(this.x, this.y, 20, 20)

    }

    toString() {
        return this.username + ' ' + this.x + ' ' + this.y
    }
}

u = prompt("Username")
top.document.title = u
var player = new Player(ctx, "#FF0000", 10, 10, u)
var multi = []
// multi.push(new Player(ctx, 'blue', 0, 0, 'alice'))

const ws = new WebSocket('ws://75.40.154.54:4000')

function frame() {
    player.updateXY(player.x + dx, player.y + dy)
    if (dx != 0 || dy != 0) {
        ws.send(JSON.stringify(
            {
                type: "pos",
                user: player.username,
                x: player.x,
                y: player.y
            }
        ))
    } 

    canvas.width=canvas.width;
    multi.forEach(e => {
        e.draw()
    })
    player.draw()


}

document.onkeydown = function(event) {
    if (event.key === 'w') {
        dy = -speed
    }
    if (event.key === 's') {
        dy = speed
    }
    if (event.key === 'd') {
        dx = speed
    }
    if (event.key === 'a') {
        dx = -speed
    }
}

document.onkeyup = function(event) {
    dx = 0
    dy = 0
}

ws.onmessage = function(e) {
    console.log(e.data)
    data = JSON.parse(e.data)

    switch (data.type) {
        case "client":
            multi.push(new Player(ctx, '#808080', data.x, data.y, data.user))
            break;
        case "pos":
            for (let i = 0; i < multi.length; i++) {
                if (multi[i].username == data.user) {
                    multi[i].updateXY(data.x, data.y)
                }
            }
            break;
        case "left":
            for (let i = 0; i < multi.length; i++) {
                if (multi[i].username == data.user) {
                    multi.splice(i, 1)
                }
            }
            break;
    }
}

ws.onopen = function(e) {
    ws.send(JSON.stringify(
        {
            type: "new",
            user: player.username,
            x: player.x,
            y: player.y
        }
    ))
}