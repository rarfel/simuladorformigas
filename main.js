const quadro = document.querySelector("#quadro")
let context = quadro.getContext('2d')

quadro.width = quadro.clientWidth;
quadro.height = quadro.clientHeight;

const halfWidht = quadro.width/2
const halfHeight = quadro.height/2
let rastro = [];
let isAlive = false;
let isDrawing = 'comida';

context.translate(halfWidht, halfHeight);

class Formiga
{
    constructor(x,y)
    {
        this.raio = 60; // Raio do círculo
        this.angulo = (Math.random() * Math.PI * 2);
        this.x = x + Math.cos(this.angulo) * this.raio;
        this.y = y + Math.sin(this.angulo) * this.raio;
        this.velocidade = 1;
        this.carregando = false;
    }

    atualizar(x,y,angulo) 
    {
        this.x = x
        this.y = y
        this.angulo = angulo
        this.rastro = [].push([x,y])

        if(this.carregando == false)
        {
            this.x += Math.cos(this.angulo) * this.velocidade;
            this.y += Math.sin(this.angulo) * this.velocidade;
        }else
        {
            this.x -= Math.cos(this.angulo) * this.velocidade;
            this.y -= Math.sin(this.angulo) * this.velocidade;
        }
        if(this.carregando == true)
        {
            comida.draw(this.x - 3.5,this.y - 3.5,10,10)

            if(this.distancia(this.x,this.y,0,0) < 20)
            {
                this.carregando = false
            }
        }
    }
    
    drawFormiga(context)
    {
        context.fillStyle = "#00f"
        context.fillRect(this.x, this.y, 5, 5)
    }
    
    distancia(x1,y1,x2,y2)
    {
        context.strokeStyle = "#f00";
        context.lineWidth = .5;
    
        // debug only
        // context.beginPath();
        // context.moveTo(x1,y1);
        // context.lineTo(x2,y2);
        // context.stroke();
    
        let dx = x2 - x1
        let dy = y2 - y1
    
        let a = dx * dx //a = dx^2
        let b = dy * dy //b = dy^2
    
        let c = Math.sqrt(a+b) // c = √(a^2 + b^2)
        return c
    }
    colisao(x,y,newAngle)
    {
        if (this.x < -x)
        {
            this.x = -x;
            this.angulo = newAngle;
        }
        if (this.x > x) 
        {
            this.x = x;
            this.angulo = newAngle;
        }
        if (this.y < -y) 
        {
            this.y = -y;
            this.angulo = newAngle; 
        }
        if (this.y > y) 
        {
            this.y = y;
            this.angulo = newAngle; 
        }
    }
    
}
class Block 
{
    constructor(color)
    {
        this.color = color
        this.movimento = []
    }
    draw(x,y)
    {
        context.fillStyle = this.color;
        context.fillRect(x,y,10,10);
    }
}

let comida = new Block("#00ff00")
let parede = new Block("#626262")

function animate()
{
    context.clearRect(-halfWidht,-halfHeight,halfWidht*2,halfHeight*2)
    context.fillStyle = '#000'
    context.fillRect(-halfWidht,-halfHeight,halfWidht*2,halfHeight*2)
    context.fillStyle = "#ff7700"
    context.beginPath()
    context.arc(0,0,20,0,Math.PI * 2)
    context.fill()
    context.closePath()

    if(comida.movimento[0])
    for(let i = 0; i < comida.movimento.length; i ++)
    {
        comida.draw(comida.movimento[i][0],comida.movimento[i][1],10,10)
    }
    if(parede.movimento[0])
    for(let i = 0; i < parede.movimento.length; i ++)
    {
        parede.draw(parede.movimento[i][0],parede.movimento[i][1],10,10)
    }
    for (let x = 0; x < rastro.length; x++) {
        feromonio(rastro[x][0],rastro[x][1],1)
    }

    for(let i = 0; i < formigas.size; i++)
    {
        const formiga = formigas.get(i);
        formiga.atualizar(formiga.x,formiga.y,formiga.angulo);
        if(comida.movimento[0])
        {
            for(let x = 0; x < comida.movimento.length;x++)
            {
                if(formiga.distancia(formiga.x,formiga.y,comida.movimento[x][0],comida.movimento[x][1]) <= 5)
                {
                    if(formiga.carregando == false)
                    {
                        comida.movimento.at(x).pop()
                        formiga.carregando = true
                        formiga.angulo = (Math.atan2(Math.floor(formiga.y),Math.floor(formiga.x)));
                    }
                }
            }
        }
        if(parede.movimento[0])
        {
            for(let x = 0; x < parede.movimento.length; x++)
            {
                if(formiga.distancia(formiga.x,formiga.y,parede.movimento[x][0],parede.movimento[x][1]) <= 6)
                {
                    formiga.angulo = (Math.random() * Math.PI * 2)
                }
            }
        }
        formiga.colisao(halfWidht,halfHeight,(Math.random() * Math.PI * 2))
        formiga.drawFormiga(context);
        formiga.distancia(formiga.x,formiga.y,0,0)
    }
    if(isAlive)
    {
        requestAnimationFrame(animate)
    }
}

const formigas = new Map()
makeFormigas(10)
animate()

function makeFormigas(numeroDeFormigas)
{

    for (let i = 0; i < numeroDeFormigas; i++) 
    {
    const formiga = new Formiga(0, 0);
    formigas.set(i,formiga)
    }
}

// draw lines on the canvas

let clicked = false;

function feromonio(x,y,radius)
{

    context.fillStyle = "#0000ff"
    context.beginPath()
    context.arc(x,y,radius,0,Math.PI * 2)
    context.fill()
    context.closePath()
}

quadro.addEventListener('mousedown',(e)=>{
    clicked = true
    if(isDrawing == 'comida')
    {
        comida.movimento.push([e.offsetX - halfWidht,e.offsetY-halfHeight])
        comida.draw(e.offsetX - halfWidht,e.offsetY-halfHeight)
    }
    if(isDrawing == 'parede')
    {
        parede.movimento.push([e.offsetX - halfWidht,e.offsetY-halfHeight])
        parede.draw(e.offsetX - halfWidht,e.offsetY-halfHeight)
    }
})

quadro.addEventListener('mouseup',()=>{
    clicked = false
})

quadro.addEventListener('mousemove',(e)=>{
    if(clicked == true)
    {
        if(isDrawing == 'comida')
        {
            comida.movimento.push([e.offsetX - halfWidht,e.offsetY-halfHeight])
            comida.draw(e.offsetX - halfWidht,e.offsetY-halfHeight)
        }
        if(isDrawing == 'parede')
        {
            parede.movimento.push([e.offsetX - halfWidht,e.offsetY-halfHeight])
            parede.draw(e.offsetX - halfWidht,e.offsetY-halfHeight)
        }
    }
})

document.addEventListener('keypress',(e)=>{
    if(e.key == 'Enter')
    {
        isAlive = true;
        animate()
    }
    if(e.key == '1')
    {
        isDrawing = 'comida';
    }
    if(e.key == '2')
    {
        isDrawing = 'parede';
    }
})