// Configurações iniciais (virão da seleção de dificuldade)
let move_speed = parseFloat(localStorage.getItem('move_speed')) || 3;
let gravity = parseFloat(localStorage.getItem('gravity')) || 0.5;

let bird = document.querySelector('.bird');
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

document.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' && game_state != 'Play') {
    document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
    bird.style.top = '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Pontuação: ';
    score_val.innerHTML = '0';
    play();
  }
});

function play() {
  function move() {
    if (game_state != 'Play') return;

    let pipe_sprite = document.querySelectorAll('.pipe_sprite');
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        if (
          bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
          bird_props.left + bird_props.width > pipe_sprite_props.left &&
          bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
          bird_props.top + bird_props.height > pipe_sprite_props.top
        ) {
          endGame();
          return;
        } else {
          if (
            pipe_sprite_props.right < bird_props.left &&
            pipe_sprite_props.right + move_speed >= bird_props.left &&
            element.increase_score == '1'
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
            element.increase_score = '0';

            // Aumentar velocidade a cada 10 pontos
            if (+score_val.innerHTML % 10 === 0) {
              move_speed += 0.5;
            }
          }
          element.style.left = pipe_sprite_props.left - move_speed + 'px';
        }
      }
    });

    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  let bird_dy = 0;
  function apply_gravity() {
    if (game_state != 'Play') return;
    bird_dy += gravity;
    document.addEventListener('keydown', (e) => {
      if (e.key == 'ArrowUp' || e.key == ' ') {
        bird_dy = -7.6;
      }
    });

    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      endGame();
      return;
    }
    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_seperation = 0;
  let pipe_gap = 35;
  function create_pipe() {
    if (game_state != 'Play') return;
    if (pipe_seperation > 115) {
      pipe_seperation = 0;
      let pipe_posi = Math.floor(Math.random() * 43) + 8;

      let pipe_sprite_inv = document.createElement('img');
      pipe_sprite_inv.src = 'img/pipe-top.png';
      pipe_sprite_inv.className = 'pipe_sprite';
      pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
      pipe_sprite_inv.style.left = '100vw';
      document.body.appendChild(pipe_sprite_inv);

      let pipe_sprite = document.createElement('img');
      pipe_sprite.src = 'img/pipe-bottom.png';
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.increase_score = '1';
      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}

function endGame() {
  game_state = 'End';
  message.innerHTML = 'Pressione Enter para reiniciar';
  message.style.left = '20vw';

  // Salvar pontuação
  let currentScore = +score_val.innerHTML;
  highScores.push(currentScore);
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 5);
  localStorage.setItem('highScores', JSON.stringify(highScores));

  console.log('TOP 5:', highScores);
}
