"""
02_oop_design_principles.py

Section 2: Object-Oriented & Design Principles
    - Inheritance vs. composition
    - Abstract base classes / interfaces
    - SOLID principles
    - Design patterns: Factory, Singleton, Strategy, Observer, Repository, Adapter
    - Dataclasses, @property

Run: python 02_oop_design_principles.py
"""

from abc import ABC, abstractmethod
# New words in this line:
#   abc              -> standard library module: "Abstract Base Classes"
#   ABC               -> a base class you inherit from to make YOUR class
#                        abstract (can't be instantiated directly)
#   abstractmethod    -> a decorator marking one method as "subclasses MUST
#                        override this"
from dataclasses import dataclass, field
# New words in this line:
#   field  -> a function (different from the @dataclass decorator itself)
#             used to configure a single dataclass attribute in detail —
#             see its use further down in this file


# ---------------------------------------------------------------------------
# Inheritance vs. Composition
# ---------------------------------------------------------------------------
# Inheritance: "IS-A" relationship. Use sparingly — deep hierarchies get rigid.
class Animal:
    def speak(self):
        raise NotImplementedError


class Dog(Animal):
    def speak(self):
        return "Woof"


# Composition: "HAS-A" relationship. Usually more flexible than inheritance,
# because you can swap the parts out at runtime.
class Engine:
    def start(self):
        return "Engine started"


class Car:
    def __init__(self):
        self.engine = Engine()   # Car HAS-A engine, not IS-A engine

    def start(self):
        return self.engine.start()


def demo_inheritance_vs_composition():
    print("\n--- Inheritance vs Composition ---")
    print(Dog().speak())
    print(Car().start())
    # Rule of thumb: "favor composition over inheritance" — swapping self.engine
    # for an ElectricEngine at runtime is easy; swapping a base class is not.


# ---------------------------------------------------------------------------
# Abstract Base Classes / Interfaces
# ---------------------------------------------------------------------------
class PaymentProcessor(ABC):
    # New words in this line:
    #   (ABC) as a base class  -> combined with @abstractmethod below, this
    #        defines an "interface": a class that CANNOT be instantiated
    #        directly, and forces every subclass to implement the marked
    #        method(s) or Python refuses to build an instance of THEM either
    """An interface: any subclass MUST implement process()."""

    @abstractmethod
    # New words in this line:
    #   @abstractmethod  -> marks the method directly below as one every
    #        concrete subclass is REQUIRED to override
    def process(self, amount: float) -> str:
        ...
        # New words in this line:
        #   ...  -> the Ellipsis object, used here purely as a placeholder
        #        function body meaning "no implementation — subclasses must
        #        provide one." Equivalent to writing `pass`, but
        #        conventionally used for abstract/stub method bodies.


class CreditCardProcessor(PaymentProcessor):
    def process(self, amount: float) -> str:
        return f"Charged ${amount:.2f} to credit card"


class PayPalProcessor(PaymentProcessor):
    def process(self, amount: float) -> str:
        return f"Charged ${amount:.2f} via PayPal"


def demo_abc():
    print("\n--- Abstract Base Classes ---")
    for processor in (CreditCardProcessor(), PayPalProcessor()):
        print(processor.process(19.99))

    try:
        PaymentProcessor()   # can't instantiate an abstract class
    except TypeError as e:
        # New words in this line:
        #   TypeError  -> a BUILT-IN exception class (you don't have to
        #        write your own, as in core_language_mastery.py's
        #        BookNotFoundError, to catch or raise a standard one).
        #        Python itself raises this specific one when you try to
        #        instantiate an abstract class.
        print("Expected error:", e)


# ---------------------------------------------------------------------------
# SOLID Principles (one small example per letter)
# ---------------------------------------------------------------------------
# S — Single Responsibility: a class should have ONE reason to change.
class InvoicePrinter:
    """Only responsible for printing — not calculating totals, not saving to DB."""
    def print_invoice(self, invoice: dict):
        print(f"Invoice for {invoice['customer']}: ${invoice['total']}")


# O — Open/Closed: open for extension, closed for modification.
# (Adding a new Shape subclass doesn't require editing total_area)
class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        ...


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self) -> float:
        return 3.14159 * self.radius ** 2


class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self) -> float:
        return self.side ** 2


