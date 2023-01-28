const sass = require("sass");
const path = require("path");
const postcss = require("postcss");
const cssnano = require("cssnano");
const fs = require("node:fs/promises");
const autoprefixer = require("autoprefixer");

const { writeFile, mkdir } = fs;

const CURRENT_DIR = process.cwd();

const stringFilled = (s) => typeof s === "string" && s.length > 0;

module.exports = (options = {}) => {
  const from = stringFilled(options.from) ? options.from : null;
  const outDir = options.outDir || "out";
  return {
    name: "cssPlugin",
    setup: (build) => {
      build.onStart(async () => {
        await mkdir(outDir, { recursive: true });
      });

      build.onEnd(async (r) => {
        try {
          if (!from) throw new Error(`Must specify 'from' option`);

          const fileName = stringFilled(options.fileName)
            ? options.fileName
            : path.basename(from, path.extname(from));

          const { css } = await sass.compileAsync(`${CURRENT_DIR}/${from}`, {
            style: "compressed",
          });

          const optimized = await postcss([
            cssnano({ plugins: [autoprefixer] }),
          ]).process(css, {
            from: undefined,
          });

          await writeFile(
            `${CURRENT_DIR}/${outDir}/${fileName}.css`,
            `${optimized.css}`
          );
        } catch (e) {
          console.error(e.message);
        }
      });
    },
  };
};
