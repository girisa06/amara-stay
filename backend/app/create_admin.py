"""Create an admin account or explicitly promote an existing user from a terminal."""

from getpass import getpass

from sqlalchemy.exc import IntegrityError

from app.core.security import hash_password
from app.database import SessionLocal
from app.models.user import User, UserRole


def main():
    print("AMARA Stay administrator setup")
    name = input("Administrator name: ").strip()
    email = input("Administrator email: ").strip().lower()
    if not name or not email:
        print("Name and email are required.")
        return 1

    with SessionLocal() as db:
        user = db.query(User).filter(User.email == email).with_for_update().first()
        if user:
            if user.role == UserRole.admin:
                print("That account is already an administrator.")
                return 0
            answer = input(f"Promote existing account {email} to administrator? Type PROMOTE to confirm: ")
            if answer != "PROMOTE":
                print("No changes made.")
                return 1
            user.role = UserRole.admin
        else:
            password = getpass("New administrator password (minimum 12 characters): ")
            confirmation = getpass("Confirm password: ")
            if len(password) < 12:
                print("Password must be at least 12 characters.")
                return 1
            if password != confirmation:
                print("Passwords did not match.")
                return 1
            user = User(
                name=name,
                email=email,
                password_hash=hash_password(password),
                role=UserRole.admin,
            )
            db.add(user)

        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            print("The account changed while setup was running. No changes were applied; try again.")
            return 1

    print(f"Administrator access is enabled for {email}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
