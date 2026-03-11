function verificarNota(){

let nota = Number(document.getElementById("nota").value)
let resultado = document.getElementById("resultado")

if(nota === 10){
resultado.innerText = "🏆 Perfeito! Nota 10! Parabéns aluno!"
}

else if(nota >= 7){
resultado.innerText = "✅ Aprovado!"
}

else if(nota >= 4){
resultado.innerText = "⚠️ Recuperação!"
}

else{
resultado.innerText = "❌ Reprovado!"
}

}