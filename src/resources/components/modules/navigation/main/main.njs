<ul class="main-menu">
  <li class="main-menu__item">
    <a href="/" class="main-menu__link{% if path == '/' %} main-menu__link--active{% endif %}" title="Home">Home</a>
  </li>
  <li class="main-menu__item">
    <a href="/pen" class="main-menu__link{% if path == '/pen' %} main-menu__link--active{% endif %}" title="Pens">Pens</a>
  </li>
  {% if authentication.authenticated %}
  <li class="main-menu__item">
    <a href="/logout" class="main-menu__link{% if path == '/logout' %} main-menu__link--active{% endif %}" title="Log out">Log out</a>
  </li>
  {% else %}
  <li class="main-menu__item">
    <a href="/login" class="main-menu__link" title="Log in">Log in</a>
  </li>
  {% endif %}
</ul>
