import { Client } from "@hubspot/api-client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const hubspotClient = new Client({
      accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
    });

    const { properties } = req.body;

    // Create or update contact in HubSpot
    const response = await hubspotClient.crm.contacts.basicApi.create({
      properties: {
        ...properties,
        lifecycle_stage: "lead",
        lead_source: "Custom Sock Designer",
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("HubSpot API Error:", error);
    res.status(500).json({ error: "Failed to create contact in HubSpot" });
  }
}
