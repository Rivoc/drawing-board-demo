var pageWidth = document.documentElement.clientWidth;
    var pageHeight = document.documentElement.clientHeight;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var eraser = document.getElementById("eraser");
    var brush = document.getElementById("brush");
    var bin = document.getElementById("bin");
    var save = document.getElementById("save");
    var wrap = document.getElementById("wrap");
    var svgs = document.querySelectorAll('svg')
    var sizes = document.querySelectorAll('.size>li');
    var mouseDown = false;
    var eraserEnabled = false;
    var lis = document.querySelectorAll('#colors>li');
    var colors = ['black', '#ff7575', '#ffac5e', '#8eff6c', 'blue', 'deeppink', '#d479ff', '#59e9be', '#209b61', '#0d2baf'];
    var lineWidth = 4;
    
    autoFullSize();
    window.onresize = function () {
        autoFullSize();
    }
    paintColor(lis, colors);//给色盘填充颜色
    listenToMouse();
    function paintColor(lis, colors) {
        lis.forEach(function (li) {//遍历所有色盘，填充颜色
            var index = [...lis].indexOf(li)
            li.style.background = colors[index];
        })
        lis[0].classList.add('active');//默认第一个色盘(黑色)为激活状态

        lis.forEach(function (li) {//给每个色盘绑定点击事件，点击色盘，色盘放大，笔的颜色相应变化
            li.onclick = function () {
                var color = this.style.background;//获取点击到的色盘颜色
                if (!eraserEnabled) {//只有使用笔刷时才能点击色板改颜色
                    lis.forEach(function (node) {
                        node.classList.remove('active');//先排除所有色盘的激活状态
                    })
                    this.classList.add('active');//点击到的色盘设置激活
                    brush.style.color = color;//改笔刷图标的颜色
                    context.fillStyle = color;//改画画的笔触颜色
                    context.strokeStyle = color;
                }
            }
        })
    }    
    function autoFullSize() {
        //让canvas宽高等于视口宽高，实现全屏
        pageWidth = document.documentElement.clientWidth;
        pageHeight = document.documentElement.clientHeight;
        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }
    function drawCircle(x, y, r) {
        //画圆
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2);//2π=360°
        context.fill();
    }
    function drawLine(x1, x2, y1, y2) {
        //画线，由于浏览器定时监听坐标，导致画的太快会产生不连续的点，故在两点间连线使画画连续
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineWidth = lineWidth;
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
    }
    function listenToMouse() {
        //特性检测
        if (document.body.ontouchstart !== undefined) {
            //触屏设备
            canvas.ontouchstart = function (touchEvent) {
                mouseDown = !mouseDown;
                var x = touchEvent.touches[0].clientX;
                var y = touchEvent.touches[0].clientY;
                lastPoint = { x: x, y: y };
                if (!eraserEnabled) {
                    drawCircle(x, y, lineWidth-1);
                } else {
                    context.clearRect(x - 15, y - 15, 30, 30);
                }
            };
            canvas.ontouchmove = function (touchEvent) {
                var x = touchEvent.touches[0].clientX;
                var y = touchEvent.touches[0].clientY;
                var newPoint = { x: x, y: y };
                if (mouseDown) {
                    if (!eraserEnabled) {
                        drawLine(lastPoint["x"], x, lastPoint["y"], y);
                        lastPoint = newPoint;
                    } else {
                        context.clearRect(x - 15, y - 15, 30, 30);
                    }
                }
            };
            canvas.ontouchend = function () {
                mouseDown = !mouseDown;
            };
            eraser.ontouchstart = function () {
                eraserEnabled = true;
                active(svgs);
                this.classList.add('active');
            };
            brush.ontouchstart = function () {
                eraserEnabled = false;
                active(svgs);
                this.classList.add('active');
            };
            bin.ontouchstart = function () {
                eraserEnabled = true;
                active(svgs);
                this.classList.add('active');
                context.clearRect(0, 0, pageWidth, pageHeight);
            }
            sizes.forEach(function (size) {
                size.ontouchstart = function () {
                    current(sizes);
                    this.classList.add('current');
                    lineWidth = getComputedStyle(this)['borderWidth'][0]//获取笔刷大小
                }
                
            })
            save.onclick = function () {
                var saveULR = canvas.toDataURL('image/jpg');
                var a = document.createElement('a');
                a.target = '_blank';
                a.href = saveULR;
                a.download = '我的画';
                document.body.appendChild(a);
                a.click();
            }

        } else {
            canvas.onmousedown = function (mouse) {
                mouseDown = !mouseDown;
                var x = mouse.clientX;
                var y = mouse.clientY;
                lastPoint = { x: x, y: y };
                if (!eraserEnabled) {
                    drawCircle(x, y, lineWidth - 2);
                } else {
                    context.clearRect(x - 15, y - 15, 30, 30);
                }
            };
            canvas.onmousemove = function (mouse) {
                var x = mouse.clientX;
                var y = mouse.clientY;
                var newPoint = { x: x, y: y };
                if (mouseDown) {
                    if (!eraserEnabled) {
                        drawLine(lastPoint["x"], x, lastPoint["y"], y);
                        lastPoint = newPoint;
                    } else {
                        context.clearRect(x - 15, y - 15, 30, 30);
                    }
                }
            };
            canvas.onmouseup = function () {
                mouseDown = !mouseDown;
            };
            eraser.onclick = function () {
                eraserEnabled = true;
                active(svgs);
                this.classList.add('active');
            };
            brush.onclick = function () {
                eraserEnabled = false;
                active(svgs);
                this.classList.add('active');
            };
            bin.onclick = function () {
                eraserEnabled = true;
                active(svgs);
                this.classList.add('active');
                context.clearRect(0, 0, pageWidth, pageHeight);
            }
            sizes.forEach(function (size) {
                size.onclick = function () {
                    current(sizes);
                    this.classList.add('current');
                    lineWidth = getComputedStyle(this)['borderWidth'][0]//获取笔刷大小

                }
            })
            save.onclick = function () {
                var saveULR = canvas.toDataURL('image/jpg');
                var a = document.createElement('a');
                a.target = '_blank';
                a.href = saveULR;
                a.download = '我的画';
                document.body.appendChild(a);
                a.click();
            }

        }
    }

    function active(ele) {
        ele.forEach(function (e) {
            e.classList.remove('active');
        })
    }
    function current(ele) {
        ele.forEach(function (e) {
            e.classList.remove('current');
        })
    }