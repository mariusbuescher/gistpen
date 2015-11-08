{% extends "page/layouts/default.njs" %}

{% block pageTitle %}Home{% endblock %}

{% block mainNavigation %}
  {% include "modules/navigation/main/main.njs" %}
{% endblock %}

{% block content %}
  {% if authentication.authenticated %}
  <p>Hello {{ authentication.username }}!</p>
  {% else %}
  <p>Hello!</p>
  {% endif %}
{% endblock %}
