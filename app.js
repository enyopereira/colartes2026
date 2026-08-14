document.addEventListener("DOMContentLoaded", () => {
  const botaoIniciar = document.getElementById("botaoIniciar");

  setTimeout(() => {
    botaoIniciar.style.display = "block";
    botaoIniciar.focus();
  }, 7000);

  botaoIniciar.addEventListener("click", () => {
    botaoIniciar.style.display = "none";
  });
});
