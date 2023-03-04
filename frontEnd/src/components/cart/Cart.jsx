import "./cart.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { removeItem, resetCart } from "../../redux/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import { makeRequest } from "../../makeRequest";
import { loadStripe } from "@stripe/stripe-js";

const Cart = () => {
  const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();

  const total = () => {
    let total = 0;
    products.forEach((item) => (total += item.quantity * item.price));
    return total.toFixed(2);
  };

  const stripePromise = loadStripe('pk_test_51MTekfSAcccjYzOiKRU6BZQM0ZAK6Lyvo6ThTGNQBiSzQ7dxCjGY9kfJrcB5IAw0ZUT69LLloDlaES4rC7c5C5be00hhuGQam9');

  const handelPayment = async () => {
    try {
      const stripe = await stripePromise;

      const res = await makeRequest.post("/orders", products);

      await stripe.redirectToCheckout({
        sessionId:res.data.stripeSession.id,
      })
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="cart">
      <h2>Product in your cart</h2>
      {products?.map((item) => (
        <div className="item" key={item.id}>
          <img src={item.img} alt="" />
          <div className="details">
            <h2>{item.title}</h2>
            <p>{item.desc.substring(0, 30)}</p>
            <div className="price">
              {item.quantity} x ${item.price}
            </div>
          </div>
          <DeleteIcon
            className="delete"
            onClick={() => dispatch(removeItem(item.id))}
          />
        </div>
      ))}
      <div className="total">
        <span>SUBTOTAL</span>
        <span>${total()}</span>
      </div>
      <button onClick={handelPayment}>PROCEED TO CHECKOUT</button>
      <span className="reset" onClick={() => dispatch(resetCart())}>
        Reset Cart
      </span>
    </div>
  );
};

export default Cart;
