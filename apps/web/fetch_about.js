import { createClient } from "next-sanity";

const client = createClient({
  projectId: "YOUR_PROJECT_ID", // I need to get this from env or config
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function main() {
  const data = await client.fetch(`*[_type == "aboutPage"][0]`);
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
