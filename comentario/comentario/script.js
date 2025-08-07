// Função chamada ao clicar em "Enviar"
function criarComentario() {
  const input = document.getElementById("campoComentario"); // Pega o input
  const texto = input.value.trim(); // Remove espaços

  if (texto === "") {
    alert("Por favor, digite um comentário.");
    return;
  }

  const lista = document.getElementById("comentarios"); // Área onde os comentários vão

  // Cria o bloco do comentário
  const comentarioDiv = document.createElement("div");
  comentarioDiv.className = "comentario";

  // Texto do comentário
  const spanTexto = document.createElement("span");
  spanTexto.textContent = texto;

  // Botão de editar
  const btnEditar = document.createElement("button");
  btnEditar.textContent = "Editar";
  btnEditar.onclick = function () {
    const novoTexto = prompt("Editar comentário:", spanTexto.textContent);
    if (novoTexto !== null && novoTexto.trim() !== "") {
      spanTexto.textContent = novoTexto.trim();
    }
  };

  // Botão de remover
  const btnRemover = document.createElement("button");
  btnRemover.textContent = "Remover";
  btnRemover.onclick = function () {
    lista.removeChild(comentarioDiv);
  };

  // Adiciona tudo dentro da div de comentário
  comentarioDiv.appendChild(spanTexto);
  comentarioDiv.appendChild(btnEditar);
  comentarioDiv.appendChild(btnRemover);

  // Adiciona o comentário à lista
  lista.appendChild(comentarioDiv);

  // Limpa o campo de texto
  input.value = "";
}
