import { HttpResponse } from "msw";
import { defineMswHandler } from "../../../src/index";

export default defineMswHandler(({ params }) => {
  return HttpResponse.json(params.id);
});
