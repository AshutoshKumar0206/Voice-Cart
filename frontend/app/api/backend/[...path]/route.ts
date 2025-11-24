import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: any }) {
  return proxyRequest(req, params);
}
export async function POST(req: NextRequest, { params }: { params: any }) {
  return proxyRequest(req, params);
}
export async function PUT(req: NextRequest, { params }: { params: any }) {
  return proxyRequest(req, params);
}
export async function DELETE(req: NextRequest, { params }: { params: any }) {
  return proxyRequest(req, params);
}

interface NodeFetchInit extends RequestInit {
  duplex?: "half";
}

async function proxyRequest(req: NextRequest, params: any) {
  const param = await params;
  const endpoint = param.path.join("/");

  // Copy headers
  const headers = new Headers(req.headers);
  headers.delete("host");

  // Don't force content-type — this is IMPORTANT
  // let browser decide! (multipart, json, etc)
  if (headers.get("content-type")?.startsWith("multipart/form-data")) {
    headers.delete("content-type");
  }

  // console.log(
  //   "Proxying to:",
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`
  // );
  // console.log("Request Method:", req.method);
  // console.log("Is multipart:", req.headers.get("content-type"));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
    {
      method: req.method,
      headers,
      body: req.method === "GET" ? undefined : req.body,
      duplex: "half"
    } as NodeFetchInit
  );

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      "Set-Cookie": res.headers.get("Set-Cookie") ?? "",
    },
  });
}
