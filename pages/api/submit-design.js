export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("req.body");
    console.log(req.body);

    // const response = await fetch(
    //   "https://hooks.zapier.com/hooks/catch/36623/2sa58vh/",
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(req.body),
    //   }
    // );

    // if (!response.ok) {
    //   throw new Error("Failed to submit to Zapier");
    // }

    // const data = await response.json();
    // res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit design" });
  }
}
