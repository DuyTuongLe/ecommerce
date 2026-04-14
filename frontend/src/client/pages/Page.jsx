import { useParams } from "react-router-dom";

export default function Page() {
  const { slug } = useParams();

  return <h2>Page: {slug}</h2>;
}