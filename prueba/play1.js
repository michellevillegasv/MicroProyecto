let user_name= document.getElementById("get_user");

class Memoret {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
    }

    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countdown);
        document.getElementById('game-over-text').classList.add('visible');
        let puntuacion_tiempo=this.timeRemaining;
        let puntuacion_total=1000*(puntuacion_tiempo/this.totalTime);
        save_data((user_name.value),puntuacion_total);
        read_data();
    }
    victory() {
        clearInterval(this.countdown);
        document.getElementById('game-over-text').classList.add('visible');
        let puntuacion_tiempo=this.timeRemaining;
        let puntuacion_total=Math.round(1000*(puntuacion_tiempo/this.totalTime));
        save_data((user_name.value),puntuacion_total);
        read_data();
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    shuffleCards(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }
    getCardType(card) {
        return card.getElementsByClassName('card_value')[0].src;
    }
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    start();
}



function show_start(){
    let user_box=document.querySelector(".control-buttons");
    user_box.style.display="block"
}
let overlays = Array.from(document.getElementsByClassName('overlay-text'));
overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
        location.reload();
    });
});




function start() {
    show_start();
    var btn= document.getElementById("btn");
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new Memoret(180, cards);

    btn.addEventListener("click", valid,true)
    function valid(){
        if((user_name.value).length==0){
            alert("CAMPO VACÍO")
        }else{
            game.startGame();
            document.querySelector(".control-buttons").remove();
        }   
    }

    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

function save(players,name_user,score_user){
    players.push({userName: name_user, puntuationMax: score_user});
    localStorage.setItem("players", JSON.stringify(players));
}

function ordenarAsc(players, points) {
    players.sort(function (a, b) {
       return a[points] > b[points];
    });
 }

function save_data(name_user,score_user){
    let se_repite=false;
    let players=JSON.parse(localStorage.getItem("players"));
    console.log(players);
    for(i=0; i<players.length; i++){
        if(players[i].userName==name_user){
            if(score_user>players[i].puntuationMax){
                players[i].puntuationMax=score_user;
            }
            se_repite=true;
        } 
    }
    if(se_repite==false){
        save(players,name_user,score_user);
    }

    let players_organize=ordenarAsc(players,puntuationMax);
    
    localStorage.setItem("players",JSON.stringify(players_organize));
    
    
}

function crear_table(players){
    let string_tabla="<tr><th>Usuario</th><th>Puntuacion</th></tr>"
    for(let user of players){
        let fila="<tr> <td>"
        fila+=user.userName;
        fila+= "</td>"

        fila+="<td>"
        fila+=user.puntuationMax;
        fila+= "</td>"

        fila+="</tr>";
        string_tabla+=fila;
    }

    return string_tabla;

}
function read_data(){
    let players=JSON.parse(localStorage.getItem("players"));
    let table=crear_table(players)
    document.getElementById("table_puntuation").innerHTML=table;
}
