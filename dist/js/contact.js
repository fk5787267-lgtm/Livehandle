// Contact page. Front-end validation only. Replace the timeout with a POST to your form handler.
(function () {
  var form = document.getElementById('ct-form');
  if (!form) return;
  var out = document.getElementById('ct-result');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var type = form.type.value;
    var subject = form.subject.value.trim();
    var message = form.message.value.trim();

    if (!name) return window.HS.setMsg(out, 'Please enter your name.', true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return window.HS.setMsg(out, 'Enter a valid email address.', true);
    if (!type) return window.HS.setMsg(out, 'Choose an inquiry type.', true);
    if (message.length < 10) return window.HS.setMsg(out, 'Write a little more detail in the message (10+ characters).', true);

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    window.HS.setMsg(out, 'Sending…');
    setTimeout(function () {
      btn.disabled = false;
      form.reset();
      window.HS.setMsg(out, 'Thanks! This demo form does not send yet. Connect your form handler to receive inquiries.');
      out.classList.add('ok');
    }, 500);
    void subject;
  });
})();
