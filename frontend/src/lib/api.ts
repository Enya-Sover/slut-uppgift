
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

export async function handleLogin(userdata: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userdata),
    credentials: "include"
  });

  if (!res.ok) {
    let message = "Could not login user";
    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch (e) {
    }
    throw new Error(message);
  }

  return res.json();
}

export async function createProperty (propertyData: {
  name: string;
  image_url?: string;
  description: string;
  location: string;
  price_per_night: number;
  availability: boolean;
}) {
  const cleanData = { ...propertyData };

  if (cleanData.image_url === "") {
    delete cleanData.image_url;
  }
  const res = await fetch(`${baseUrl}/property`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(propertyData),
    credentials: "include"
  });

  if (!res.ok) {
    let message = "Could not create property";
    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch (e) {
    }
    throw new Error(message);
  }

  return res.json();
}

export async function getMyProperties() {
  const res = await fetch(`${baseUrl}/property/mine`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Could not fetch properties");
  }

  return res.json();
}

export async function deleteProperty (id: string) {
  const res = await fetch(`${baseUrl}/property/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (!res.ok) {
    let message = "Could not delete property";
    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch (e) {
    }
    throw new Error(message);
  }

  return res.json();
}

export async function editProperty(id: string, updatedData: Partial<Property>) {
  const res = await fetch(`${baseUrl}/property/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updatedData)
  });
  console.log(res)

  if (!res.ok) {
    let message = "Could not edit property";
    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch (e) {}
    throw new Error(message);
  }

  return res.json();
}
