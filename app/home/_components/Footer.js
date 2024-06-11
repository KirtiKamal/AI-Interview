import Link from "next/link";
const Footer = () => {
  return (
    <footer className="bg-gray-600 text-white py-4">
      <div className="container mx-auto text-center">
        <p>© 2024 INTER AI. All rights reserved.</p>
        <p>
          Created by <Link href="https://www.kirtikamal.me" target="blank">Kirti Kamal</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
