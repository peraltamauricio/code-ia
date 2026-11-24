// Vista previa compartida por el Editor en vivo y los Retos.
// El código del alumno corre adentro de un iframe aislado (sandbox).

export type LogLine = { kind: "log" | "error"; text: string };

// Este pedacito se mete adentro de la vista previa para:
//  - mandarnos los console.log y los errores (mini consola),
//  - contestar las "misiones" de los retos (el reto manda pruebas y la página las evalúa),
//  - ofrecer dos ayudas para esas pruebas: __js() (el JavaScript del alumno) y
//    __rule(texto, regex) (¿hay una regla de CSS que lo tenga?).
const BRIDGE = `<script>
(function(){
  function send(kind, args){
    parent.postMessage({ codeia: true, kind: kind, text: Array.from(args).map(function(a){
      try { return typeof a === "object" ? JSON.stringify(a) : String(a); } catch(e) { return String(a); }
    }).join(" ") }, "*");
  }
  var log = console.log;
  console.log = function(){ send("log", arguments); log.apply(console, arguments); };
  window.onerror = function(msg, src, line){ var l = line - __OFFSET__; send("error", [(l > 0 ? "Error en script.js, línea " + l : "Error") + ": " + msg]); };

  // El JavaScript del alumno SIN comentarios (así las ayudas escritas en comentarios no cuentan).
  window.__js = function(){
    var s = document.scripts;
    var t = s[s.length - 1].textContent;
    return t.replace(/\\/\\*[\\s\\S]*?\\*\\//g, "").replace(/(^|[^:])\\/\\/.*$/gm, "$1");
  };
  window.__rule = function(sel, re){
    function walk(rules){
      for (var i = 0; i < rules.length; i++) {
        var r = rules[i];
        var name = r.selectorText || (r.conditionText !== undefined ? "@media " + r.conditionText : "");
        if (name.indexOf(sel) >= 0 && re.test(r.cssText)) return true;
        if (r.cssRules && walk(r.cssRules)) return true;
      }
      return false;
    }
    try {
      for (var k = 0; k < document.styleSheets.length; k++) {
        if (walk(document.styleSheets[k].cssRules)) return true;
      }
    } catch (e) {}
    return false;
  };

  window.addEventListener("message", function(e){
    var d = e.data;
    if (!d || !d.codeiaCheck) return;
    var results = d.tests.map(function(t){ try { return !!(0, eval)(t); } catch (err) { return false; } });
    parent.postMessage({ codeia: true, kind: "checks", id: d.id, results: results }, "*");
  });
})();
<\/script>`;

export function buildDoc(html: string, css: string, js: string, withBridge: boolean) {
  const before = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi página</title>
  <style>
${css}
  </style>
${withBridge ? BRIDGE : ""}
</head>
<body>
${html}
  <script>
`;
  // Cuántas líneas hay antes del JS del alumno, para que el error diga la línea de SU script.js.
  const offset = before.split("\n").length - 1;
  return (
    before.replace("__OFFSET__", String(offset)) +
    `${js}
  </script>
</body>
</html>`
  );
}

export function downloadDoc(html: string, css: string, js: string) {
  const blob = new Blob([buildDoc(html, css, js, false)], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "index.html";
  a.click();
  URL.revokeObjectURL(url);
}
