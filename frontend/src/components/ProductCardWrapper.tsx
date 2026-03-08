import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function ProductCardWrapper(props: any) {
  return (
    <Link to={`/product/${props.id}`} className="block">
      <ProductCard {...props} />
    </Link>
  );
}