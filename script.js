const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const groundY = 370;//プレーヤーのY座標
const playerPadding = 5; // キャラの端を少し余白にする
const obstaclePadding = 20; // 障害物の端を少し余白にする


let player = { x: 100, y: groundY - 100, width: 100, height: 100, dy: 0, gravity: 0.5, jump: -13 };
let obstacles = [];
let gameSpeed = 5;
let score = 0;
let imagesLoaded = 0; // 必ず宣言する
let animationId;
let isGameOver = false;
let highScore = localStorage.getItem('highScore') || 0;

const playerImg = new Image();
const boarImg = new Image();

let gameStarted = false;

function checkStart() {
  imagesLoaded++;
  if (imagesLoaded === 2 && !gameStarted) {
    gameStarted = true;
    createObstacle(); // 初回障害物生成
    gameLoop();       // ゲーム開始
  }
}
// onloadを先に設定してから srcを代入
playerImg.onload = checkStart;
boarImg.onload = checkStart;

playerImg.src = "player.png";
boarImg.src = "boar.png";

function createObstacle() {
    if (isGameOver) return; // ゲームオーバーなら生成中止

    const width = 80;
    const height = 80;
    obstacles.push({ x: canvas.width, y: groundY - height, width: width, height: height });

  // 次の障害物をランダム時間で生成
  const nextTime = 1000
  setTimeout(createObstacle, nextTime);
}


function gameLoop() {
    if (isGameOver) return; // ゲームオーバーなら何もしない

  // 背景
ctx.fillStyle = '#fdeac1';
ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 地面
ctx.fillStyle = '#ffbb28';
ctx.fillRect(0, groundY, canvas.width, 50);
  // プレイヤーの物理計算
player.dy += player.gravity;
player.y += player.dy;

//地面に着地
if (player.y + player.height > groundY) {
  player.y = groundY - player.height;
  player.dy = 0;
}
 
  // プレイヤー描画（画像で）
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // 障害物の更新と描画
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= gameSpeed;
    ctx.drawImage(boarImg, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

// 衝突判定
if (
  player.x + playerPadding < obstacles[i].x + obstacles[i].width - obstaclePadding &&
  player.x + player.width - playerPadding > obstacles[i].x + obstaclePadding &&
  player.y + playerPadding < obstacles[i].y + obstacles[i].height - obstaclePadding &&
  player.y + player.height - playerPadding > obstacles[i].y + obstaclePadding
  ) {
   // GAME OVER
      ctx.fillStyle = "red";
      ctx.font = "60px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
      ctx.fillStyle = "#00ffff";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("space or tap to replay", canvas.width / 2, canvas.height / 1.5);
     
      ctx.fillStyle = 'black';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText("Score: " + score, canvas.width / 2, canvas.height - 20);

      ctx.fillStyle = '#20ff20';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText("High Score: " + highScore, canvas.width / 2, canvas.height - 50);
        
    

      isGameOver = true;          // ゲームオーバーフラグ
      return;                     // ループを止める

   }

    // 画面外に行った障害物削除＆スコア加算
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
      // ハイスコア更新
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // 保存
        //スコア表示

    
    }
    }
  }
//スコア表示
ctx.fillStyle = 'black';
ctx.font = '24px Arial';
ctx.textAlign = 'center';
ctx.fillText("Score: " + score, canvas.width / 2, canvas.height - 20);

ctx.fillStyle = '#20ff20';
ctx.font = '20px Arial';
ctx.textAlign = 'center';
ctx.fillText("High Score: " + highScore, canvas.width / 2, canvas.height - 50);
 

  animationId = requestAnimationFrame(gameLoop);



}
document.addEventListener('keydown', (e) => {
    if (!isGameOver && e.code === 'Space' && player.y + player.height === groundY) {
        player.dy = player.jump; // ジャンプ
    } else if (isGameOver) {
        location.reload(); // ゲームオーバーなら再読み込み
    }
});

document.addEventListener('touchstart', (e) => {
    if (!isGameOver && player.y + player.height === groundY) {
        player.dy = player.jump; // ジャンプ
    } else if (isGameOver) {
        location.reload(); // ゲームオーバーなら再読み込み
    }
});
