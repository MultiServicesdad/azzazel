// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — OxaPay Payment Service
// ═══════════════════════════════════════════════════════════

const OXAPAY_API_URL = 'https://api.oxapay.com/v1/payment/invoice';
const MERCHANT_KEY = process.env.OXAPAY_MERCHANT_KEY || 'MFLATZ-QRKXBF-FTG8YR-PWSXWX';

export interface OxaPayInvoiceRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  returnUrl?: string;
  callbackUrl?: string;
  email?: string;
}

export interface OxaPayInvoiceResponse {
  status: number;
  message: string;
  address?: string;
  payLink?: string;
  invoiceId?: string;
  amount?: number;
  currency?: string;
}

export async function createOxaPayInvoice(data: OxaPayInvoiceRequest): Promise<OxaPayInvoiceResponse> {
  const payload = {
    amount: data.amount,
    currency: data.currency,
    lifetime: 60, // 60 minutes
    fee_paid_by_payer: 1,
    under_paid_coverage: 2.5,
    to_currency: "USDT",
    auto_withdrawal: false,
    mixed_payment: true,
    return_url: data.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
    callback_url: data.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/oxapay`,
    order_id: data.orderId,
    thanks_message: "Thank you for upgrading to Azazel Premium",
    description: data.description,
    sandbox: process.env.NODE_ENV !== 'production',
  };

  try {
    const response = await fetch(OXAPAY_API_URL, {
      method: 'POST',
      headers: {
        'merchant_api_key': MERCHANT_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('[OxaPay Service Error]', error);
    throw new Error('Failed to generate payment invoice');
  }
}
