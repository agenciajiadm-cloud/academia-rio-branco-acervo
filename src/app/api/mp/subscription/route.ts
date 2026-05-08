import { NextRequest, NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN ?? "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const { memberCode, memberEmail } = await req.json();

    const subscription = {
      reason: "Mensalidade — Academia de Letras Barão do Rio Branco",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 49.9,
        currency_id: "BRL",
      },
      payer_email: memberEmail,
      back_url: `${BASE_URL}/mensalidade/sucesso?code=${encodeURIComponent(memberCode)}`,
      external_reference: memberCode,
      notification_url: `${BASE_URL}/api/mp/webhook`,
    };

    const res = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(subscription),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ init_point: data.init_point });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
