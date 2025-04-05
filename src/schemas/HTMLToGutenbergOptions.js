import { z } from "zod";

export const OptionsSchema = z.object({
  inputDirectory: z.string().nonempty("inputDirectory is required"),
  outputDirectory: z.string().optional(),

  blocksPrefix: z.string().default("custom"),
  engine: z.enum(["php", "twig", "all"]).default("php"),
});
