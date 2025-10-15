
const baseUrl = "http://localhost:3000";
export async function getProperties() {
    const res = await fetch(`${baseUrl}/property`, {
        cache: "no-store",
      });
    
      if (!res.ok) {
        throw new Error("Could not fetch properties");
      }
    const { data } = await res.json();
    return data;

    }


    export async function registerUser(userData: {
      email: string;
      password: string;
      name: string;
    }) {
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
    
      if (!res.ok) {
        throw new Error("Could not register user");
      }
    
      return res.json();
    }
    