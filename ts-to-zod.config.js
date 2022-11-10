/**
 * ts-to-zod configuration.
 *
 * @type {import("ts-to-zod").TsToZodConfig}
 */

module.exports=[
  "adjustment","brand","category","company","currency","customer","expense",
  "pos_setting","product","purchase","purchase_return","quotation",
  "sale","sale_return","setting","supplier","tenant","transfer",
  "unit","pos_setting","warehouse"
].map(function(v){
  return {
    name: "ts-to-zod.config",
    input: `src/core/${v}/index.ts`,
    output: `src/core/${v}/index.zod.ts`,
  };
})

//module.exports = models
// [
//   {
//     name: "ts-to-zod.config",
//     input: "src/core/tenant/index.ts",
//     output: "src/core/tenant/index.zod.ts",
//   },
//   {
//     name: "ts-to-zod.config",
//     input: "src/core/company/index.ts",
//     output: "src/core/company/index.zod.ts",
//   },
// ];
