import jwt from "jsonwebtoken";

interface WalletEvent {
  title: string;
  startAt: Date;
  locationType: string;
}

interface WalletRsvp {
  id: string;
  guestName: string;
}

/**
 * Generates a Save to Google Pay link containing an EventTicketObject.
 * This function will fail gracefully (return null) if credentials are not configured.
 */
export function generateGoogleWalletLink(event: WalletEvent, rsvp: WalletRsvp): string | null {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  // Private keys in env vars sometimes have literal \n instead of actual newlines.
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!issuerId || !clientEmail || !privateKey) {
    console.log("[Google Wallet] Missing credentials, skipping wallet link generation.");
    return null;
  }

  const classId = `${issuerId}.pulse-event-${event.title.replace(/[^a-zA-Z0-9]/g, '')}`;
  const objectId = `${issuerId}.${rsvp.id}`;

  const claims = {
    iss: clientEmail,
    aud: "google",
    typ: "savetowallet",
    iat: Math.floor(Date.now() / 1000),
    payload: {
      eventTicketClasses: [
        {
          id: classId,
          issuerName: "Pulse Event Platform",
          eventName: {
            defaultValue: {
              language: "en-US",
              value: event.title
            }
          },
          reviewStatus: "UNDER_REVIEW"
        }
      ],
      eventTicketObjects: [
        {
          id: objectId,
          classId: classId,
          state: "ACTIVE",
          barcode: {
            type: "QR_CODE",
            value: rsvp.id,
            alternateText: rsvp.id
          },
          ticketHolderName: rsvp.guestName,
          ticketNumber: rsvp.id,
        }
      ]
    }
  };

  try {
    const token = jwt.sign(claims, privateKey, { algorithm: "RS256" });
    return `https://pay.google.com/gp/v/save/${token}`;
  } catch (error) {
    console.error("[Google Wallet] Failed to sign JWT:", error);
    return null;
  }
}
