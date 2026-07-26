import axios from "axios";

interface ApiErrorData {
  detail?: string;
  message?: string;
  error?: string;
}

export const getApiErrorMessage = (
  error: unknown,
): string => {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Something went wrong.";
  }

  if (!error.response) {
    return "Unable to connect to the server. Please check your connection.";
  }

  const data = error.response.data as
    | ApiErrorData
    | undefined;

  if (data?.detail) {
    return data.detail;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  switch (error.response.status) {
    case 400:
      return "Invalid request.";

    case 401:
      return "Your session has expired. Please sign in again.";

    case 403:
      return "You do not have permission to perform this action.";

    case 404:
      return "The requested resource was not found.";

    case 429:
      return "Too many requests. Please try again shortly.";

    case 500:
      return "Server error. Please try again later.";

    default:
      return "Something went wrong. Please try again.";
  }
};