def total_area(shapes: list[Shape]) -> float:
    # New words in this line:
    #   list[Shape]  -> a generic type hint (same style as core_language_mastery.py's
    #        dict[str, bool]) meaning "a list whose items are all Shape objects"
    return sum(s.area() for s in shapes)
    # New words in this line:
    #   sum(iterable)  -> built-in function: adds up every value produced by
    #        the generator expression `s.area() for s in shapes` — never
    #        needs editing when a new Shape subclass is added


# L — Liskov Substitution: subclasses must be usable wherever the base class is
# expected, without breaking behavior. (Circle/Square above both honor this —
# any Shape can be passed to total_area().)

# I — Interface Segregation: don't force a class to implement methods it
# doesn't need. Split fat interfaces into smaller, focused ones.
class Printable(ABC):
    @abstractmethod
    def print_out(self):
        ...


class Scannable(ABC):
    @abstractmethod
    def scan(self):
        ...


class SimplePrinter(Printable):
    """Doesn't need to implement scan() because Printable is small and focused."""
    def print_out(self):
        return "Printing..."


# D — Dependency Inversion: depend on abstractions, not concrete implementations.
class NotificationSender(ABC):
    @abstractmethod
    def send(self, message: str):
        ...


class EmailSender(NotificationSender):
    def send(self, message: str):
        return f"Emailing: {message}"


class OrderService:
    def __init__(self, sender: NotificationSender):   # depends on the ABSTRACTION
        self.sender = sender

    def place_order(self):
        return self.sender.send("Order placed!")


def demo_solid():
    print("\n--- SOLID ---")
    InvoicePrinter().print_invoice({"customer": "Alice", "total": 42})
    print("total_area:", total_area([Circle(2), Square(3)]))
    print(SimplePrinter().print_out())
    print(OrderService(EmailSender()).place_order())
    # Swap EmailSender() for SmsSender() with zero changes to OrderService — that's the payoff.


# ---------------------------------------------------------------------------
# Design Patterns
# ---------------------------------------------------------------------------

# --- Factory: centralizes object creation logic ---
class BookFactory:
    @staticmethod
    # New words in this line:
    #   @staticmethod  -> marks the method below as one that doesn't take
    #        `self` (or `cls`) — it doesn't need access to any particular
    #        instance, so it can be called as BookFactory.create(...) without
    #        ever creating a BookFactory() instance first
    def create(kind: str, title: str):
        if kind == "ebook":
            return {"type": "ebook", "title": title, "file_size": "10MB"}
        elif kind == "physical":
            # New words in this line:
            #   elif  -> "else if" — chains another condition after an `if`,
            #        checked only when the first `if` was False
            return {"type": "physical", "title": title, "shelf": "A1"}
        raise ValueError(f"Unknown book kind: {kind}")
        # New words in this line:
        #   ValueError  -> a built-in exception meaning "the type is right,
        #        but this particular value doesn't make sense here"


# --- Singleton: only one instance ever exists ---
class AppConfig:
    _instance = None
    # New words in this line:
    #   _instance (leading underscore)  -> a NAMING CONVENTION, not enforced
    #        by Python — signals "internal, don't touch this from outside
    #        the class"

    def __new__(cls):
        # New words in this line:
        #   __new__       -> a dunder method that runs BEFORE __init__ — it's
        #        actually responsible for CREATING the object in memory.
        #        __init__ only initializes an object that already exists.
        #        Overriding __new__ lets you return an EXISTING object
        #        instead of always creating a fresh one.
        #   cls           -> conventional parameter name meaning "the class
        #        itself" (AppConfig), the same role `self` plays for an
        #        instance
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            # New words in this line:
            #   super().__new__(cls)  -> calls the PARENT class's __new__ to
            #        actually allocate the object in memory — same
            #        relationship as super().__init__() from
            #        core_language_mastery.py, but for the creation step
            #        instead of the initialization step
            cls._instance.settings = {}
        return cls._instance


# --- Strategy: swap an algorithm at runtime ---
class DiscountStrategy(ABC):
    @abstractmethod
    def apply(self, price: float) -> float:
        ...


class NoDiscount(DiscountStrategy):
    def apply(self, price):
        return price


class TenPercentOff(DiscountStrategy):
    def apply(self, price):
        return price * 0.9


class Checkout:
    def __init__(self, strategy: DiscountStrategy):
        self.strategy = strategy

    def total(self, price: float) -> float:
        return self.strategy.apply(price)


