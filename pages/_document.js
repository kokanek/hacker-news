import Document, { Html, Head, Main, NextScript } from 'next/document'

const siteBehaviourScript = `
(function() {
  try {
    if (window.location && window.location.search && window.location.search.indexOf('capture-sitebehaviour-heatmap') !== -1) {
      sessionStorage.setItem('capture-sitebehaviour-heatmap', '_');
    }

    var sbSiteSecret = 'f052b69d-3e08-4af9-a59e-ab7d34444711';
    window.sitebehaviourTrackingSecret = sbSiteSecret;
    var scriptElement = document.createElement('script');
    scriptElement.defer = true;
    scriptElement.id = 'site-behaviour-script-v2';
    scriptElement.src = 'https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=' + sbSiteSecret;
    document.head.appendChild(scriptElement);
  } catch (e) { console.error(e) }
})();
`

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{ __html: siteBehaviourScript }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
