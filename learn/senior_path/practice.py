from abc import ABC, abstractmethod
import logging
import colorlog
from flask import Flask
import json
import discord
handler = colorlog.StreamHandler()
handler.setFormatter(colorlog.ColoredFormatter(
    "%(log_color)s%(asctime)s [%(levelname)s]%(reset)s %(blue)s%(name)s%(reset)s: %(message)s",
    datefmt="%H:%M:%S",
    log_colors={"DEBUG": "cyan", "INFO": "green", "WARNING": "yellow",
                "ERROR": "red", "CRITICAL": "bold_red"},

    
))

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG, handlers=[handler]),

log=logging.getLogger(__name__)

format=("[%(levelname)s] %(message)s")

class PaymentProcessor(ABC):
    @abstractmethod
    def procces(self, amount: float) -> str:
        ...
@app.route("/shop")
def shop_collection():
    shop_items={
        "switch 2" , "ps5" , "RTX 5090" , " Xbox"
    }
def payment_process():
    class paymentmastercard(PaymentProcessor):
        def procces(self, amount: int) ->  str:
            self.amount = amount
            log.info("returned the paymentProccesor")
            return f"payment: {self.amount} dollars charged..."
    # class paymentmastercardfail(paymentmastercard):
        # pass

    pay = paymentmastercard()
if __name__ == "__main__":
    log.info("the system ran ✔️")
    app.run(debug=True)