# --- Observer: notify subscribers when something happens ---
class EventPublisher:
    def __init__(self):
        self._subscribers = []

    def subscribe(self, callback):
        self._subscribers.append(callback)

    def publish(self, event: str):
        for callback in self._subscribers:
            callback(event)


# --- Repository: hides data-access details behind a simple interface ---
class BookRepository:
    """In real code this would talk to MongoDB/SQL. Callers don't need to know that."""
    def __init__(self):
        self._books = {}

    def add(self, book_id: str, book: dict):
        self._books[book_id] = book

    def get(self, book_id: str) -> dict | None:
        # New words in this line:
        #   dict | None  -> a union type hint meaning "returns a dict, or
        #        None." `|` between two types means "either type is
        #        acceptable" — the modern (Python 3.10+) alternative
        #        spelling of core_language_mastery.py's Optional[dict]
        return self._books.get(book_id)


# --- Adapter: makes an incompatible interface fit what your code expects ---
class OldLogger:
    def write_log(self, msg):   # legacy method name
        print(f"[old logger] {msg}")


class LoggerAdapter:
    """Adapts OldLogger's write_log() to the .log() interface the rest of the app expects."""
    def __init__(self, old_logger: OldLogger):
        self._old_logger = old_logger

    def log(self, msg):
        self._old_logger.write_log(msg)


def demo_patterns():
    print("\n--- Design Patterns ---")

    print("Factory:", BookFactory.create("ebook", "1984"))

    cfg1, cfg2 = AppConfig(), AppConfig()
    cfg1.settings["debug"] = True
    print("Singleton — same instance:", cfg1 is cfg2, cfg2.settings)

    print("Strategy (no discount):", Checkout(NoDiscount()).total(100))
    print("Strategy (10% off):", Checkout(TenPercentOff()).total(100))

    publisher = EventPublisher()
    publisher.subscribe(lambda e: print(f"Subscriber A got: {e}"))
    # New words in this line:
    #   lambda e: expr  -> a small ANONYMOUS function written inline: `e` is
    #        its parameter, and everything after the `:` is the single
    #        expression it evaluates and returns. Equivalent to writing:
    #            def handler(e):
    #                return print(...)
    #        and passing `handler` instead — a lambda can only ever contain
    #        one expression, no statements, no multiple lines.
    publisher.subscribe(lambda e: print(f"Subscriber B got: {e}"))
    publisher.publish("book_borrowed")

    repo = BookRepository()
    repo.add("b1", {"title": "1984"})
    print("Repository:", repo.get("b1"))

    LoggerAdapter(OldLogger()).log("Adapter pattern in action")


# ---------------------------------------------------------------------------
# Dataclasses & @property
# ---------------------------------------------------------------------------
@dataclass
class Book:
    title: str
    author: str
    _available: bool = field(default=True, repr=False)
    # New words in this line:
    #   field(...)      -> dataclasses' way to configure a field beyond a
    #        simple default value (finer control than just `= True`)
    #   default=True    -> sets the default value, same effect as `= True`
    #        would have on its own
    #   repr=False      -> hides this specific field from the
    #        auto-generated __repr__ (useful here since it's exposed below
    #        through a differently-named public property instead)

    @property
    # New words in this line:
    #   @property  -> lets you call `book.available` like a plain attribute
    #        (no parentheses), but it actually runs the method below every
    #        time it's accessed
    def available(self) -> bool:
        return self._available

    @available.setter
    # New words in this line:
    #   @available.setter  -> pairs with @property above; marks the method
    #        below as what runs whenever code does `book.available = X`,
    #        letting you validate/transform X instead of just overwriting
    #        the attribute directly
    def available(self, value: bool):
        if not isinstance(value, bool):
            # New words in this line:
            #   isinstance(value, Type)  -> built-in function: checks
            #        whether `value` is of that type (or a subclass of it)
            #        — more flexible than `type(value) == bool`, which would
            #        reject subclasses of bool
            raise TypeError("available must be a bool")
        self._available = value


def demo_dataclass_property():
    print("\n--- Dataclasses & @property ---")
    book = Book("1984", "Orwell")
    print(book, "available:", book.available)
    book.available = False
    print("after borrowing:", book.available)
    try:
        book.available = "nope"   # rejected by the setter's validation
    except TypeError as e:
        print("Expected error:", e)


if __name__ == "__main__":
    demo_inheritance_vs_composition()
    demo_abc()
    demo_solid()
    demo_patterns()
    demo_dataclass_property()
