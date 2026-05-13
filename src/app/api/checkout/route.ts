
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/services/auth.service';
import { createOxaPayInvoice } from '@/services/oxapay.service';
import { PLANS } from '@/lib/constants';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Checkout API (OxaPay)
// ═══════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { planId } = await request.json();
    if (planId !== 'PREMIUM') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const plan = PLANS.PREMIUM;
    
    // Generate Invoice
    const invoice = await createOxaPayInvoice({
      amount: plan.price,
      currency: 'EUR',
      orderId: `SUB_${user.id}_${Date.now()}`,
      description: `Azazel OSINT Premium Subscription - 1 Month`,
      email: user.email,
    });

    if (invoice.status !== 100 && invoice.status !== 1) {
      return NextResponse.json({ 
        error: 'OxaPay API Error', 
        message: invoice.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      payLink: invoice.payLink,
      invoiceId: invoice.invoiceId 
    });

  } catch (error: any) {
    console.error('[Checkout Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
