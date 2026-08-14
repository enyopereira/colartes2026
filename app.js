const botaoIniciar = document.getElementById("botaoIniciar");

// Mostra o botão depois de 7 segundos
setTimeout(() => {
  botaoIniciar.style.display = "block";
  botaoIniciar.focus();
}, 7000);

// Ação realizada ao selecionar o botão
botaoIniciar.addEventListener("click", () => {
  botaoIniciar.style.display = "none";

  console.log("Aplicação iniciada");
});
