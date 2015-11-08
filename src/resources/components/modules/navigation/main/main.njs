<ul class="main-menu">
  <li class="main-menu__item{% if path == '/' %} active{% endif %}class="><a href="/" title="Home">Home</a></li>
  <li class="main-menu__item{% if path == '/pen' %} active{% endif %}"><a href="/pen" title="Pens">Pens</a></li>
  {% if authentication.authenticated %}
  <li class="main-menu__item{% if path == '/logout' %} active{% endif %}"><a href="/logout" title="Log out">Log out</a></li>
  {% else %}
  <li class="main-menu__item"><a href="/login" title="Log in">Log in</a></li>
  {% endif %}
</ul>
