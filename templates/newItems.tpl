<!doctype html>

<html lang="fr">
<head>
  <meta charset="utf-8">

  <style type="text/css">
  h1, h2, h3, p, div {
    margin: 0;
    padding: 0;
  }
  h1, p {
    margin-bottom: 10px;
  }
  .lbc-items {
    border-top: 1px solid #AAAAAA;
    border-left: 1px solid #AAAAAA;
    border-right: 1px solid #AAAAAA;
  }

  .lbc-item {
    position: relative;
    height: 120px;
    padding: 10px;
    border-bottom: 1px solid #AAAAAA;
  }
  .lbc-picture {
    height: 120px;
    float: left;
  }
  .lbc-description {
    height: 120px;
    float: left;
    padding-left: 10px;
  }

  .lbc-date {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
  </style>
</head>

<body>

<h1>La Bonne Alerte</h1>

<p>
  Voici les nouvelles annonces parues sur leboncoin.
</p>

<div class="lbc-items">
  {{#each items}}
  <div class="lbc-item">
    <div class="lbc-picture">
      {{#if imageUrl}}
      <img
        alt="test"
        src="{{imageUrl}}"
        />
      {{/if}}
    </div>
    <div class="lbc-description">
      <h2>{{name}}</h2>
      <p>{{location}}</p>
      <p>{{price}}</p>
      <p>
        <a href="{{href}}">{{href}}</a>
      </p>
      <aside class="lbc-date">date</aside>
    </div>
  </div>
  {{/each}}
</div>

</body>
</html>
