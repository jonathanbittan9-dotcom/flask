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
        log.info("returned the payment of the user🤑")
        return render_template("practice.html" , amount=amount_charged)
    except SyntaxError:
         log.exception("failed to return the payment of the user❌")
         return render_template()
# class login_system:


if __name__ == "__main__":
    log.info("the system ran ✔️")
    app.run(debug=True)