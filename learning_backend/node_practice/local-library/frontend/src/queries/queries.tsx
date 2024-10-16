type QueryKey = ["author-count"];

function generateURL(path: string) {
  return "http://localhost:3000/api" + path;
}

export function getQueryOptions(key: QueryKey) {
  let queryFn;
  switch (key[0]) {
    case "author-count":
      queryFn = async () => {
        const response = await fetch(generateURL("/test"));
        return response.json();
      };
      break;
    default:
      throw new Error("Invalid query key");
  }

  return {
    queryKey: key,
    queryFn,
  };
}
