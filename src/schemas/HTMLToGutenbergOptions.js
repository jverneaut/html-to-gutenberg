import { z } from "zod";

export const OptionsSchema = z.object({
  inputDirectory: z.string().nonempty("inputDirectory is required"),
  outputDirectory: z.string().optional(),

  engine: z.enum(["php", "twig", "all"]).default("php"),
  removeDeletedBlocks: z.boolean().optional(),

  defaultNamespace: z.string().default("custom"),
  defaultCategory: z.string().default("theme"),
  defaultIcon: z.string().optional(),
  defaultVersion: z.string().default("0.1.0"),
});

/**
 * @typedef {z.infer<typeof OptionsSchema>} HTMLToGutenbergOptions
 */
export const /** @type {typeof OptionsSchema} */ _typedSchema = OptionsSchema;
