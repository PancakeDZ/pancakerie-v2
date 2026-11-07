
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    // Fichiers générés
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Sauvegardes et anciennes copies
    "sauvegarde/**",
    "page.tsx",
  ]),
]);

export default eslintConfig;
