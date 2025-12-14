document.getElementById("contactForm")?.addEventListener("submit", function(e){
  e.preventDefault();
  alert("Merci, votre demande a été envoyée !");
  this.reset();
});
