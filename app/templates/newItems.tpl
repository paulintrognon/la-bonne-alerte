<!doctype html>

<head>
  <meta charset="utf-8">
</head>

<body>

<h1>La Bonne Alerte</h1>

<p>
  Voici les nouvelles annonces parues sur leboncoin.
  <a href="{{searchUrl}}">Voir la recherche originale</a>
</p>

<table style="border-collapse: collapse;border: 1px solid #AAAAAA;">
  {{#each items}}
  <tr>
    <td style="height: 120px;min-width: 160px;padding-left: 10px;padding-top: 10px;">
      {{#if imageUrl}}
      <img
        alt="{{name}}"
        src="{{imageUrl}}"
        />
      {{/if}}
    </td>
    <td style="height: 120px;padding-left: 10px;">
      <h2>
        <a href="{{href}}">{{name}}</a>
      </h2>
      <p>{{location}}</p>
      <p>{{price}} - {{date}}</p>
    </td>
    <tr style="border-bottom: 5px solid #AAAAAA;">
      <td colspan="2" style="height: 120px;padding-left: 10px;padding-bottom:20px;">
        {{#if images.length}}
        <p>
          {{#each images as |image|}}
          <img
            style="height:120px;"
            alt="miniature"
            src="{{image}}"
            />
          {{/each}}
        </p>
        {{/if}}
        <p>
          {{{description}}}
        </p>
        <ul style="list-style-type: disc;">
          {{#each extra}}
          <li style="float: left;padding-right:30px;"><b>{{property}}:</b> {{value}}</li>
          {{/each}}
        </ul>
      </td>
    </tr>
  </tr>
  {{/each}}
</table>

</body>
</html>
