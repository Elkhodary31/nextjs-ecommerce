"use client";
export default function Footer() {
  return (
    <footer className=" bottom-0 left-0 text-white bg-black w-full gap-8 py-16 ">
      <div className="my-container center flex-col md:flex-row">
        <div className=" ">
          <div>
            <h4 className="text-3xl font-bold py-3 ">Exclusive</h4>
            <h5 className="text-2xl mb-2">Subscribe</h5>
            <p>Get 10% off ypur first order</p>
            <input type="email" placeholder="Enter Your Email" />
          </div>
        </div>
        <div className=" ">
          <h4 className="text-3xl font-bold py-3">Support</h4>
          <p className="">
            111 Bijoy sarani, Dhaka,
            <br /> DH 1515, Bangladesh.
          </p>
          <p>exclusive@gmail.com</p>
          <p>+88015-88888-9999</p>
        </div>
        <div className=" ">
          <h4 className="text-3xl font-bold py-3">My Account</h4>
          <p>Login / Register</p>
          <p>Cart</p>
          <p>Wishlist</p>
          <p>Shop</p>
        </div>
        <div className=" ">
          <h4 className="text-3xl font-bold py-3">Quick Link</h4>
          <p>Privacy Policy</p>
          <p>Terms Of Use</p>
          <p>FAQ</p>
          <p>Contact</p>
        </div>
      </div>
    </footer>
  );
}
