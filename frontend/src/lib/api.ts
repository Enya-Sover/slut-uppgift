

export async function getProperties() {
    const res = await fetch(`http://localhost:3000/property`, {
        cache: "no-store",
      });
    
      if (!res.ok) {
        throw new Error("Kunde inte hämta properties");
      }
    const { data } = await res.json();
    return data;

    }