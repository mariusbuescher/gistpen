{% extends "page/layouts/default.njs" %}

{% block pageTitle %}Pens{% endblock %}

{% block content %}
<ul>
{% for pen in pens %}
  <li><a href="/pen/{{ pen._id }}">{{ pen.user }}: {{ pen.gist }}</a></li>
{% endfor %}
</ul>
{% endblock %}
