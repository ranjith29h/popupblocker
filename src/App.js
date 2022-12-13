import { useEffect, useRef, useState } from "react";
import "./styles.css";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function App() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isGooglePayActive, setIsGooglePayActive] = useState(null);
  const [handleButton, showHandleButton] = useState(false);
  const handleButtonRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const loadRazorPay = async () => {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/razorpay.js"
      );

      if (!res) {
        console.log("RazorPay not loaded");
      } else {
        setScriptLoaded(true);
      }
    };
    loadRazorPay();
  }, []);

  useEffect(() => {
    if (scriptLoaded) {
      const razorPay = new window.Razorpay({ key: "rzp_test_qsG2xZ18yZxLvh" });
      razorPay
        .checkPaymentAdapter("gpay")
        .then(() => {
          setIsGooglePayActive(true);
        })
        .catch(() => {
          setIsGooglePayActive(false);
        });
    }
  }, [scriptLoaded]);
  const confirmTime = {};

  confirmTime.open = function (data, callback) {
    let showModal = true;

    let handleSuccess = (e) => {
      alert("hello");
      callback(e);
    };

    if (showModal) {
      // setTimeout(() => {
      modelRef.current.style.display = "block";
      const element = handleButtonRef.current;
      showHandleButton(true);
      // const cp = document.querySelector(".handle_pay");
      element.addEventListener("click", handleSuccess, false);
      // }, 2000);
    }
  };

  const handlePay = () => {
    const razorPay = new window.Razorpay({
      key: "rzp_test_qsG2xZ18yZxLvh"
    });

    razorPay.on("payment.success", async function (response) {
      console.log(response);
    });
    razorPay.on("payment.error", async function (response) {
      console.log(response);
    });
    const razorPayRequestData = {
      method: "netbanking",
      bank: "SBIN",
      currency: "INR",
      email: "gopay_support@arzooo.com",
      contact: 8098908908,
      amount: 100,
      order_id: "order_Kr2GSx8kjYwd1V"
    };
    setTimeout(() => {
      confirmTime.open("Message", (e) => {
        razorPay.createPayment(razorPayRequestData, {});
      });
    }, 1000);
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button onClick={handlePay}>Pay</button>

      <div>
        <div id="myModal" ref={modelRef} className="modal">
          <div className="modal-content">
            <span className="close">&times;</span>
            <p>Some text in the Modal..</p>
            <button className="handle_pay" ref={handleButtonRef}>
              Handle Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
