import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/offline-msw.html", () => {
    return new HttpResponse("good job!", { status: 200 });
  }),
];
