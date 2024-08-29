export const getAuth = async (cookie: string) => {
    try {
        if (!cookie) {
            throw new Error("Unauthorized");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEAPI}/auth`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookie}`
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        return result;
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
} 