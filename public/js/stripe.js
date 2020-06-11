const PUBLISHABLE_KEY = "pk_test_z0N02J9qDzvA71sECjRyDVnv00XHn7bHU5";
  const DOMAIN = window.location.origin;

  const SUBSCRIPTION_ID = "plan_HLkAa21bsWHQwD";

  var stripe = Stripe(PUBLISHABLE_KEY)

  var handleResult = (result) => {
    if(result.error) {
      var displayError = document.getElementById("error-message")
      displayError.textContent = result.error.message
    }
  }

  var redirectToCheckout = (priceId) => {
    stripe.redirectToCheckout({
      lineItems: [{
        price: priceId,
        quantity: 1
      }],
      mode: 'subscription',
      successUrl: DOMAIN + "/profile/purchase-successful?session_id={CHECKOUT_SESSION_ID}",
      cancelUrl: DOMAIN + "/profile/purchase-cancelled"
    }).then(handleResult)
  }

  document.getElementById("purchase")
  .addEventListener("click", (evt) => {
    redirectToCheckout(SUBSCRIPTION_ID)
  })