import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const onlyMachwerk =
    request.nextUrl.pathname === "/project" &&
    params.get("id") === "machwerk" &&
    [...params.keys()].every((key) => key === "id");

  if (onlyMachwerk) {
    const destination = request.nextUrl.clone();
    destination.pathname = "/portfolio/machwerk";
    destination.search = "";
    return NextResponse.redirect(destination, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/project",
};
