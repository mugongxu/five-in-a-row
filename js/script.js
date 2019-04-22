var chess = document.getElementById('chess');
var context = chess.getContext('2d');

context.strokeStyle = '#BFBFBF';

// 占位标志
var hasCoverPlace = [];

for (var i = 0; i < 15; i++) {
    hasCoverPlace[i] = [];
    for (var j = 0; j < 15; j++) {
        hasCoverPlace[i][j] = 0;
    }
}
// 我方下棋状态
var me = true;

// 赢法数组：3维数组
var wins = [];
// 赢法总数
var count = 0;

for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}

// 遍历所有的赢法
for (var i = 0; i < 15; i++) { // 竖向赢法
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}

for (var i = 0; i < 11; i++) { // 横向赢法
    for (var j = 0; j < 15; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j][count] = true;
        }
        count++;
    }
}

for (var i = 0; i < 11; i++) { // 斜向赢法
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}

for (var i = 0; i < 11; i++) { // 反斜向赢法
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

console.log(count);

// 赢法统计数据
var myWin = [];
var AIWin = [];
var over = false;
for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    AIWin[i] = 0;
}

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

var AICalculate = function () {
    // 二维数组得分
    var myScore = [];
    var AIScore = [];
    // 保存最高得分
    var max = 0;
    // 保存AI落子位置
    var u = 0, v = 0;
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        AIScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            AIScore[i][j] = 0;
        }
    }
    // 循环棋盘所有位置
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            // 测算还没有落子的位置
            if (hasCoverPlace[i][j] === 0) {
                // 循环所有赢法
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        // 计算我在当前i,j位置的权重得分
                        if (myWin[k] === 1) {
                            myScore[i][j] += 200;
                        } else if (myWin[k] === 2) {
                            myScore[i][j] += 400;
                        } else if (myWin[k] === 3) {
                            myScore[i][j] += 2000;
                        } else if (myWin[k] === 4) {
                            myScore[i][j] += 10000;
                        }
                        // 计算AI在当前i,j位置的权重得分，每项权重高于我单不大于下一阶段
                        if (AIWin[k] === 1) {
                            AIScore[i][j] += 220;
                        } else if (AIWin[k] === 2) {
                            AIScore[i][j] += 440;
                        } else if (AIWin[k] === 3) {
                            AIScore[i][j] += 2200;
                        } else if (AIWin[k] === 4) {
                            AIScore[i][j] += 20000; // 要赢了给绝对权重
                        }
                        // 最优位置确认: 我最优
                        if (myScore[i][j] > max) {
                            max = myScore[i][j];
                            u = i;
                            v = j;
                        } else if (myScore[i][j] == max) {
                            if (AIScore[i][j] > AIScore[u][v]) {
                                u = i;
                                v = j;
                            }
                        }
                        // AI最优
                        if (AIScore[i][j] > max) {
                            max = AIScore[i][j];
                            u = i;
                            v = j;
                        } else if (AIScore[i][j] == max) {
                            if (myScore[i][j] > myScore[u][v]) {
                                u = i;
                                v = j;
                            }
                        }
                    }
                }
            }
        }
    }
    // 下子最优位置
    oneStep(u, v, false);
    hasCoverPlace[u][v] = 2;
    // 循环赢法
    for (var n = 0; n < count; n++) {
        if (wins[u][v][n]) {
            AIWin[n]++;
            myWin[n] = 6
            // 判断输赢
            if (AIWin[n] === 5) {
                alert('AI赢了');
                over = true;
            }
        }
    }
    if (!over) {
        me = !me;
    }
}

// 事件监听
chess.onclick = function (e) {
    if (over) return;
    if (!me) return;
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    if (hasCoverPlace[i][j] === 0) {
        oneStep(i, j, me);
        hasCoverPlace[i][j] = 1;
        // 循环赢法
        for (var n = 0; n < count; n++) {
            if (wins[i][j][n]) {
                myWin[n]++;
                AIWin[n] = 6
                // 判断输赢
                if (myWin[n] === 5) {
                    alert('你赢了');
                    over = true;
                }
            }
        }
        if (!over) {
            me = !me;
            AICalculate();
        }
    }
}

drawChessBoard();
