import { ExtractedEntities, ChatSearchParams } from "../types";
import { parseAndNormalize } from "../parser";

export function buildSearchParams(entities: ExtractedEntities): ChatSearchParams {
  return parseAndNormalize(entities);
}
