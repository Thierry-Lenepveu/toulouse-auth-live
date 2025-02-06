import { useEffect, useState } from "react";

interface Data {
  id: number;
  title: string;
  user_id: number;
}

function Items() {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/items`,
        );
        const json = await response.json();

        setData(json);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1>Items</h1>
      {data?.map((elem) => (
        <p key={elem.id}>{elem.title}</p>
      ))}
    </>
  );
}

export default Items;
