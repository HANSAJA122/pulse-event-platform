const { Client } = require("pg");

const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Djdya3ieEfH2@ep-patient-glitter-ayxjqft6.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function main() {
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    console.log("Connected successfully!");

    // Add stripeConnectAccountId to Team
    await client.query(`ALTER TABLE "Team" ADD COLUMN "stripeConnectAccountId" TEXT;`);
    console.log("Added stripeConnectAccountId to Team");

    // Add stripePriceId to TicketTier
    await client.query(`ALTER TABLE "TicketTier" ADD COLUMN "stripePriceId" TEXT;`);
    console.log("Added stripePriceId to TicketTier");

    // Add stripeSessionId to Rsvp
    await client.query(`ALTER TABLE "Rsvp" ADD COLUMN "stripeSessionId" TEXT;`);
    console.log("Added stripeSessionId to Rsvp");

    // Create TeamInvitation table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "TeamInvitation" (
        "id" TEXT NOT NULL,
        "teamId" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "role" "Role" NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "TeamInvitation_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log("Created TeamInvitation table");

    // Create unique constraint on token
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "TeamInvitation_token_key" ON "TeamInvitation"("token");`);
    // Create unique constraint on teamId and email
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "TeamInvitation_teamId_email_key" ON "TeamInvitation"("teamId", "email");`);
    
    // Add foreign key constraint
    await client.query(`
      ALTER TABLE "TeamInvitation" ADD CONSTRAINT "TeamInvitation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);
    console.log("Added TeamInvitation constraints");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

main();
