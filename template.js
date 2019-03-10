function generate(content) {
  var template = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Ellie's Swim Times | Photos</title>
    <link href="https://fonts.googleapis.com/css?family=Mukta|Nunito" rel="stylesheet">
    <link rel="stylesheet" href="node_modules/typeface-quicksand/index.css">
    <link rel="stylesheet" href="node_modules/chartist/dist/chartist.min.css">
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <nav class="nav">
      <div class="nav-left">
        <a href="/">
          <h1>Butterfly Swimmer</h1>
        </a>
      </div>
      <div class="nav-right">
        <span>Swim Photos</span>
        <a href="https://www.teamunify.com/Home.jsp?team=ohlys" target="_blank">LYST Homepage</a>
      </div>
    </nav>
  
    </nav>
    <div class="row">
      ${content}
    </div>
  </body>
  
  </html>`
  return template(content)
}