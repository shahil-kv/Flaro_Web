export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      <p className="text-sm">
        © {new Date().getFullYear()} CoinVerse. All rights reserved..
      </p>
    </footer>
  );
}
