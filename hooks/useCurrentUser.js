// Import the 'useSWR' hook from the 'swr' library.
import useSWR from "swr";

// Import the 'fetcher' function from '@/lib/fetcher' (fetcher is typically used for making API requests).
import fetcher from "@/lib/fetcher";

// Create a custom hook named 'useCurrentUser'.
const useCurrentUser = () => {
  // Use the 'useSWR' hook to fetch data from the '/api/current' endpoint using the 'fetcher' function.
  const { data, error, isLoading, mutate } = useSWR("/api/current", fetcher);

  // Return an object with properties related to the fetched data and the 'mutate' function.
  return {
    data, // Fetched data (if available).
    error, // Error (if any occurred during the fetch).
    isLoading, // Indicates if the fetch is currently in progress.
    mutate, // A function to manually trigger a re-fetch of the data.
  };
};

// Export the 'useCurrentUser' hook for use in other parts of your application.
export default useCurrentUser;
