{% extends "page/layouts/default.njs" %}

{% block pageTitle %}Home{% endblock %}

{% block content %}
  {% if authenticated %}
  <p>Hello {{ username }}!</p>
  {% else %}
  <p>Hello!</p>
  {% endif %}
{% endblock %}
