import tseslint from "typescript-eslint";
import type { ConfigArray, ConfigWithExtends } from "typescript-eslint";

/**
 * Base TypeScript ESLint config for OrqaStudio projects.
 *
 * Includes:
 * - typescript-eslint recommended rules
 * - Strict no-any enforcement
 * - Ban on @ts-ignore / @ts-expect-error without description
 * - Unused vars configured to allow underscore-prefixed params
 *
 * Usage:
 * ```js
 * import { base } from "@orqastudio/eslint-config";
 * export default [...base];
 * ```
 */
export const base: ConfigArray = tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      // No any types — strict enforcement
      "@typescript-eslint/no-explicit-any": "error",

      // Ban @ts-ignore entirely; allow @ts-expect-error only with a description
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": true,
          "ts-expect-error": "allow-with-description",
          "ts-nocheck": true,
          "ts-check": false,
        },
      ],

      // Allow unused vars when prefixed with underscore
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    // Relax unused-vars in test files
    files: ["**/*.test.ts", "**/*.test.js", "**/__tests__/**"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);

/**
 * Svelte 5 ESLint config for OrqaStudio projects.
 *
 * Extends the base config with Svelte-specific rules.
 * Requires `eslint-plugin-svelte` as a peer dependency in the consuming project.
 *
 * Includes:
 * - All base TypeScript rules
 * - Svelte flat/recommended rules (consumer must import eslint-plugin-svelte)
 * - TypeScript parser for .svelte files
 * - no-explicit-any enforced in .svelte and .svelte.ts files
 * - Relaxed unused-vars in test files
 *
 * Usage:
 * ```js
 * import { svelte } from "@orqastudio/eslint-config";
 * import sveltePlugin from "eslint-plugin-svelte";
 * export default [...svelte(sveltePlugin)];
 * ```
 */
export function svelte(
  sveltePlugin: {
    configs: Record<string, ConfigWithExtends[]>;
  },
): ConfigArray {
  return tseslint.config(
    ...base,
    ...sveltePlugin.configs["flat/recommended"],
    {
      files: ["**/*.svelte", "**/*.svelte.ts"],
      languageOptions: {
        parserOptions: {
          parser: tseslint.parser,
        },
      },
      rules: {
        // Enforce no-any in Svelte files too
        "@typescript-eslint/no-explicit-any": "error",
      },
    },
    {
      files: ["**/*.test.ts", "**/*.test.js", "**/__tests__/**"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  );
}

/**
 * Recommended config — currently identical to base.
 * Reserved for future additions beyond strict TypeScript.
 *
 * Usage:
 * ```js
 * import { recommended } from "@orqastudio/eslint-config";
 * export default [...recommended];
 * ```
 */
export const recommended: ConfigArray = base;
