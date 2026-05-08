import { NextRequest, NextResponse } from "next/server";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN ?? "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const { memberCode, memberEmail } = await req.json();

    const preference = {
      items: [
        {
          id: `mensalidade-${memberCode}`,
          title: "Mensalidade — Academia de Letras Barão do Rio Branco",
          description: `Associado ${memberCode}`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: 49.9,
        },
      ],
      payer: { email: memberEmail },
      back_urls: {
        success: `${BASE_URL}/mensalidade/sucesso?code=${encodeURIComponent(memberCode)}`,
        failure: `${BASE_URL}/mensalidade/falha?code=${encodeURIComponent(memberCode)}`,
        pending: `${BASE_URL}/mensalidade/pendente?code=${encodeURIComponent(memberCode)}`,
      },
      auto_return: "approved",
      external_reference: memberCode,
      notification_url: `${BASE_URL}/api/mp/webhook`,
    };

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
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
