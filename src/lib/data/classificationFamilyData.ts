'use server'

import { ClassificationFamilyResponse } from "@/types/classification";
import { KLASS_HOST } from "@/utils/constants";

export const getClassificationFamily = async (id: string, includeCodelists: boolean):Promise<ClassificationFamilyResponse> =>{
  const data = await fetch(`${KLASS_HOST}classificationfamilies/${id}?includeCodelists=${includeCodelists}`);
  return data.json();
}