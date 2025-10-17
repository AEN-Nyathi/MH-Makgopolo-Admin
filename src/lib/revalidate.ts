export async function revalidateClientPath(path: string) {
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
  const secretToken = process.env.REVALIDATION_SECRET_TOKEN;

  if (!clientUrl || !secretToken) {
    console.error('Missing client URL or revalidation token for revalidation.');
    return;
  }

  try {
    const response = await fetch(`${clientUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidation-secret': secretToken,
      },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Failed to revalidate path ${path}:`, errorData.message);
    } else {
      const data = await response.json();
      console.log(`Successfully revalidated path ${path}:`, data);
    }
  } catch (error) {
    console.error(`Error during revalidation for path ${path}:`, error);
  }
}
