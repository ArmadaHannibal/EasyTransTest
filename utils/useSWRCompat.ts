// utils/useSWRCompat.ts

import * as SWR from "swr";

// ✅ récupère la bonne fonction, peu importe la manière dont SWR exporte
const useSWR: (typeof SWR)["default"] =
  (SWR as any).default || (SWR as any).useSWR;

// ✅ export par défaut et nommé
export default useSWR;
export { useSWR };
