// Marks module - handles bruise and mark generation

const BRUISE_TYPES = [
    { colors: ['rgba(180,20,20,0.6)', 'rgba(120,10,40,0.4)', 'rgba(80,0,30,0.2)'] },
    { colors: ['rgba(100,20,60,0.6)', 'rgba(70,10,50,0.4)', 'rgba(50,5,40,0.2)'] },
    { colors: ['rgba(60,20,80,0.5)', 'rgba(40,30,60,0.3)', 'rgba(30,40,50,0.1)'] },
    { colors: ['rgba(50,80,40,0.4)', 'rgba(80,120,50,0.2)'] }
];

function createMark(hitX, hitY) {
    const bruiseType = BRUISE_TYPES[Math.floor(Math.random() * 3)];
    const marks = [];
    
    // Main bruise
    marks.push({
        x: hitX,
        y: hitY,
        rx: 6 + Math.random() * 4,
        ry: 5 + Math.random() * 3,
        rot: Math.random() * Math.PI,
        type: 'bruise',
        colors: bruiseType.colors
    });
    
    // Broken blood vessels (tiny dots)
    for (let i = 0; i < 2 + Math.random() * 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 4 + Math.random() * 5;
        marks.push({
            x: hitX + Math.cos(angle) * dist,
            y: hitY + Math.sin(angle) * dist,
            rx: 1 + Math.random() * 1.5,
            ry: 1 + Math.random() * 1.5,
            rot: Math.random() * Math.PI,
            type: 'vessel',
            color: 'rgba(200,30,30,0.7)'
        });
    }
    
    // Swelling/discoloration
    marks.push({
        x: hitX,
        y: hitY,
        rx: 10 + Math.random() * 4,
        ry: 8 + Math.random() * 3,
        rot: Math.random() * Math.PI,
        type: 'swelling',
        color: 'rgba(255,200,200,0.15)'
    });
    
    return marks;
}

function drawMark(ctx, mark, offsetX, offsetY) {
    ctx.save();
    ctx.translate(offsetX + mark.x, offsetY + mark.y);
    ctx.rotate(mark.rot);
    
    if (mark.type === 'bruise' && mark.colors) {
        for (let i = 0; i < mark.colors.length; i++) {
            const color = mark.colors[i];
            const offset = i / (mark.colors.length - 1);
            ctx.beginPath();
            ctx.ellipse(0, 0, mark.rx * offset, mark.ry * offset, 0, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        }
    } else if (mark.type === 'vessel') {
        ctx.beginPath();
        ctx.ellipse(0, 0, mark.rx, mark.ry, 0, 0, 2 * Math.PI);
        ctx.fillStyle = mark.color;
        ctx.fill();
    } else if (mark.type === 'swelling') {
        ctx.beginPath();
        ctx.ellipse(0, 0, mark.rx, mark.ry, 0, 0, 2 * Math.PI);
        ctx.fillStyle = mark.color;
        ctx.fill();
    }
    
    ctx.restore();
}

export { createMark, drawMark };