import type { ReferenceDataType } from "../unionTypes"
import type { ReferenceData } from "./ReferenceData"

 export type ReferenceDataLoadSuccess = {
  data: ReferenceData[], 
  type: ReferenceDataType
}