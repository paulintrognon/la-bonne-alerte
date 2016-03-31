<!doctype html>

<head>
  <meta charset="utf-8">
</head>

<body>

<h1>La Bonne Alerte</h1>

<p>
  Voici les nouvelles annonces parues sur leboncoin.
</p>

<table style="border-collapse: collapse;border-top: 1px solid #AAAAAA;">
  {{#each items}}
  <tr>
    <td style="height: 120px;min-width: 160px;border-bottom: 1px solid #AAAAAA;border-left: 1px solid #AAAAAA;">
      {{#if imageUrl}}
      <img
        alt="{{name}}"
        src="{{imageUrl}}"
        />
      {{/if}}
    </td>
    <td style="height: 120px;padding-left: 10px;border-bottom: 1px solid #AAAAAA;border-right: 1px solid #AAAAAA;">
      <h2>{{name}}</h2>
      <p>{{location}}</p>
      <p>{{price}} - {{date}}</p>
      <p>
        <a href="{{href}}">{{href}}</a>
      </p>
    </td>
  </tr>
  {{/each}}
</table>

</body>
</html>
