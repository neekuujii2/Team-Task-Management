import { useState } from "react";

export const useAsyncAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async (action) => {
    setLoading(true);
    setError("");

    try {
      return await action();
    } catch (err) {
      const message = err.response?.data?.msg || err.message || "Something went wrong";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, setError, run };
};
