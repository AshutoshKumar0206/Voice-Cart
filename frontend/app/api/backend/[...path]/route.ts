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

async function proxyRequest(req: NextRequest, params: any) {
  const param = await params;
  const endpoint = param.path.join("/");
  console.log(endpoint)

  const body = req.method === "GET" ? undefined : await req.text();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "Cookie": req.headers.get("cookie") ?? "",
    },
    body,
  });

  const responseText = await res.text();
  return new NextResponse(responseText, {
    status: res.status,
    headers: {
      "Set-Cookie": res.headers.get("Set-Cookie") ?? "",
    }
  });
}
