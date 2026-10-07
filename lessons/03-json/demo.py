"""
Lesson 03 demo: receiving JSON safely.

Run:  flask --app lessons/03-json/demo.py run --debug
Then send the requests in the Postman folder "03 JSON".
"""
from flask import Flask, request, url_for

app = Flask(__name__)

# In-memory storage. Restarting the server clears it (a real database comes in lesson 08).
products = []
next_product_id = 1


@app.post("/echo")
def echo():
    # silent=True: wrong Content-Type or broken JSON → None, instead of an HTML error page.
    data = request.get_json(silent=True)
    return {
        "content_type": request.content_type,
        "parsed": data,
        "python_type": type(data).__name__,
    }


@app.post("/products")
def create_product():
    global next_product_id
    data = request.get_json(silent=True)

    # 1. Is it a JSON object at all?
    if not isinstance(data, dict):
        return {"error": "request body must be a JSON object"}, 400

    # 2. Required fields present? Report all of them at once.
    missing = [field for field in ("name", "price") if field not in data]
    if missing:
        return {"error": f"missing field(s): {', '.join(missing)}"}, 400

    # 3. Right types? bool is a subclass of int, so exclude it explicitly.
    name, price = data["name"], data["price"]
    if not isinstance(name, str):
        return {"error": "name must be a string"}, 400
    if not isinstance(price, (int, float)) or isinstance(price, bool):
        return {"error": "price must be a number"}, 400

    # 4. Right values?
    if not name.strip():
        return {"error": "name must not be blank"}, 400
    if price < 0:
        return {"error": "price must not be negative"}, 400

    # All good: do the work.
    product = {"id": next_product_id, "name": name.strip(), "price": price}
    products.append(product)
    next_product_id += 1

    location = url_for("get_product", product_id=product["id"])
    return product, 201, {"Location": location}


@app.get("/products/<int:product_id>")
def get_product(product_id):
    for product in products:
        if product["id"] == product_id:
            return product
    return {"error": f"product {product_id} not found"}, 404


@app.get("/products")
def list_products():
    return products
