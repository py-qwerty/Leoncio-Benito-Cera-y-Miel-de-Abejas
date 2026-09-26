# Leoncio Benito y Compañía

Sitio de la empresa Leoncio Benito y Compañía, dedicada al comercio y
procesado de miel y cera cubanas desde 1923. Incluye su historia y archivo
documental.

La investigación de fuentes externas, imágenes históricas, créditos y límites
de atribución está en [INVESTIGACION_CONTEXTO.md](INVESTIGACION_CONTEXTO.md).

## Vista previa local

Desde la raíz del proyecto, ejecuta `python3 dev_server.py` y abre
<http://localhost:8765>. El navegador se recarga automáticamente al cambiar
las páginas, la hoja de estilos o las imágenes.

La interacción está en `site.js`, cargado en todas las páginas. Incluye la
abeja animada: una recreación en SVG de la abeja del logotipo que sale del logo
y se posa en titulares, fotografías, botones y finales de párrafo a medida que
se hace scroll, y vuelve al logo al subir arriba del todo. Con la preferencia
del sistema «Reducir movimiento» vuela más despacio y solo cambia de sitio al
hacer scroll. Si el navegador no mantiene unos 42 fps, o el equipo es
muy modesto, `site.js` pasa a un modo ligero: quita efectos caros y, si
hace falta, dibuja la abeja a 30 fps. Para ver su estado en la consola, añade `?beedebug` a la URL y
consulta `window.__bee`.

Las páginas principales son `index.html`, `empresa/index.html`,
`historial/index.html`, `documentos/index.html` y
`historial/expo-1958/index.html`.

El favicon y la vista previa al compartir usan la abeja de la marca en
`assets/marca/`. Las etiquetas Open Graph y Twitter de las cinco páginas
apuntan a la URL prevista de GitHub Pages
(`https://py-qwerty.github.io/Leoncio-Benito-Cera-y-Miel-de-Abejas/`). Si se
publica con otro dominio o nombre de repositorio, hay que actualizar las URL
absolutas de `canonical`, `og:url`, `og:image` y `twitter:image`.

Los escaneos y PDF del archivo están en `assets/documentos/`. Proceden de las
carpetas documentales originales situadas junto a este repositorio; se conservan
con nombres breves para su uso en la web. Las fechas y resúmenes de la cronología
se basan en las transcripciones de esas carpetas.

La letra de cambio se muestra en `assets/documentos/letra-de-cambio-reconstruida-ia.png`,
una reconstrucción con IA generada a partir del escaneo para hacer visibles más
detalles. El margen exterior es transparente. Puede diferir del documento en trazos pequeños o letras ambiguas. La
imagen escaneada original (`letra-de-cambio.jpg`) y el PDF original se conservan
y están enlazados desde la página de documentos para consulta y comparación.

La descripción de la actividad desde 1923, la planta de San Ramón 206, las
provincias proveedoras y la red comercial procede del relato familiar aportado
para la web. Los nombres y ciudades de casas y agentes reflejan las correcciones
aportadas por la familia. Se publican las claves telegráficas que esta ha
facilitado; las direcciones postales quedan pendientes de cotejo con los originales.

La sección bancaria distingue entre pruebas del archivo y el relato familiar.
Los formularios de cheques de Camagüey son muestras sin datos de pago; la carta
de 1934 menciona expresamente a The Royal Bank of Canada y Guaranty Trust
Company. La grafía de Deutsch-Südamerikanische Bank AG se comprobó en la
[Deutsche Digitale Bibliothek](https://www.deutsche-digitale-bibliothek.de/item/OYG7QQ476GQKEHFSUYUQUXKNZGKUZVR5).
La existencia de esa entidad está documentada, pero su vínculo concreto con la
empresa procede del relato familiar. Los cambios de nombre de National City
Bank y Chase se contrastaron con las historias publicadas por
[Citi](https://www.citigroup.com/rcs/citigpa/akpublic/storage/public/argentina_2010_spanish.pdf)
y [JPMorganChase](https://www.jpmorganchase.com/about/our-history).

El retrato destacado de Leoncio Benito es una restauración digital en blanco y
negro generada con la herramienta integrada de imagen a partir del escaneo
`assets/expo-1958/fotografia-original-oficina-recortada.jpeg`. El original se
conserva junto a la versión restaurada para consulta y comparación.

La imagen horizontal del despacho en la página de Expo 58 es una restauración
digital en blanco y negro a partir de `assets/expo-1958/fotografia-original-oficina.jpeg`.
La página enlaza la fotografía original para su comparación.

La relación de cuatro navieras y sus contactos en La Habana procede del
directorio inscrito de la empresa, según la información facilitada por el usuario.
Los nombres Holland-America Line, Hamburg-Amerika Linie,
Norddeutscher Lloyd y Compañía Trasatlántica Española se cotejaron con fuentes
históricas enlazadas en la sección de transporte marítimo. Anuncios de época
confirman a R. Dussaq, S. en C. y Luis Clasing como representantes. Los apartados
y claves Cable publicados se atribuyen a ese directorio; no se ha localizado
correspondencia de la firma que identifique qué envíos cursó por cada línea.
