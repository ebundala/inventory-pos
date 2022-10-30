/**
 * ts-to-zod configuration.
 *
 * @type {import("ts-to-zod").TsToZodConfig}
 */
module.exports = [
  {
    name: "ts-to-zod.config",
    input: "src/core/tenant/index.ts",
    output: "src/core/tenant/index.zod.ts",
  },
  {
    name: "ts-to-zod.config",
    input: "src/core/company/index.ts",
    output: "src/core/company/index.zod.ts",
  },
];
