
const titulo = document.getElementById("titulo");
const texto = document.getElementById("texto");
const imagem = document.getElementById("imagem");


document.getElementById("btnPerfil").addEventListener("click", () => {
  titulo.textContent = "Perfil";
  texto.textContent = "Sou um desenvolvedor apaixonado por tecnologia e design.";
  imagem.src = "img/img1.jpg";
});

document.getElementById("btnProjeto").addEventListener("click", () => {
  titulo.textContent = "Projeto";
  texto.textContent = "Este é um projeto de exemplo para praticar HTML, CSS e JavaScript.";
  imagem.src = "img/img2.jpg";
});

document.getElementById("btnContato").addEventListener("click", () => {
  titulo.textContent = "Contato";
  texto.textContent = "Entre em contato pelo e-mail: exemplo@dominio.com.";
  imagem.src = "img/img3.jpg";
});
