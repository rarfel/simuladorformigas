/** @type {HTMLCanvasElement} */
const quadro = document.querySelector("#quadro")
let context = quadro.getContext('2d')

quadro.width = quadro.clientWidth;
quadro.height = quadro.clientHeight;

const halfWidht = quadro.width/2
const halfHeight = quadro.height/2
let isAlive = false;
let isDrawing = 'comida';

context.translate(halfWidht, halfHeight);

class Formiga
{
    constructor(x,y)
    {
        this.raio = 25; // Raio do círculo
        this.angulo = (Math.random() * Math.PI * 2);
        this.x = x + Math.cos(this.angulo) * this.raio;
        this.y = y + Math.sin(this.angulo) * this.raio;
        this.velocidade = 3;
        this.carregando = false;
        this.raioDeVisao = 10;
    }

    atualizar(x,y,angulo) 
    {
        this.x = x
        this.y = y
        this.angulo = angulo

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

            if(this.distancia(this.x,this.y,0,0)[0] < 20)
            {
                this.carregando = false
            }
        }
    }
    
    drawFormiga(context)
    {
        context.fillStyle = "#0000ff"
        context.fillRect(this.x, this.y, 5, 5)
        context.beginPath()
        context.strokeStyle = '#0000ff'
        context.stroke()
        context.closePath()
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
    
        let adj = x2 - x1
        let op = y2 - y1
    
        let a = adj * adj //a = adj^2
        let b = op * op //b = op^2
    
        let hip = Math.sqrt(a+b) // hip = √(a^2 + b^2)
        //sin = op / hip
        //cos = adj / hip
        //tan = op / adj
        //angle = tan^-1(op/adj) = Math.atan(op/adj)*180 / Math.PI
        let angle = Math.atan(op/adj) // radians
        return [hip,adj,op,angle]
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
    constructor(color,size)
    {
        this.color = color
        this.movimento = []
        this.size = size
    }
    draw(x,y)
    {
        context.fillStyle = this.color;
        context.fillRect(x,y,this.size,this.size);
    }
}

let comida = new Block("#00ff00",8)
let parede = new Block("#626262",18)

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

    for(let i = 0; i < formigas.size; i++)
    {
        const formiga = formigas.get(i);
        formiga.atualizar(formiga.x,formiga.y,formiga.angulo);
        if(comida.movimento[0])
        {
            for(let x = 0; x < comida.movimento.length;x++)
            {
                if(formiga.distancia(formiga.x,formiga.y,comida.movimento[x][0],comida.movimento[x][1])[0] <= formiga.raioDeVisao+comida.size/2)
                {
                    if(formiga.distancia(formiga.x,formiga.y,comida.movimento[x][0],comida.movimento[x][1])[0] <= 10)
                    {
                        if(formiga.carregando == false)
                        {
                            comida.movimento.at(x).pop()
                            formiga.carregando = true
                            formiga.angulo = (Math.atan2(Math.floor(formiga.y),Math.floor(formiga.x)));
                        }
                    }else
                    {
                        if(formiga.carregando == false)
                        {
                            formiga.angulo = formiga.distancia(formiga.x,formiga.y,comida.movimento[x][0],comida.movimento[x][1])[3]
                        }
                    }
                }
            }
        }
        if(parede.movimento[0])
        {
            for(let x = 0; x < parede.movimento.length; x++)
            {
                if(formiga.distancia(formiga.x,formiga.y,parede.movimento[x][0],parede.movimento[x][1])[0] <= formiga.raioDeVisao)
                {
                    formiga.angulo = formiga.distancia(formiga.x,formiga.y,parede.movimento[x][0],parede.movimento[x][1])[3] * -1   
                }
            }
        }
        formiga.colisao(halfWidht,halfHeight,(Math.random() * Math.PI * 2))
        formiga.drawFormiga(context)
    }
    if(isAlive)
    {
        requestAnimationFrame(animate)
    }
}

const formigas = new Map()
makeFormigas(100)
animate()

// context.fillStyle = '#ff0000'
// context.fillRect(180,180,10,10)

function makeFormigas(numeroDeFormigas)
{
    for (let i = 0; i < numeroDeFormigas; i++) 
    {
        const formiga = new Formiga(0, 0);
        formigas.set(i,formiga)
    }
}

// draw lines on the canvas manually

let clicked = false;

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

// draw lines on the canvas automatically
function generateFood(quantity)
{
    for(let i = 0; i < quantity; i++)
    {
        let multiplier = 105
        let noise = Math.PI
        if(Math.random() >= 0.5)
        {
            multiplier *= 1
        }else
        {
            multiplier *= -1
        }
        let x = Math.random() * multiplier * noise
        if(Math.random() >= 0.5)
        {
            multiplier *= 1
        }else
        {
            multiplier *= -1
        }
        let y = Math.random() * multiplier * noise
        comida.movimento.push([x,y])
        comida.draw(x,y)
    }
}

generateFood(0)