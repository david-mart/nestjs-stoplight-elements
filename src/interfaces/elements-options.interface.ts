export interface StoplightElementsOptions {
  /** Helps when using router: 'history' but docs are in a subdirectory like https://example.com/docs/api. */
  basePath?: string;
  /** Pass "true" to filter out any content which has been marked as internal with x - internal. */
  hideInternal?: boolean;
  /** Pass true to hide the ["Try It" feature](https://docs.stoplight.io/docs/platform/ZG9jOjM2OTM3Mjky-try-it) */
  hideTryIt?: boolean;
  /** Pass true to hide the schemas in the Table of Contents, when using the sidebar layout. */
  hideSchemas?: boolean;
  /** Pass true to hide the Export button on overview section of the documentation. */
  hideExport?: boolean;
  /** Pass the URL of a CORS proxy used to send requests to TryIt.The provided url is prepended to the URL of an actual request. */
  tryItCorsProxy?: string;
  /** There are two layouts for Elements:
   * `sidebar` - (default) Three-column design.
   * `stacked` - Everything in a single column, making integrations with existing websites that have their own sidebar or other columns already.
   */
  layout?: 'sidebar' | 'stacked';
  /** URL to an image that will show as a small square logo next to the title, above the table of contents. */
  logo?: string;
  /**
   * Determines how navigation should work:
   * `hash` - (default) uses the hash portion of the URL (i.e. window.location.hash) to keep the UI in sync with the URL.
   * `history` -  uses the HTML5 history API to keep the UI in sync with the URL.
   * `memory` - keeps the history of your "URL" in memory (does not read or write to the address bar).
   * `static` - renders using the StaticRouter which can help rendering pages on the server.
   */
  router?: 'history' | 'hash' | 'memory' | 'static';
}
