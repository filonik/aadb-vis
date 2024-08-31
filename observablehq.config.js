// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Hypercomplex Numbers",
  head: `
    <script type="text/javascript" src="/scripts/mathjax-config.js" defer></script>
    <script type="text/javascript" id="MathJax-script" defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
    <link rel="stylesheet" type="text/css" href="/components/style.css"></link>`
  ,
  pages: [
    {name: "2-dimensional", path: "/hypercomplex-numbers-2d"},
    {name: "3-dimensional", path: "/hypercomplex-numbers-3d"},
    {name: "4-dimensional", path: "/hypercomplex-numbers-4d"},
  ],
  //style: "style.css",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  // pages: [
  //   {
  //     name: "Examples",
  //     pages: [
  //       {name: "Dashboard", path: "/example-dashboard"},
  //       {name: "Report", path: "/example-report"}
  //     ]
  //   }
  // ],

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // root: "docs", // path to the source root for preview
  // output: "dist", // path to the output root for build
  // search: true, // activate search
};
