
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const allowed = ["name", "email", "project-type", "message"];
    const data = req.body || {};
    const form = new URLSearchParams();

    for (const key of allowed) {
      const value = data[key];
      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({ error: "Invalid form data" });
      }
      form.set(key, value.trim());
    }

    const response = await fetch(
      `https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form.toString()
      }
    );

    if (!response.ok) {
      return res.status(502).json({ error: "Unable to send enquiry" });
    }

    return res.status(200).json({
      message: "Enquiry sent successfully."
    });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
}
