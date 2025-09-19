document.querySelectorAll('.social-section li').forEach(li => {
  const file = li.getAttribute('data-icon');
  const anchor = li.querySelector('a');
  
  if (!anchor) return;

  fetch(`/assets/images/graphic/social-icons/${file}.svg`)
    .then(res => res.text())
    .then(svg => {
      anchor.insertAdjacentHTML('afterbegin', svg);
    });
});
