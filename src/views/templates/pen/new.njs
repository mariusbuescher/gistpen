{% extends "layouts/default.njs" %}

{% block pageTitle %}New Pen{% endblock %}

{% block content %}
<form action="/pen" method="POST">
  <input name="title" placeholder="Title">
  <button type="submit">Create pen</button>
</form>
{% endblock %}
