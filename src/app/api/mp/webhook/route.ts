import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === "payment" && data?.id) {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
      });
      const payment = await mpRes.json();

      if (payment.status === "approved") {
        const memberCode = payment.external_reference as string;
        console.log(`[Webhook MP] Pagamento aprovado para membro ${memberCode}`);
        // Aqui: chamar Supabase para ativar membro quando integrado
        // await supabase.from("members").update({ status: "ativo" }).eq("code", memberCode)
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
