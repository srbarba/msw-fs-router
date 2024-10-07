import { HttpResponse } from "msw";
import { defineMswHandler } from "../../src/index";

export default defineMswHandler(({ request }) => {
  return HttpResponse.json(request.method);
});
