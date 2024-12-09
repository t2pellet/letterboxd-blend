import { Request } from "express";
import { matchedData } from "express-validator";

function getData<T extends object>(req: Request): T {
  return matchedData<T>(req);
}

export default getData;
export { getData };
