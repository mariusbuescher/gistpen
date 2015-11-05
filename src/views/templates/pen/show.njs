{% extends "layouts/default.njs" %}

{% block pageTitle %}Pen {{ pen.title }}{% endblock %}

{% block content %}
  <h1>{{ pen.title }}</h1>
  <h2>By {{ pen.author }}</h2>
  <p>Files:</p>
  <ul>
  {% for filename, contents in pen.files %}
    <li>{{ filename }}</li>
  {% endfor %}
  </ul>
{% endblock %}
