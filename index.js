const draw = document.querySelector('.draw-canvas') 
const clearAll = document.querySelector('.clear')
const save = document.querySelector('.save')
const undo = document.querySelector('.undo')
const redo = document.querySelector('.redo')
const status = document.querySelectorAll('.status')
const selectColor = document.querySelector('.set-color input');
const color = document.querySelectorAll('.set-color div');
const primary = document.querySelector('.primary')
const second = document.querySelector('.second')
const third = document.querySelector('.third')
const brushSize = document.querySelector('.size input')




//初始值
let ctx = draw.getContext('2d');
ctx.strokeStyle = '#fff';
ctx.lineWidth = 10;
ctx.fillStyle = '#000';

let start = [];
let end = [];
let drawArray = []; //儲存每一筆畫座標
let step = -1 //計算步數
let lineWidth = 10;
let lineColor = '#fff';
let canWidth = 1430;
let canHeight = 750; 
let isDraw = true;
let primaryColor = ''
let secondColor = ''
let thirdColor = ''
let pickedColor = ''


//畫圖函式
function canvas(){
  if(draw){
    ctx.beginPath();       // 告知路徑開始
    ctx.moveTo(end[0],end[1]);   // 將起點移動到這個座標
    ctx.lineTo(start[0],start[1]);    // 設定路徑到這個座標
    ctx.strokeStyle = lineColor  // 設定顏色
    ctx.lineWidth = lineWidth     // 設定線條粗細
    ctx.lineCap = 'round'  // 線條前後圓潤
    ctx.stroke()           // 繪製
  }
}
function mouseDown(e){
  start = [e.offsetX, e.offsetY]
  draw.addEventListener('mousemove',move )
  draw.addEventListener('mouseup',mouseUp )
}
function move(e){
  end = [start[0],start[1]]
  start = [e.offsetX,e.offsetY]
  canvas();
}
function mouseUp(){
  step++
  if(step < drawArray.length){
    drawArray.length = step;
  }
  drawArray.push(draw.toDataURL())
  draw.removeEventListener('mousemove',move )
}

//右方功能列函式
function clear(){
  ctx.clearRect(0, 0,canWidth,canHeight)
  step = 0;
  drawArray = [];
}
function saveImg(){
  const dataURL = draw.toDataURL('image/jpeg')
  this.href = dataURL
}
function redoPath(){
  let lastPath = new Image

  if(step < drawArray.length -1) {
    step++
    lastPath.src = drawArray[step]
  ctx.beginPath();
  ctx.clearRect(0, 0,canWidth,canHeight)
  lastPath.onload = () => {
    ctx.drawImage(lastPath, 0, 0)
  }
  }
}
function undoPath(){
  let lastPath = new Image
  
  if(step >= 0) {
  step--
  lastPath.src = drawArray[step]
  ctx.beginPath();
  ctx.clearRect(0, 0,canWidth,canHeight)
  lastPath.onload = () => {
    ctx.drawImage(lastPath, 0, 0)
  }
  }
}

//點選狀態的效果
function changeStatus(e){
  let actStatus = document.querySelectorAll('.status i')
  let colorPick = document.querySelectorAll('.set-color div')
  if(e.target.parentElement.className === 'set-color'){
  for(let i= 0;i<colorPick.length;i++){
    if(colorPick[i].className.indexOf('active') !== -1){
      colorPick[i].classList.remove('active')
    }
  }
  e.target.classList.add('active')
  }else{
      for(let i= 0;i<actStatus.length;i++){
    if(actStatus[i].className.indexOf('active') !== -1){
      actStatus[i].classList.remove('active')
    }
  }
  e.target.classList.add('active')
  }
}
//橡皮擦功能，將畫筆顏色改為和背景相同
function changeAct(e){
  if(e.target.className.indexOf('fa-erase') !== -1){
    isDraw = false
    lineColor = '#000';
  }else{
    isDraw = true
    lineColor = pickedColor
  }
}

//初始顏色設定
function initColor(){
    lineColor = '#ffffff'
    primary.style.backgroundColor = '#ffffff'
    primaryColor = '#ffffff'
    second.style.backgroundColor = rgbToHex(hexToRGB('#fffff'),'20')
    secondColor = rgbToHex(hexToRGB('#fffff'),'20')
    third.style.backgroundColor = rgbToHex(hexToRGB('#fffff'),'40')
    thirdColor = rgbToHex(hexToRGB('#fffff'),'40')
}

//選擇主色設定，並產生主色rgb的g做調整的副色
function pickColor(e){
    color[0].classList.add('active')
    color[1].classList.remove('active')
    color[2].classList.remove('active')
      lineColor = e.target.value
      primary.style.backgroundColor = e.target.value
      primaryColor = e.target.value
      second.style.backgroundColor = rgbToHex(hexToRGB(e.target.value),'20')
      secondColor = rgbToHex(hexToRGB(e.target.value),'20')
      third.style.backgroundColor = rgbToHex(hexToRGB(e.target.value),'40')
      thirdColor = rgbToHex(hexToRGB(e.target.value),'40')
    if(isDraw == false){
      lineColor = '000000'
    }
}

//選擇畫筆顏色
function colorItem(e){
  let pickColorClassName = e.target.className
  if(pickColorClassName.indexOf('primary') !== -1){
    lineColor = primaryColor
    pickedColor = primaryColor
  }
  if(pickColorClassName.indexOf('second') !== -1){
    lineColor = secondColor
    pickedColor = secondColor

  }
  if(pickColorClassName.indexOf('third') !== -1){
    lineColor = thirdColor
    pickedColor = thirdColor
}
}

//更改筆畫大小
function changeSize(e){
  lineWidth = e.target.value
}

//rgb轉hex
function rgbToHex(color,alpha){
  let rgb = color.indexOf(",") > -1 ? "," : " ";
  color = color.substr(4).split(")")[0].split(rgb);
  let r = (+color[0]).toString(16)
  let g = (Number(color[1])+Number(alpha)).toString(16)
  let b = (+color[2]).toString(16)

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

//將hex轉rgba
function hexToRGB(color) {
  let r = 0, g = 0, b = 0;

  // 3 digits
  if (color.length == 4) {
    r = "0x" + color[1] + color[1];
    g = "0x" + color[2] + color[2];
    b = "0x" + color[3] + color[3];

  // 6 digits
  } else if (color.length == 7) {
    r = "0x" + color[1] + color[2];
    g = "0x" + color[3] + color[4];
    b = "0x" + color[5] + color[6];
  }
  
  return "rgb("+ +r + "," + +g + "," + +b + ")";
}


status.forEach(item=>{
  item.addEventListener('click',changeStatus)
  item.addEventListener('click',changeAct)
})
color.forEach(item=>{
  item.addEventListener('click',colorItem)
  item.addEventListener('click',changeStatus)
})
draw.addEventListener('mousedown',mouseDown )
clearAll.addEventListener('click',clear)
save.addEventListener('click',saveImg)
undo.addEventListener('click',undoPath)
redo.addEventListener('click',redoPath)
selectColor.addEventListener('change',pickColor)
brushSize.addEventListener('change',changeSize)
window.addEventListener('load', initColor)


