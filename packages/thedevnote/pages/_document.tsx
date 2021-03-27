import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <script
          dangerouslySetInnerHTML={{
            __html: `<script type="text/javascript">
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('service-worker.js').then(function (registration) {
                    console.log('Worker registration successful', registration.scope);
                  }, function (err) {
                    console.log('Worker registration failed', err);
                  }).catch(function (err) {
                    console.log(err);
                  });
                });
              } else {
                console.log('Service Worker is not supported by browser.');
              }
           </script>`,
          }}
        ></script>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
