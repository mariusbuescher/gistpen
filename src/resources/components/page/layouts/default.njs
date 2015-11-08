<!DOCTYPE html>
<html>
<head>
  <title>gistpen | {% block pageTitle %}{{ pageTitle }}{% endblock %}</title>

  <meta charset="utf-8">

  <link rel="stylesheet" type="text/css" href="{{ assetPath( 'main.css' ) }}" />
</head>
<body>

  <nav class="main-navigation">
  {% block mainNavigation %}
    {% include "modules/navigation/main/main.njs" %}
  {% endblock %}
  </nav>

  <main class="main-content">
  {% block content %}
  {% endblock %}
  </main>

</body>
</html>
