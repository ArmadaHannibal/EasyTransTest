import { NextResponse } from "next/server";
import { getCars, createCar } from "@/services/carRentals.service";

export async function GET() {
  try {
    const cars = await getCars();
    return NextResponse.json(cars);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const car = await createCar(body);
    return NextResponse.json(car, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
