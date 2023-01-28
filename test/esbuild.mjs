import * as esbuild from "esbuild";
import cssPlugin from "../index.js";

const OUT_DIR = "test";
const JS_FROM = "test/main.js";
const CSS_FROM = "test/index.scss";

let ctx = await esbuild.context({
  entryPoints: [JS_FROM],
  bundle: true,
  minify: true,
  plugins: [cssPlugin({ outDir: `${OUT_DIR}/css`, from: CSS_FROM })],
  legalComments: "none",
  outdir: `${OUT_DIR}/js`,
  pure: ["console"],
});

await ctx.watch();
