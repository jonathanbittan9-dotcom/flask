from abc import ABC, abstractmethod
from flask import Flask , render_template
import json
import bot
from config import app_config
from logs_setup import log
app = Flask(__name__)

format=("[%(levelname)s] %(message)s")


class paymentmastercard():
        def __init__(self, amount: float) ->  float:
            self.amount = amount
        def __repr__(self) -> str:
            return f"payment: {self.amount} dollars charged..."

amount_charged = paymentmastercard(80)
    # class paymentmastercardfail(paymentmastercard):
@app.route("/pay")
def payment_process():
    try:
        log.info("trying to return the payment of the user...")
        respone = render_template("practice.html" , amount=amount_charged)
        log.info("returned the the payment of the user🤑")

    except Exception:
         log.exception("failed to return the payment of the user❌")
         return render_template("errorpage.html")
# class login_system:


if __name__ == "__main__":
    log.info("the system ran ✔️")
    app.run(debug=True)