{% extends "layouts/default.njs" %}

{% block pageTitle %}Pens{% endblock %}

{% block content %}
<ul>
{% for pen in pens %}
  <li>{{ pen.user }}: {{ pen.gist }}</li>
{% endfor %}
</ul>
{% endblock %}
