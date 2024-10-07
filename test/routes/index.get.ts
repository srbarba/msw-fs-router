import { HttpResponse } from "msw";
import { defineMswHandler } from "../../src/index";

export default defineMswHandler(() => {
  return HttpResponse.json("ok");
});
