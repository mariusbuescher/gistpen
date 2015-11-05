{% extends "layouts/default.njs" %}

{% block pageTitle %}Gist {{ gist.id }}{% endblock %}

{% block content %}
  <h1>Gist {{ gist.id }}</h1>
  <h2>{{ gist.description }}</h2>
  <p>Files:</p>
  <ul>
  {% for filename, contents in gist.files %}
    <li>{{ filename }}</li>
  {% endfor %}
  </ul>
{% endblock %}
