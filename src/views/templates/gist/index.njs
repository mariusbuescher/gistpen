{% extends "layouts/default.njs" %}

{% block pageTitle %}Your gists{% endblock %}

{% block content %}
  <p>Yout gists</p>
  <ul>
  {% for gist in gists %}
    <li>{{ gist.id }}</li>
  {% endfor %}
  </ul>
{% endblock %}
