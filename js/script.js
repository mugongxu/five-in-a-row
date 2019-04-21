var chess = document.getElementById('chess');
var context = chess.getContext('2d');

context.strokeStyle = '#BFBFBF';

var drawChessBoard = function () {
    // 画棋盘
    for(var i = 0; i < 15; i++) {
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 435);
        context.stroke();

        context.moveTo(15, 15 + i * 30);
        context.lineTo(435, 15 + i * 30);
        context.stroke();
    }
}

var oneStep = function (i, j, me) {
    // 画圆
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    var grd = context.createRadialGradient(5 + i * 30, 15 + j * 30, 10, 5 + i * 30, 15 + j * 30, 0);
    if (me) {
        grd.addColorStop(0, '#0A0A0A');
        grd.addColorStop(1, '#636766');
    } else {
        grd.addColorStop(0, '#D1D1D1');
        grd.addColorStop(1, '#F9F9F9');
    }
    context.fillStyle = grd;
    context.fill();
}

// 占位标志
var hasCoverPlace = [];
for (var i = 0; i < 15; i++) {
    hasCoverPlace[i] = [];
    for (var j = 0; j < 15; j++) {
        hasCoverPlace[i][j] = 0;
    }
}

var me = true;

console.log(hasCoverPlace);

// 事件监听
chess.onclick = function (e) {
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    console.log(i, j);
    if (hasCoverPlace[i][j] === 0) {
        oneStep(i, j, me);
        hasCoverPlace[i][j] = me ? 1 : 2;
        me = !me;
    }
}

drawChessBoard();
