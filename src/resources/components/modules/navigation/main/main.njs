<ul>
  <li {% if path == '/' %}class="active"{% endif %}><a href="/" title="Home">Home</a></li>
  <li {% if path == '/pen' %}class="active"{% endif %}><a href="/pen" title="Pens">Pens</a></li>
  {% if authenticationpen.authenticated %}
  <li {% if path == '/' %}class="active"{% endif %}><a href="/logout" title="Log out">Log out</a></li>
  {% else %}
  <li><a href="/login" title="Log in">Log in</a></li>
  {% endif %}
</ul>
